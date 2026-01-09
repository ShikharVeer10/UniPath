import { useState } from 'react'
import { predictionAPI } from '../api/client'
import { TrendingUp, AlertCircle, CheckCircle, RotateCcw, Target, Award, Lightbulb } from 'lucide-react'
import Input from '../components/Input'
import Slider from '../components/Slider'
import Button from '../components/Button'
import Card from '../components/Card'
import ProgressBar from '../components/ProgressBar'

interface PredictionResult {
  id: number
  admission_chance: number
  reasoning: string
}

const Predictor = () => {
  const [formData, setFormData] = useState({
    name: '',
    cgpa: '7.0',
    testScore: '300',
    targetCollege: '',
    major: '',
    resumeText: '',
  })
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const calculatePrediction = () => {
    // Simple heuristic calculation matching backend logic
    const cgpa = parseFloat(formData.cgpa)
    const testScore = formData.testScore ? parseFloat(formData.testScore) : 0

    const cgpaScore = (cgpa / 10.0) * 0.5
    const testScoreWeight = testScore ? (testScore / 340.0) * 0.3 : 0.15
    const resumeWeight = formData.resumeText ? 0.2 : 0.05

    const admissionChance = Math.min(cgpaScore + testScoreWeight + resumeWeight, 1.0)

    const reasoningParts = [
      `CGPA of ${cgpa} contributes ${(cgpaScore * 100).toFixed(1)}% to admission probability.`,
    ]

    if (testScore) {
      reasoningParts.push(`Test score of ${testScore} adds ${(testScoreWeight * 100).toFixed(1)}%.`)
    } else {
      reasoningParts.push('No test score provided (default 15% added).')
    }

    if (formData.resumeText) {
      reasoningParts.push('Resume/experience provided adds 20% weight.')
    } else {
      reasoningParts.push('No resume details (minimal 5% weight).')
    }

    return {
      admission_chance: admissionChance,
      reasoning: reasoningParts.join(' '),
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const prediction = calculatePrediction()

      const response = await predictionAPI.predict({
        name: formData.name,
        cgpa: parseFloat(formData.cgpa),
        test_score: formData.testScore ? parseFloat(formData.testScore) : undefined,
        target_college: formData.targetCollege,
        major: formData.major,
        resume_text: formData.resumeText,
        admission_chance: prediction.admission_chance,
        reasoning: prediction.reasoning,
      })

      setResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate prediction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setFormData({
      name: '',
      cgpa: '7.0',
      testScore: '300',
      targetCollege: '',
      major: '',
      resumeText: '',
    })
    setError('')
  }

  const getChanceColor = (chance: number) => {
    if (chance >= 0.7) return 'text-green-600'
    if (chance >= 0.4) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getChanceBgColor = (chance: number) => {
    if (chance >= 0.7) return 'from-green-50 to-green-100'
    if (chance >= 0.4) return 'from-yellow-50 to-yellow-100'
    return 'from-red-50 to-red-100'
  }

  const getChanceLabel = (chance: number) => {
    if (chance >= 0.7) return 'High Chance'
    if (chance >= 0.4) return 'Moderate Chance'
    return 'Low Chance'
  }

  const getRecommendations = (chance: number, cgpa: number, testScore: number) => {
    const recommendations = []
    
    if (cgpa < 8.0) {
      recommendations.push('Focus on improving your CGPA through consistent academic performance')
    }
    
    if (testScore < 320) {
      recommendations.push('Consider retaking standardized tests to improve your score')
    }
    
    if (!formData.resumeText) {
      recommendations.push('Add details about your projects, internships, and achievements')
    }
    
    if (chance < 0.5) {
      recommendations.push('Consider applying to safety schools alongside reach schools')
    }
    
    return recommendations
  }

  const formProgress = () => {
    const fields = [
      formData.name,
      formData.cgpa,
      formData.targetCollege,
    ]
    const filled = fields.filter(f => f).length
    return (filled / fields.length) * 100
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gradient-blue-purple">
            Admission Predictor
          </h1>
          <p className="text-gray-600 text-lg">
            Fill in your details to get an AI-powered prediction of your admission chances
          </p>
          
          {!result && formProgress() > 0 && (
            <div className="mt-6">
              <ProgressBar
                value={formProgress()}
                label="Profile Completion"
                variant="primary"
                animated
              />
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="animate-fade-in-up animate-delay-100">
            <Card variant="elevated">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Target className="w-7 h-7 text-primary-600" />
                Your Information
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />

                <Slider
                  id="cgpa"
                  name="cgpa"
                  label="CGPA / GPA"
                  min={0}
                  max={10}
                  step={0.1}
                  value={formData.cgpa}
                  onChange={handleChange}
                  showValue
                  showMinMax
                />

                <Slider
                  id="testScore"
                  name="testScore"
                  label="Test Score (GRE/SAT)"
                  min={0}
                  max={340}
                  step={1}
                  value={formData.testScore}
                  onChange={handleChange}
                  showValue
                  showMinMax
                />

                <Input
                  id="targetCollege"
                  name="targetCollege"
                  type="text"
                  label="Target College/University"
                  value={formData.targetCollege}
                  onChange={handleChange}
                  placeholder="MIT, Stanford, etc."
                />

                <Input
                  id="major"
                  name="major"
                  type="text"
                  label="Intended Major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="Computer Science"
                />

                <div>
                  <label htmlFor="resumeText" className="block text-sm font-medium text-gray-700 mb-2">
                    Resume/Experience Summary
                  </label>
                  <textarea
                    id="resumeText"
                    name="resumeText"
                    rows={4}
                    value={formData.resumeText}
                    onChange={handleChange}
                    className="input-field resize-none"
                    placeholder="Brief summary of your achievements, projects, internships, etc."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  Predict Admission Chance
                </Button>
              </form>
            </Card>
          </div>

          {/* Results */}
          <div className="animate-fade-in-up animate-delay-200">
            {result ? (
              <div className="sticky top-24 space-y-6">
                <Card variant="elevated" className="animate-scale-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold">Prediction Result</h2>
                  </div>

                  <div className="mb-8">
                    <div className={`text-center p-8 bg-gradient-to-br ${getChanceBgColor(result.admission_chance)} rounded-2xl border-2 ${result.admission_chance >= 0.7 ? 'border-green-200' : result.admission_chance >= 0.4 ? 'border-yellow-200' : 'border-red-200'}`}>
                      <p className="text-gray-600 mb-2 font-medium">Admission Probability</p>
                      <p className={`text-7xl font-bold ${getChanceColor(result.admission_chance)} mb-2`}>
                        {(result.admission_chance * 100).toFixed(1)}%
                      </p>
                      <ProgressBar
                        value={result.admission_chance * 100}
                        variant={result.admission_chance >= 0.7 ? 'success' : result.admission_chance >= 0.4 ? 'warning' : 'danger'}
                        showPercentage={false}
                        size="lg"
                      />
                      <p className={`text-lg font-semibold mt-3 ${getChanceColor(result.admission_chance)}`}>
                        {getChanceLabel(result.admission_chance)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary-600" />
                      Detailed Analysis
                    </h3>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {result.reasoning}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="md"
                    icon={<RotateCcw className="w-5 h-5" />}
                    onClick={handleReset}
                    className="w-full"
                  >
                    Try Another Prediction
                  </Button>
                </Card>

                <Card variant="glass" className="bg-gradient-to-br from-blue-50 to-purple-50">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                    Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {getRecommendations(
                      result.admission_chance,
                      parseFloat(formData.cgpa),
                      parseFloat(formData.testScore)
                    ).map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Award className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="bg-blue-50 border-2 border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> This is a predictive analysis based on your provided information.
                    Actual admission decisions depend on many factors including essays, recommendations, and
                    institutional priorities.
                  </p>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-16 sticky top-24" variant="glass">
                <div className="max-w-sm mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-12 h-12 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Ready to Predict?</h3>
                  <p className="text-gray-600">
                    Fill in your details on the left and submit to see your personalized prediction results with detailed insights.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Predictor
