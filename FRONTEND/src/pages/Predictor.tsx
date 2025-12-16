import { useState } from 'react'
import { predictionAPI } from '../api/client'
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

interface PredictionResult {
  id: number
  admission_chance: number
  reasoning: string
}

const Predictor = () => {
  const [formData, setFormData] = useState({
    name: '',
    cgpa: '',
    testScore: '',
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

  const getChanceColor = (chance: number) => {
    if (chance >= 0.7) return 'text-green-600'
    if (chance >= 0.4) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getChanceLabel = (chance: number) => {
    if (chance >= 0.7) return 'High Chance'
    if (chance >= 0.4) return 'Moderate Chance'
    return 'Low Chance'
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Admission Predictor</h1>
          <p className="text-gray-600 text-lg">
            Fill in your details to get an AI-powered prediction of your admission chances
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Your Information</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700 mb-2">
                  CGPA (0-10) *
                </label>
                <input
                  id="cgpa"
                  name="cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={formData.cgpa}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="8.5"
                />
              </div>

              <div>
                <label htmlFor="testScore" className="block text-sm font-medium text-gray-700 mb-2">
                  Test Score (GRE/SAT/etc.)
                </label>
                <input
                  id="testScore"
                  name="testScore"
                  type="number"
                  min="0"
                  max="340"
                  value={formData.testScore}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="320"
                />
              </div>

              <div>
                <label htmlFor="targetCollege" className="block text-sm font-medium text-gray-700 mb-2">
                  Target College/University
                </label>
                <input
                  id="targetCollege"
                  name="targetCollege"
                  type="text"
                  value={formData.targetCollege}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="MIT, Stanford, etc."
                />
              </div>

              <div>
                <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-2">
                  Intended Major
                </label>
                <input
                  id="major"
                  name="major"
                  type="text"
                  value={formData.major}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Computer Science"
                />
              </div>

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

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Calculating...' : 'Predict Admission Chance'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div>
            {result ? (
              <div className="card sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <h2 className="text-2xl font-bold">Prediction Result</h2>
                </div>

                <div className="mb-8">
                  <div className="text-center p-8 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl">
                    <p className="text-gray-600 mb-2">Admission Probability</p>
                    <p className={`text-6xl font-bold ${getChanceColor(result.admission_chance)}`}>
                      {(result.admission_chance * 100).toFixed(1)}%
                    </p>
                    <p className={`text-lg font-semibold mt-2 ${getChanceColor(result.admission_chance)}`}>
                      {getChanceLabel(result.admission_chance)}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    Detailed Analysis
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{result.reasoning}</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> This is a predictive analysis based on your provided information.
                    Actual admission decisions depend on many factors including essays, recommendations, and
                    institutional priorities.
                  </p>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12 sticky top-24">
                <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  Fill in your details and submit to see your prediction results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Predictor
