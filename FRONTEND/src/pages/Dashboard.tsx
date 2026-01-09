import { Link } from 'react-router-dom'
import { Target, TrendingUp, Award, ArrowRight, Clock, BookOpen } from 'lucide-react'
import Stats from '../components/Stats'
import Card from '../components/Card'
import Button from '../components/Button'

const Dashboard = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gradient-blue-purple">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome back! Ready to predict your admission chances?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up animate-delay-100">
          <Stats
            icon={<Target className="w-full h-full" />}
            value={0}
            label="Total Predictions"
            iconBgColor="bg-primary-100"
            iconColor="text-primary-600"
            animate
          />
          
          <Stats
            icon={<TrendingUp className="w-full h-full" />}
            value="--"
            label="Average Chance"
            suffix="%"
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            animate={false}
          />
          
          <Stats
            icon={<Award className="w-full h-full" />}
            value={0}
            label="Universities"
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
            animate
          />
        </div>

        {/* Main Actions */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card variant="elevated" className="animate-fade-in-up animate-delay-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">New Prediction</h3>
                <p className="text-gray-600">
                  Get AI-powered admission predictions for your target universities
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our advanced algorithm analyzes your academic profile to provide accurate results with detailed insights and personalized recommendations.
            </p>
            
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              <Link to="/predictor" className="flex items-center gap-2">
                Start Prediction
              </Link>
            </Button>
          </Card>

          <Card variant="glass" className="bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 animate-fade-in-up animate-delay-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-white rounded-xl shadow-soft">
                <BookOpen className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">How to Get Accurate Results</h3>
              </div>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-gray-700 pt-0.5">Provide your most recent CGPA/GPA (0-10 scale)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-gray-700 pt-0.5">Include standardized test scores if available (GRE/SAT)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-gray-700 pt-0.5">Add details about extracurricular activities and projects</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <span className="text-gray-700 pt-0.5">Specify your target college and intended major</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-fade-in-up animate-delay-400">
          <Card hoverable className="text-center group">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7 text-blue-600" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Recent Activity</h4>
            <p className="text-sm text-gray-600">View your prediction history</p>
          </Card>
          
          <Card hoverable className="text-center group">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-green-600" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Track Progress</h4>
            <p className="text-sm text-gray-600">Monitor your improvements</p>
          </Card>
          
          <Card hoverable className="text-center group">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7 text-purple-600" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Compare Schools</h4>
            <p className="text-sm text-gray-600">Analyze multiple options</p>
          </Card>
        </div>

        {/* Recent Predictions - Empty State */}
        <div className="animate-fade-in-up animate-delay-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Predictions</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          
          <Card className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-primary-600" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">No Predictions Yet</h3>
              <p className="text-gray-600 mb-8">
                Start your journey by creating your first admission prediction. It only takes a few minutes!
              </p>
              
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                <Link to="/predictor">
                  Create Your First Prediction
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
