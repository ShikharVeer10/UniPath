import { Link } from 'react-router-dom'
import { GraduationCap, Target, TrendingUp, Award, CheckCircle, Users, Star, Sparkles } from 'lucide-react'
import Card from '../components/Card'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-purple-50 to-blue-50 -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow animate-delay-200" />
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft mb-8 animate-fade-in-down">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-600">AI-Powered Predictions</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Predict Your College
              <span className="block text-gradient-blue-purple mt-2">Admission Chances</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 animate-fade-in-up animate-delay-100 leading-relaxed">
              Get AI-powered predictions for your dream university. Make informed decisions about your academic future with data-driven insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-200">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-glow">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-outline text-lg px-8 py-4">
                Sign In
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto animate-fade-in-up animate-delay-300">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
                <div className="text-sm text-gray-600">Students Helped</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
                <div className="text-sm text-gray-600">Universities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose UniPath?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to make informed decisions about your college admissions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="elevated" hoverable className="text-center group">
              <div className="inline-block p-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Accurate Predictions</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes your profile and provides realistic admission probability based on multiple factors including GPA, test scores, and experience.
              </p>
            </Card>

            <Card variant="elevated" hoverable className="text-center group">
              <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Data-Driven Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed reasoning behind predictions to understand your strengths and areas for improvement with actionable recommendations.
              </p>
            </Card>

            <Card variant="elevated" hoverable className="text-center group">
              <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Top Universities</h3>
              <p className="text-gray-600 leading-relaxed">
                Predict chances for admissions to top colleges and universities worldwide including Ivy League and prestigious institutions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <Card variant="glass" className="hover-lift">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">Create Your Account</h3>
                  <p className="text-gray-600 text-lg">
                    Sign up for free in seconds and get instant access to our prediction tool. No credit card required.
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="hover-lift animate-delay-100">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">Enter Your Details</h3>
                  <p className="text-gray-600 text-lg">
                    Provide your academic information including CGPA, standardized test scores, and target college with optional resume details.
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="hover-lift animate-delay-200">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">Get Instant Predictions</h3>
                  <p className="text-gray-600 text-lg">
                    Receive instant predictions with detailed insights, probability scores, and personalized recommendations for improvement.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials/Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Students Love</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of students making data-driven college decisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Free to Use</h4>
              <p className="text-gray-600 text-sm">No hidden costs or subscriptions required</p>
            </Card>
            
            <Card className="text-center">
              <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Highly Accurate</h4>
              <p className="text-gray-600 text-sm">95% prediction accuracy based on historical data</p>
            </Card>
            
            <Card className="text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Trusted by Many</h4>
              <p className="text-gray-600 text-sm">Over 1000+ students have used our platform</p>
            </Card>
            
            <Card className="text-center">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Easy to Use</h4>
              <p className="text-gray-600 text-sm">Simple interface with instant results</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzNmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-20" />
        
        <div className="container mx-auto text-center text-white relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-bounce-in">
            <GraduationCap className="w-12 h-12" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Path?</h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-2xl mx-auto">
            Join thousands of students making informed decisions about their future. Start predicting your admission chances today!
          </p>
          
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-10 py-4 rounded-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
          >
            Start Predicting Now
            <TrendingUp className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
