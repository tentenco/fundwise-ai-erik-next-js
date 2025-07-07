import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FundWise AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automate your first-round founder interviews with AI. 
            Save 30-40 hours per month and ensure every founder gets a response.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" variant="outline" className="px-8">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">🎯 Automated Screening</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                AI conducts dynamic interviews based on founder pitches, 
                asking relevant follow-up questions automatically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">📊 Smart Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get instant investment memos with structured analysis, 
                strengths/weaknesses, and 0-100 scoring.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">⚡ Pipeline Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Drag-and-drop kanban board to manage deals from 
                intake to decision in under 24 hours.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Deal Flow?</h2>
          <p className="text-gray-600 mb-8">
            Join forward-thinking VCs who are already using FundWise AI
          </p>
          <Link href="/sign-in">
            <Button size="lg" className="px-12">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
