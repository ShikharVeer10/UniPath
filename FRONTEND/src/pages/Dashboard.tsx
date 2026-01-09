import { Link } from 'react-router-dom'
import { Target, TrendingUp, Award, Activity, Plus, Clock, CheckCircle2, Calendar } from 'lucide-react'
import { Card, Badge, Button } from '../components/ui'

const Dashboard = () => {
  const stats = [
    {
      icon: Target,
      label: 'Total Predictions',
      value: '0',
      change: '+0%',
      changeType: 'neutral' as 'positive' | 'negative' | 'neutral',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
    },
    {
      icon: TrendingUp,
      label: 'Average Chance',
      value: '--%',
      change: '--',
      changeType: 'neutral' as 'positive' | 'negative' | 'neutral',
      iconBg: 'bg-success-100',
      iconColor: 'text-success-600',
    },
    {
      icon: Clock,
      label: 'Pending Reviews',
      value: '0',
      change: '--',
      changeType: 'neutral' as 'positive' | 'negative' | 'neutral',
      iconBg: 'bg-warning-100',
      iconColor: 'text-warning-600',
    },
    {
      icon: Award,
      label: 'Universities',
      value: '0',
      change: '--',
      changeType: 'neutral' as 'positive' | 'negative' | 'neutral',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ]

  const recentPredictions: any[] = []

  const quickActions = [
    {
      icon: Plus,
      title: 'New Prediction',
      description: 'Get AI-powered admission predictions',
      link: '/predictor',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
    },
    {
      icon: Activity,
      title: 'View Analytics',
      description: 'Track your application progress',
      link: '#',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: Calendar,
      title: 'Application Timeline',
      description: 'Manage deadlines and schedules',
      link: '#',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ]

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 animate-slideInDown">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Ready to predict your admission chances and plan your academic future?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              variant="hover"
              className="animate-slideInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 ${stat.iconBg} rounded-xl`}>
                  <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    {stat.change !== '--' && (
                      <span
                        className={`text-xs font-semibold ${
                          stat.changeType === 'positive'
                            ? 'text-success-600'
                            : stat.changeType === 'negative'
                            ? 'text-error-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Content - Recent Predictions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="animate-slideInLeft">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="group p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-300"
                  >
                    <div className={`inline-flex p-3 ${action.iconBg} rounded-lg mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Recent Predictions */}
            <Card className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Predictions</h2>
                <Link
                  to="/predictor"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                >
                  View All
                  <span>→</span>
                </Link>
              </div>

              {recentPredictions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                    <Target className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg mb-6">No predictions yet</p>
                  <Link to="/predictor" className="btn-primary inline-block">
                    <Plus className="w-4 h-4 inline-block mr-2" />
                    Create Your First Prediction
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPredictions.map((prediction: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {prediction.targetCollege}
                        </h4>
                        <p className="text-sm text-gray-500">{prediction.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600 mb-1">
                          {prediction.chance}%
                        </div>
                        <Badge variant={prediction.status}>
                          {prediction.statusLabel}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <Card className="animate-slideInRight bg-gradient-to-br from-primary-50 to-blue-50 border-primary-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary-600" />
                Tips for Success
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span>Provide accurate and up-to-date academic information for best results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span>Include all standardized test scores (GRE, TOEFL, SAT, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span>Highlight your extracurricular activities and achievements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span>Research multiple universities to diversify your options</span>
                </li>
              </ul>
            </Card>

            {/* Progress Card */}
            <Card className="animate-slideInRight" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Profile Completion</span>
                    <span className="text-sm font-semibold text-gray-900">40%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Complete your profile to get more accurate predictions
                </div>
                <Button variant="outline" fullWidth size="sm">
                  Complete Profile
                </Button>
              </div>
            </Card>

            {/* Data Visualization Placeholder */}
            <Card className="animate-slideInRight" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Application Trends</h3>
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Chart coming soon</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
