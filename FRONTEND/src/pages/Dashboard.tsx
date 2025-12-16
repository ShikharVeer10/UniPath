import { Link } from 'react-router-dom'
import { Target, TrendingUp, Award } from 'lucide-react'

const Dashboard = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome back! Ready to predict your admission chances?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Predictions</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Average Chance</p>
                <p className="text-2xl font-bold">--%</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Universities</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-2xl font-bold mb-4">New Prediction</h3>
            <p className="text-gray-600 mb-6">
              Get AI-powered admission predictions for your target universities. 
              Our algorithm analyzes your academic profile to provide accurate results.
            </p>
            <Link to="/predictor" className="btn-primary">
              Start Prediction
            </Link>
          </div>

          <div className="card bg-gradient-to-br from-primary-50 to-blue-50">
            <h3 className="text-2xl font-bold mb-4">How to Get Accurate Results</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Provide your most recent CGPA/GPA</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Include standardized test scores if available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Add details about extracurricular activities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Specify your target college and major</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Recent Predictions - Empty State */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recent Predictions</h2>
          <div className="card text-center py-12">
            <div className="text-gray-400 mb-4">
              <Target className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <p className="text-gray-600 text-lg mb-6">No predictions yet</p>
            <Link to="/predictor" className="btn-primary">
              Create Your First Prediction
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
