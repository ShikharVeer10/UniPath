import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { GraduationCap, Github, Twitter, Linkedin, Mail } from 'lucide-react'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-8 h-8 text-primary-400" />
                <span className="text-2xl font-bold">UniPath</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                AI-powered college admission predictions to help students make informed decisions about their academic future.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:contact@unipath.com"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-gray-400 hover:text-white transition-colors">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/register" className="text-gray-400 hover:text-white transition-colors">
                    Sign Up
                  </a>
                </li>
                <li>
                  <a href="/predictor" className="text-gray-400 hover:text-white transition-colors">
                    Predictor
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} UniPath. All rights reserved. Made with ❤️ for students worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
