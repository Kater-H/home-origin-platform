// Analytics tracking utility for Modern Market Connect
class AnalyticsTracker {
    constructor(appType, apiUrl = 'https://y0h0i3cm3eom.manus.space/api/analytics') {
        this.appType = appType;
        this.apiUrl = apiUrl;
        this.sessionId = this.generateSessionId();
        this.userId = null;
        this.isInitialized = false;
        
        // Initialize tracking
        this.init();
    }
    
    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Get user ID from localStorage if available
        this.userId = localStorage.getItem('userId') || null;
        
        // Track page load
        this.trackPageView();
        
        // Track page unload
        window.addEventListener('beforeunload', () => {
            this.endSession();
        });
        
        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.endSession();
            }
        });
        
        this.isInitialized = true;
    }
    
    async sendEvent(eventData) {
        try {
            const payload = {
                session_id: this.sessionId,
                user_id: this.userId,
                app_type: this.appType,
                page_url: window.location.href,
                page_title: document.title,
                referrer: document.referrer,
                screen_resolution: `${screen.width}x${screen.height}`,
                timestamp: new Date().toISOString(),
                ...eventData
            };
            
            await fetch(`${this.apiUrl}/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.warn('Analytics tracking failed:', error);
        }
    }
    
    trackPageView() {
        this.sendEvent({
            event_type: 'page_view',
            event_name: 'Page View',
            event_data: {
                path: window.location.pathname,
                search: window.location.search,
                hash: window.location.hash
            }
        });
    }
    
    trackClick(elementName, elementType = 'button', additionalData = {}) {
        this.sendEvent({
            event_type: 'click',
            event_name: `Click: ${elementName}`,
            event_data: {
                element_name: elementName,
                element_type: elementType,
                ...additionalData
            }
        });
    }
    
    trackFormSubmit(formName, additionalData = {}) {
        this.sendEvent({
            event_type: 'form_submit',
            event_name: `Form Submit: ${formName}`,
            event_data: {
                form_name: formName,
                ...additionalData
            }
        });
    }
    
    trackSearch(query, resultsCount = null) {
        this.sendEvent({
            event_type: 'search',
            event_name: 'Search Query',
            event_data: {
                query: query,
                results_count: resultsCount
            }
        });
    }
    
    // Buyer-specific events
    trackProductView(productId, productName, category = null) {
        this.sendEvent({
            event_type: 'product_view',
            event_name: 'Product View',
            event_data: {
                product_id: productId,
                product_name: productName,
                category: category
            }
        });
    }
    
    trackAddToCart(productId, productName, quantity = 1, price = null) {
        this.sendEvent({
            event_type: 'add_to_cart',
            event_name: 'Add to Cart',
            event_data: {
                product_id: productId,
                product_name: productName,
                quantity: quantity,
                price: price
            }
        });
    }
    
    trackRemoveFromCart(productId, productName, quantity = 1) {
        this.sendEvent({
            event_type: 'remove_from_cart',
            event_name: 'Remove from Cart',
            event_data: {
                product_id: productId,
                product_name: productName,
                quantity: quantity
            }
        });
    }
    
    trackCheckoutStart(cartValue, itemCount) {
        this.sendEvent({
            event_type: 'checkout_start',
            event_name: 'Checkout Started',
            event_data: {
                cart_value: cartValue,
                item_count: itemCount
            }
        });
    }
    
    trackPurchase(orderId, orderValue, itemCount, paymentMethod = null) {
        this.sendEvent({
            event_type: 'purchase',
            event_name: 'Purchase Completed',
            event_data: {
                order_id: orderId,
                order_value: orderValue,
                item_count: itemCount,
                payment_method: paymentMethod
            }
        });
    }
    
    // Vendor-specific events
    trackProductAdd(productId, productName, category = null) {
        this.sendEvent({
            event_type: 'product_add',
            event_name: 'Product Added',
            event_data: {
                product_id: productId,
                product_name: productName,
                category: category
            }
        });
    }
    
    trackProductEdit(productId, productName, changes = {}) {
        this.sendEvent({
            event_type: 'product_edit',
            event_name: 'Product Edited',
            event_data: {
                product_id: productId,
                product_name: productName,
                changes: changes
            }
        });
    }
    
    trackOrderStatusUpdate(orderId, oldStatus, newStatus) {
        this.sendEvent({
            event_type: 'order_status_update',
            event_name: 'Order Status Updated',
            event_data: {
                order_id: orderId,
                old_status: oldStatus,
                new_status: newStatus
            }
        });
    }
    
    // Admin-specific events
    trackUserManagement(action, userId, userType = null) {
        this.sendEvent({
            event_type: 'user_management',
            event_name: `User ${action}`,
            event_data: {
                action: action,
                target_user_id: userId,
                user_type: userType
            }
        });
    }
    
    trackSystemConfig(configName, oldValue = null, newValue = null) {
        this.sendEvent({
            event_type: 'system_config',
            event_name: 'System Configuration Changed',
            event_data: {
                config_name: configName,
                old_value: oldValue,
                new_value: newValue
            }
        });
    }
    
    trackReportGeneration(reportType, filters = {}) {
        this.sendEvent({
            event_type: 'report_generation',
            event_name: 'Report Generated',
            event_data: {
                report_type: reportType,
                filters: filters
            }
        });
    }
    
    // Rider-specific events
    trackOrderAction(action, orderId, orderValue = null) {
        this.sendEvent({
            event_type: 'order_action',
            event_name: `Order ${action}`,
            event_data: {
                action: action,
                order_id: orderId,
                order_value: orderValue
            }
        });
    }
    
    trackDeliveryStatusUpdate(orderId, oldStatus, newStatus, location = null) {
        this.sendEvent({
            event_type: 'delivery_status_update',
            event_name: 'Delivery Status Updated',
            event_data: {
                order_id: orderId,
                old_status: oldStatus,
                new_status: newStatus,
                location: location
            }
        });
    }
    
    trackRouteView(orderId, routeType = 'delivery') {
        this.sendEvent({
            event_type: 'route_view',
            event_name: 'Route Viewed',
            event_data: {
                order_id: orderId,
                route_type: routeType
            }
        });
    }
    
    trackEarningsView(period = 'today') {
        this.sendEvent({
            event_type: 'earnings_view',
            event_name: 'Earnings Viewed',
            event_data: {
                period: period
            }
        });
    }
    
    // Custom event tracking
    trackCustomEvent(eventType, eventName, eventData = {}) {
        this.sendEvent({
            event_type: eventType,
            event_name: eventName,
            event_data: eventData
        });
    }
    
    // Set user ID (call this when user logs in)
    setUserId(userId) {
        this.userId = userId;
        localStorage.setItem('userId', userId);
    }
    
    // End session
    async endSession() {
        try {
            await fetch(`${this.apiUrl}/session/end`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: this.sessionId
                })
            });
        } catch (error) {
            console.warn('Failed to end analytics session:', error);
        }
    }
}

// Export for use in React components
export default AnalyticsTracker;

