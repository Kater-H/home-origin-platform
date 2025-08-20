import { ShoppingCart, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[var(--market-green)] rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--market-green)]">Modern Market</h3>
                <p className="text-sm text-gray-400">Connect</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting BSU students and Makurdi residents to Modern Market vendors 
              through AI-powered shopping and fast okada delivery.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-[var(--market-green)] cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-[var(--market-green)] cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-[var(--market-green)] cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-[var(--market-green)]">Smart Shopper</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[var(--market-green)]">Categories</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[var(--market-green)]">Track Order</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[var(--market-green)]">My Account</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[var(--market-green)]">Help Center</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[var(--market-green)]" />
                <span className="text-gray-300 text-sm">Modern Market, Makurdi, Benue State</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[var(--market-green)]" />
                <span className="text-gray-300 text-sm">+234 (0) 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[var(--market-green)]" />
                <span className="text-gray-300 text-sm">support@modernmarketconnect.ng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Modern Market Connect. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-[var(--market-green)] text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-[var(--market-green)] text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-[var(--market-green)] text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

