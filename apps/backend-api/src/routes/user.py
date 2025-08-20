# File: src/routes/user.py
from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from functools import wraps
from typing import Any, Dict, Optional, Tuple

import jwt
from flask import Blueprint, current_app, jsonify, request

from src.models.models import User, UserRole, db


# Blueprint
user_bp = Blueprint("user", __name__)

# -----------------------------
# Utilities
# -----------------------------

def _jwt_settings() -> Dict[str, Any]:
    """Resolve JWT settings from Flask config or environment.
    Why: avoid hardcoding secrets and make expiry/issuer configurable.
    """
    cfg = current_app.config
    return {
        "secret": cfg.get("JWT_SECRET", os.environ.get("JWT_SECRET", "change-me-in-prod")),
        "algorithm": cfg.get("JWT_ALGORITHM", "HS256"),
        "expires_seconds": int(cfg.get("JWT_EXPIRES_SECONDS", os.environ.get("JWT_EXPIRES_SECONDS", 7 * 24 * 3600))),
        "issuer": cfg.get("JWT_ISSUER", os.environ.get("JWT_ISSUER", "app")),
        "audience": cfg.get("JWT_AUDIENCE", os.environ.get("JWT_AUDIENCE", "app-users")),
        "leeway": int(cfg.get("JWT_LEEWAY_SECONDS", os.environ.get("JWT_LEEWAY_SECONDS", 10))),
    }


def _generate_access_token(user: User) -> str:
    settings = _jwt_settings()
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user.id),
        "user_id": user.id,  # backward-compatible
        "role": user.role.value if hasattr(user.role, "value") else str(user.role),
        "iat": now,
        "nbf": now,
        "exp": now + timedelta(seconds=settings["expires_seconds"]),
        "iss": settings["issuer"],
        "aud": settings["audience"],
    }
    token = jwt.encode(payload, settings["secret"], algorithm=settings["algorithm"])
    if isinstance(token, bytes):  # PyJWT<2 returns bytes
        token = token.decode("utf-8")
    return token


def _decode_token(token: str) -> Dict[str, Any]:
    settings = _jwt_settings()
    return jwt.decode(
        token,
        settings["secret"],
        algorithms=[settings["algorithm"]],
        audience=settings["audience"],
        issuer=settings["issuer"],
        leeway=settings["leeway"],
        options={"require": ["exp", "iat", "nbf", "iss", "aud"]},
    )


def _error(message: str, status: int) -> Tuple[Any, int]:
    return jsonify({"message": message}), status


def _require_json() -> Optional[Tuple[Any, int]]:
    if not request.is_json:
        return _error("Content-Type must be application/json", 415)
    return None


def _extract_bearer_token() -> Optional[str]:
    auth = request.headers.get("Authorization", "").strip()
    if auth.lower().startswith("bearer "):
        return auth[7:].strip()
    # Fallback for tests/tools
    return request.args.get("token") or request.cookies.get("access_token")


def _parse_role(value: Optional[str]) -> UserRole:
    """Parse role string to UserRole, defaulting to buyer; raise on invalid.
    Why: prevent invalid enum values from causing 500s.
    """
    if value is None:
        return UserRole("buyer")
    try:
        return UserRole(value.lower())
    except Exception:
        raise ValueError("Invalid role")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = _extract_bearer_token()
        if not token:
            return _error("Token is missing", 401)
        try:
            data = _decode_token(token)
            user_id = data.get("user_id") or data.get("sub")
            try:
                user_id_int = int(user_id)
            except Exception:
                return _error("Invalid token", 401)
            user = db.session.get(User, user_id_int)
            if not user:
                return _error("Invalid token", 401)
        except jwt.ExpiredSignatureError:
            return _error("Token has expired", 401)
        except jwt.InvalidTokenError:
            return _error("Invalid token", 401)
        return f(user, *args, **kwargs)

    return decorated


def admin_required(f):
    @wraps(f)
    def decorated(current_user: User, *args, **kwargs):
        if current_user.role != UserRole.ADMIN:
            return _error("Admin access required", 403)
        return f(current_user, *args, **kwargs)

    return decorated


# -----------------------------
# Routes: Auth
# -----------------------------

