import { useState } from 'react'
import { predictionAPI } from '../api/client'
import { TrendingUp, Info, Save, Sparkles, BookOpen, Award } from 'lucide-react'
import { Card, Input, Slider, Button, Alert, Spinner, Tooltip, Badge } from '../components/ui'

interface PredictionResult {
  id: number
  admission_chance: number
  reasoning: string
}

const Predictor = () => {
  const [formData, setFormData] = useState({
    name: '',
    cgpa: 7.5,
    testScore: 300,
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

  const handleSliderChange = (name: string, value: number) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const calculatePrediction = () => {
    // Simple heuristic calculation matching backend logic
    const cgpa = typeof formData.cgpa === 'string' ? parseFloat(formData.cgpa) : formData.cgpa
    const testScore = typeof formData.testScore === 'string' ? parseFloat(formData.testScore) : formData.testScore

    const cgpaScore = (cgpa / 10.0) * 0.5
    const testScoreWeight = testScore ? (testScore / 340.0) * 0.3 : 0.15
    const resumeWeight = formData.resumeText ? 0.2 : 0.05

    const admissionChance = Math.min(cgpaScore + testScoreWeight + resumeWeight, 1.0)

    const reasoningParts = [
      `CGPA of ${cgpa.toFixed(2)} contributes ${(cgpaScore * 100).toFixed(1)}% to admission probability.`,
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
      const cgpa = typeof formData.cgpa === 'string' ? parseFloat(formData.cgpa) : formData.cgpa
      const testScore = typeof formData.testScore === 'string' ? parseFloat(formData.testScore) : formData.testScore

      const response = await predictionAPI.predict({
        name: formData.name,
        cgpa: cgpa,
        test_score: testScore || undefined,
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

  const getChanceColor = (chance: number) => {
    if (chance >= 0.7) return 'success'
    if (chance >= 0.4) return 'warning'
    return 'error'
  }

  const getChanceLabel = (chance: number) => {
    if (chance >= 0.7) return 'High Chance'
    if (chance >= 0.4) return 'Moderate Chance'
    return 'Low Chance'
  }

  const getBgColor = (chance: number) => {
    if (chance >= 0.7) return 'from-success-50 to-success-100'
    if (chance >= 0.4) return 'from-warning-50 to-warning-100'
    return 'from-error-50 to-error-100'
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center animate-slideInDown">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-4">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Admission Predictor</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill in your details to get an AI-powered prediction of your admission chances
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="animate-slideInLeft">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary-600" />
                Your Information
              </h2>

              {error && (
                <div className="mb-6">
                  <Alert variant="error">{error}</Alert>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Full Name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  helperText="As per your official documents"
                />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      CGPA (0-10)
                    </label>
                    <Tooltip content="Your cumulative grade point average on a 10-point scale">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <Slider
                    min={0}
                    max={10}
                    step={0.1}
                    value={formData.cgpa}
                    onChange={(e) => handleSliderChange('cgpa', Number(e.target.value))}
                    valueFormatter={(val) => val.toFixed(1)}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Test Score (GRE/SAT)
                    </label>
                    <Tooltip content="Optional: Your standardized test score (GRE out of 340 or SAT out of 1600)">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <Slider
                    min={0}
                    max={340}
                    step={1}
                    value={formData.testScore}
                    onChange={(e) => handleSliderChange('testScore', Number(e.target.value))}
                  />
                </div>

                <Input
                  label="Target College/University"
                  name="targetCollege"
                  type="text"
                  value={formData.targetCollege}
                  onChange={handleChange}
                  placeholder="MIT, Stanford, Harvard, etc."
                  helperText="The university you're applying to"
                />

                <Input
                  label="Intended Major"
                  name="major"
                  type="text"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="Computer Science"
                  helperText="Your field of study"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume/Experience Summary
                  </label>
                  <textarea
                    name="resumeText"
                    rows={4}
                    value={formData.resumeText}
                    onChange={handleChange}
                    className="input-field resize-none"
                    placeholder="Brief summary of your achievements, projects, internships, research work, etc."
                  />
                  <p className="mt-1.5 text-sm text-gray-500">
                    Include notable achievements and experiences
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={loading}
                >
                  {loading ? 'Calculating Prediction...' : 'Predict Admission Chance'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Results */}
          <div className="animate-slideInRight">
            {result ? (
              <Card className="sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-success-100 rounded-lg">
                    <Award className="w-6 h-6 text-success-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Prediction Result</h2>
                </div>

                {/* Circular Progress */}
                <div className="mb-8">
                  <div className={`relative p-8 bg-gradient-to-br ${getBgColor(result.admission_chance)} rounded-2xl`}>
                    <div className="text-center">
                      <p className="text-gray-700 font-medium mb-3">Admission Probability</p>
                      
                      {/* Circular Progress Indicator */}
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - result.admission_chance)}`}
                            className={`text-${getChanceColor(result.admission_chance)}-600 transition-all duration-1000`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-4xl font-bold text-${getChanceColor(result.admission_chance)}-600`}>
                            {(result.admission_chance * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Badge variant={getChanceColor(result.admission_chance)} className="text-base px-4 py-1">
                          {getChanceLabel(result.admission_chance)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    Detailed Analysis
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {result.reasoning}
                  </p>
                </div>

                {/* Recommendations */}
                <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {result.admission_chance < 0.4 && (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-primary-600 mt-1">•</span>
                          <span>Consider improving your test scores for better chances</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary-600 mt-1">•</span>
                          <span>Look into building a stronger profile with projects and internships</span>
                        </li>
                      </>
                    )}
                    {result.admission_chance >= 0.4 && result.admission_chance < 0.7 && (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-primary-600 mt-1">•</span>
                          <span>You have a decent chance! Focus on strong essays and recommendations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary-600 mt-1">•</span>
                          <span>Consider applying to a mix of reach and safety schools</span>
                        </li>
                      </>
                    )}
                    {result.admission_chance >= 0.7 && (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-primary-600 mt-1">•</span>
                          <span>Excellent profile! Maintain your strong performance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary-600 mt-1">•</span>
                          <span>Focus on crafting a compelling personal statement</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Save Results Button */}
                <Button variant="outline" fullWidth className="mb-4">
                  <Save className="w-4 h-4 mr-2" />
                  Save Results
                </Button>

                {/* Disclaimer */}
                <Alert variant="info">
                  <div className="text-sm">
                    <strong>Note:</strong> This is a predictive analysis based on your provided information.
                    Actual admission decisions depend on many factors including essays, recommendations, and
                    institutional priorities.
                  </div>
                </Alert>
              </Card>
            ) : (
              <Card className="sticky top-24 text-center py-16">
                {loading ? (
                  <div className="space-y-4">
                    <Spinner size="lg" />
                    <div>
                      <p className="text-gray-700 font-medium mb-2">Analyzing your profile...</p>
                      <p className="text-sm text-gray-500">This may take a few seconds</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
                      <TrendingUp className="w-12 h-12 text-primary-600" />
                    </div>
                    <p className="text-gray-600 text-lg mb-4">
                      Fill in your details and submit to see your prediction results
                    </p>
                    <div className="text-sm text-gray-500 space-y-2">
                      <p>✓ Instant AI-powered analysis</p>
                      <p>✓ Detailed breakdown of factors</p>
                      <p>✓ Personalized recommendations</p>
                    </div>
                  </>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Predictor
