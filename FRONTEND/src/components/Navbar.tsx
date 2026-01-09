import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, Menu, X, LogOut, LayoutDashboard, Target } from 'lucide-react'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-white shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-2xl font-bold hover:scale-105 transition-transform"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-gradient-blue-purple">UniPath</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg transition-all ${
                isActive('/') 
                  ? 'bg-primary-50 text-primary-600 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    isActive('/dashboard') 
                      ? 'bg-primary-50 text-primary-600 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  to="/predictor" 
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    isActive('/predictor') 
                      ? 'bg-primary-50 text-primary-600 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  Predictor
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-lg transition-all ${
                    isActive('/login') 
                      ? 'bg-primary-50 text-primary-600 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary ml-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200 animate-fade-in">
            <Link
              to="/"
              className={`block px-4 py-3 rounded-lg transition-all ${
                isActive('/') 
                  ? 'bg-primary-50 text-primary-600 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
                    isActive('/dashboard') 
                      ? 'bg-primary-50 text-primary-600 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/predictor"
                  className={`block px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
                    isActive('/predictor') 
                      ? 'bg-primary-50 text-primary-600 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Target className="w-4 h-4" />
                  Predictor
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block px-4 py-3 rounded-lg transition-all ${
                    isActive('/login') 
                      ? 'bg-primary-50 text-primary-600 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg text-center hover:shadow-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