@user_bp.route("/auth/register", methods=["POST"])
def register():
    if (err := _require_json()) is not None:
        return err
    data = request.get_json(silent=True) or {}

    required = ["email", "username", "first_name", "last_name", "password"]
    missing = [k for k in required if not data.get(k)]
    if missing:
        return _error(f"Missing fields: {', '.join(missing)}", 400)

    email = str(data["email"]).strip().lower()
    username = str(data["username"]).strip()

    try:
        # Uniqueness checks
        if User.query.filter_by(email=email).first():
            return _error("Email already registered", 400)
        if User.query.filter_by(username=username).first():
            return _error("Username already taken", 400)

        user = User(
            username=username,
            email=email,
            first_name=data["first_name"].strip(),
            last_name=data["last_name"].strip(),
            phone=(data.get("phone") or None),
            role=_parse_role(data.get("role")),
            address_line1=data.get("address_line1"),
            address_line2=data.get("address_line2"),
            city=data.get("city"),
            postcode=data.get("postcode"),
            country=data.get("country", "UK"),
        )
        user.set_password(data["password"])  # assumes model handles hashing/salt

        db.session.add(user)
        db.session.commit()

        token = _generate_access_token(user)

        return (
            jsonify({"message": "User registered successfully", "token": token, "user": user.to_dict()}),
            201,
        )
    except ValueError as ve:
        db.session.rollback()
        return _error(str(ve), 400)
    except Exception as e:  # keep generic; log in real app
        db.session.rollback()
        return _error(f"Registration failed", 500)


@user_bp.route("/auth/login", methods=["POST"])
def login():
    if (err := _require_json()) is not None:
        return err
    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    if not email or not password:
        return _error("Email and password required", 400)

    try:
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return _error("Invalid credentials", 401)
        if not getattr(user, "is_active", True):
            return _error("Account is deactivated", 401)

        token = _generate_access_token(user)

        return jsonify({"message": "Login successful", "token": token, "user": user.to_dict()}), 200
    except Exception:
        return _error("Login failed", 500)


@user_bp.route("/auth/me", methods=["GET"])
@token_required
def get_current_user(current_user: User):
    return jsonify({"user": current_user.to_dict()}), 200


# Alias for /profile (backward compat with clients expecting that route)
@user_bp.route("/profile", methods=["GET"])
@token_required
def get_user_profile(current_user: User):
    return get_current_user(current_user)


# -----------------------------
# Routes: Users (admin + self-service)
# -----------------------------

MAX_PER_PAGE = 100


@user_bp.route("/users", methods=["GET"])
@token_required
@admin_required
def get_users(current_user: User):
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        per_page = max(1, min(per_page, MAX_PER_PAGE))
        role_param = request.args.get("role")

        query = User.query
        if role_param:
            query = query.filter_by(role=_parse_role(role_param))

        users = query.paginate(page=page, per_page=per_page, error_out=False)

        return (
            jsonify(
                {
                    "users": [u.to_dict() for u in users.items],
                    "total": users.total,
                    "pages": users.pages,
                    "current_page": page,
                    "per_page": per_page,
                }
            ),
            200,
        )
    except ValueError as ve:
        return _error(str(ve), 400)
    except Exception:
        return _error("Failed to fetch users", 500)


@user_bp.route("/users/<int:user_id>", methods=["GET"])
@token_required
def get_user(current_user: User, user_id: int):
    try:
        if current_user.role != UserRole.ADMIN and current_user.id != user_id:
            return _error("Access denied", 403)
        user = db.session.get(User, user_id) or User.query.get_or_404(user_id)
        return jsonify({"user": user.to_dict()}), 200
    except Exception:
        return _error("Failed to fetch user", 500)


@user_bp.route("/users/<int:user_id>", methods=["PUT"])
@token_required
def update_user(current_user: User, user_id: int):
    if (err := _require_json()) is not None:
        return err
    try:
        if current_user.role != UserRole.ADMIN and current_user.id != user_id:
            return _error("Access denied", 403)

        user = db.session.get(User, user_id) or User.query.get_or_404(user_id)
        data = request.get_json(silent=True) or {}

        allowed_fields = [
            "first_name",
            "last_name",
            "phone",
            "address_line1",
            "address_line2",
            "city",
            "postcode",
            "country",
        ]
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])

        if current_user.role == UserRole.ADMIN:
            if "role" in data:
                user.role = _parse_role(data["role"])  # validate enum
            if "is_active" in data:
                user.is_active = bool(data["is_active"])  # coerce

        if data.get("password"):
            user.set_password(data["password"])  # rotates hash/salt

        user.updated_at = datetime.now(timezone.utc)
        db.session.commit()

        return jsonify({"message": "User updated successfully", "user": user.to_dict()}), 200
    except ValueError as ve:
        db.session.rollback()
        return _error(str(ve), 400)
    except Exception:
        db.session.rollback()
        return _error("Failed to update user", 500)


@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
@token_required
@admin_required
def delete_user(current_user: User, user_id: int):
    try:
        if current_user.id == user_id:
            return _error("Cannot delete your own account", 400)
        user = db.session.get(User, user_id) or User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception:
        db.session.rollback()
        return _error("Failed to delete user", 500)
