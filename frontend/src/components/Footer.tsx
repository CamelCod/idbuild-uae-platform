export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 bg-primary-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">B</span>
              </div>
              <span className="font-bold text-gray-900">BidBuild UAE</span>
            </div>
            <p className="text-sm text-gray-500">
              The leading reverse auction platform for UAE construction projects.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="/projects" className="hover:text-gray-900">Projects</a></li>
              <li><a href="/auctions" className="hover:text-gray-900">Live Auctions</a></li>
              <li><a href="/dashboard" className="hover:text-gray-900">Dashboard</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Dubai, UAE</li>
              <li>info@bidbuild.ae</li>
              <li>+971 4 000 0000</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {year} BidBuild UAE. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
