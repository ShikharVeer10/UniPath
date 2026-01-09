import { Link } from 'react-router-dom'
import { GraduationCap, Target, TrendingUp, Award, Sparkles, Users, CheckCircle, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const Home = () => {
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!statsVisible) return

      let startTime: number
      let animationFrame: number

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = (currentTime - startTime) / duration

        if (progress < 1) {
          setCount(Math.floor(end * progress))
          animationFrame = requestAnimationFrame(animate)
        } else {
          setCount(end)
        }
      }

      animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }, [statsVisible, end, duration])

    return (
      <span>
        {count}
        {suffix}
      </span>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-6 animate-slideInDown">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Predictions</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-slideInUp">
              Predict Your College
              <span className="block gradient-text">Admission Chances</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 animate-slideInUp max-w-3xl mx-auto" style={{ animationDelay: '0.1s' }}>
              Get AI-powered predictions for your dream university. Make informed decisions about your academic future with data-driven insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideInUp" style={{ animationDelay: '0.2s' }}>
              <Link to="/register" className="btn-primary text-lg px-8 py-3 group">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn-outline text-lg px-8 py-3">
                Sign In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-gray-600 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-600" />
                <span className="text-sm">Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-600" />
                <span className="text-sm">Instant results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-600" />
                <span className="text-sm">Data-driven insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 px-4 bg-white border-y border-gray-100">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-slideInUp">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                <AnimatedCounter end={10000} suffix="+" />
              </div>
              <p className="text-gray-600 font-medium">Predictions Made</p>
            </div>
            <div className="text-center animate-slideInUp" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                <AnimatedCounter end={95} suffix="%" />
              </div>
              <p className="text-gray-600 font-medium">Accuracy Rate</p>
            </div>
            <div className="text-center animate-slideInUp" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <p className="text-gray-600 font-medium">Universities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose UniPath?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Leverage cutting-edge AI technology to understand your admission chances better
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card card-hover text-center animate-slideInUp group">
              <div className="inline-block p-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Predictions</h3>
              <p className="text-gray-600 leading-relaxed">
                Our advanced AI analyzes your academic profile and provides realistic admission probability based on multiple factors and historical data.
              </p>
            </div>

            <div className="card card-hover text-center animate-slideInUp group" style={{ animationDelay: '0.1s' }}>
              <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Detailed Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Get comprehensive reasoning behind predictions to understand your strengths and identify areas for improvement in your application.
              </p>
            </div>

            <div className="card card-hover text-center animate-slideInUp group" style={{ animationDelay: '0.2s' }}>
              <div className="inline-block p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Recommendations</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive personalized recommendations and actionable insights to improve your chances at top colleges and universities worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to discover your admission chances
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-6 animate-slideInLeft">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-3">Create Your Account</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Sign up for free in seconds and get instant access to our powerful prediction tool. No credit card required.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-3">Enter Your Details</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Provide your academic information including CGPA, standardized test scores, extracurriculars, and target colleges.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6 animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-3">Get Instant Predictions</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Receive detailed predictions with comprehensive insights, personalized recommendations, and success strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
            <Users className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-800">Trusted by Students Worldwide</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-8 max-w-3xl mx-auto">
            Join thousands of students making informed decisions about their future
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
            <div className="card-glass p-6">
              <div className="flex gap-1 mb-4 justify-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-warning-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">
                "UniPath helped me understand my chances realistically. The insights were invaluable for my application strategy!"
              </p>
              <p className="font-semibold text-gray-900">- Sarah M.</p>
              <p className="text-sm text-gray-500">Admitted to MIT</p>
            </div>

            <div className="card-glass p-6">
              <div className="flex gap-1 mb-4 justify-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-warning-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">
                "The AI predictions were spot on! It gave me confidence in my college choices and helped me focus on the right schools."
              </p>
              <p className="font-semibold text-gray-900">- James R.</p>
              <p className="text-sm text-gray-500">Admitted to Stanford</p>
            </div>

            <div className="card-glass p-6">
              <div className="flex gap-1 mb-4 justify-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-warning-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">
                "Best tool for college planning! The detailed analysis helped me improve my profile and get into my dream university."
              </p>
              <p className="font-semibold text-gray-900">- Priya K.</p>
              <p className="text-sm text-gray-500">Admitted to Harvard</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <GraduationCap className="w-20 h-20 mx-auto mb-6 text-white animate-float" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Find Your Path?</h2>
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
            Join thousands of students making informed decisions about their future with AI-powered insights.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            Start Predicting Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
