'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface Question {
  question: string
  category: string
}

export default function InterviewPage({ params }: { params: Promise<{ founderId: string }> }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState('')
  const [interviewId, setInterviewId] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    startInterview()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const startInterview = async () => {
    try {
      const { founderId } = await params
      const response = await fetch('/api/interview/start/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ founderId })
      })
      const data = await response.json()
      
      if (response.ok) {
        setQuestions(data.questions)
        setInterviewId(data.interviewId)
      }
    } catch (error) {
      console.error('Error starting interview:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!interviewId || !answer.trim()) return

    try {
      const isLastQuestion = currentQuestion === questions.length - 1
      
      const response = await fetch(`/api/interview/${interviewId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionIndex: currentQuestion,
          answer: answer.trim(),
          isComplete: isLastQuestion
        })
      })

      if (response.ok) {
        if (isLastQuestion) {
          setIsComplete(true)
        } else {
          setCurrentQuestion(prev => prev + 1)
          setAnswer('')
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading interview...</div>
  }

  if (isComplete) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Interview Complete!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for completing the interview. Our team will review your responses and get back to you soon.
            </p>
            <p className="text-sm text-gray-500">
              You can close this window now.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return <div className="flex justify-center items-center h-64">No questions available</div>
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">FundWise AI Interview</h1>
          <Badge variant="outline">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {currentQ.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="answer">Your Answer</Label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Please provide a detailed answer..."
                className="w-full mt-2 p-3 border rounded-md min-h-[120px] resize-none"
              />
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={goBack}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              <Button 
                onClick={submitAnswer}
                disabled={!answer.trim()}
                className="min-w-[120px]"
              >
                {currentQuestion === questions.length - 1 ? 'Complete Interview' : 'Next Question'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}