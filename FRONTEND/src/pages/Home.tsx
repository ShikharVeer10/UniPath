import { Link } from 'react-router-dom'
import { GraduationCap, Target, TrendingUp, Award } from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Predict Your College
              <span className="text-primary-600"> Admission Chances</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Get AI-powered predictions for your dream university. Make informed decisions about your academic future with data-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose UniPath?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accurate Predictions</h3>
              <p className="text-gray-600">
                Our AI analyzes your profile and provides realistic admission probability based on multiple factors.
              </p>
            </div>

            <div className="card text-center">
              <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Data-Driven Insights</h3>
              <p className="text-gray-600">
                Get detailed reasoning behind predictions to understand your strengths and areas for improvement.
              </p>
            </div>

            <div className="card text-center">
              <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Top Universities</h3>
              <p className="text-gray-600">
                Predict chances for admissions to top colleges and universities worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
                <p className="text-gray-600">Sign up for free and access the prediction tool.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Enter Your Details</h3>
                <p className="text-gray-600">
                  Provide your academic information including CGPA, test scores, and target college.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get Predictions</h3>
                <p className="text-gray-600">
                  Receive instant predictions with detailed insights and recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto text-center text-white">
          <GraduationCap className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Path?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students making informed decisions about their future.
          </p>
          <Link to="/register" className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all">
            Start Predicting Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
