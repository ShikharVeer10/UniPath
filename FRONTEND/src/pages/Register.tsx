import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import ProgressBar from '../components/ProgressBar'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const calculatePasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0
    if (pwd.length >= 6) score += 20
    if (pwd.length >= 8) score += 10
    if (pwd.length >= 12) score += 10
    if (/[a-z]/.test(pwd)) score += 15
    if (/[A-Z]/.test(pwd)) score += 15
    if (/[0-9]/.test(pwd)) score += 15
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 15

    if (score >= 80) return { score, label: 'Strong', color: 'success' }
    if (score >= 50) return { score, label: 'Moderate', color: 'warning' }
    return { score, label: 'Weak', color: 'danger' }
  }

  const passwordStrength = password ? calculatePasswordStrength(password) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!acceptedTerms) {
      setError('Please accept the terms and conditions')
      return
    }

    try {
      await register(email, password, fullName)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full animate-fade-in-up">
        <Card variant="glass" className="backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-4 animate-bounce-in">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gradient-blue-purple mb-2">Create Account</h2>
            <p className="text-gray-600">Join UniPath today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="fullName"
              type="text"
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="w-5 h-5" />}
              placeholder="John Doe"
            />

            <Input
              id="email"
              type="email"
              label="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              placeholder="you@example.com"
            />

            <div>
              <Input
                id="password"
                type="password"
                label="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                placeholder="••••••••"
                showPasswordToggle
              />
              {password && passwordStrength && (
                <div className="mt-3">
                  <ProgressBar
                    value={passwordStrength.score}
                    variant={passwordStrength.color as any}
                    size="sm"
                    label={`Password Strength: ${passwordStrength.label}`}
                    showPercentage={false}
                  />
                </div>
              )}
            </div>

            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              placeholder="••••••••"
              showPasswordToggle
              error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
            />

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer select-none">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Register
