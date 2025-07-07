'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Founder } from '@/types'

interface PipelineData {
  new: Founder[]
  interviewed: Founder[]
  scored: Founder[]
  accepted: Founder[]
  rejected: Founder[]
}

export default function PipelineBoard() {
  const [pipeline, setPipeline] = useState<PipelineData>({
    new: [],
    interviewed: [],
    scored: [],
    accepted: [],
    rejected: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPipeline()
  }, [])

  const fetchPipeline = async () => {
    try {
      const response = await fetch('/api/vc/pipeline')
      const data = await response.json()
      setPipeline(data)
    } catch (error) {
      console.error('Error fetching pipeline:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartInterview = async (founderId: string) => {
    try {
      const response = await fetch('/api/interview/start/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ founderId })
      })
      if (response.ok) {
        // Redirect to interview page or show success message
        window.open(`/founder/${founderId}/interview`, '_blank')
        await fetchPipeline() // Refresh pipeline
      }
    } catch (error) {
      console.error('Error starting interview:', error)
    }
  }

  const handleDecision = async (founderId: string, decision: 'accepted' | 'rejected') => {
    try {
      const response = await fetch(`/api/vc/${founderId}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ decision })
      })

      if (response.ok) {
        await fetchPipeline() // Refresh pipeline
      }
    } catch (error) {
      console.error('Error making decision:', error)
    }
  }

  const columns = [
    { key: 'new', title: 'New Submissions', color: 'bg-blue-50' },
    { key: 'interviewed', title: 'Interviewed', color: 'bg-yellow-50' },
    { key: 'scored', title: 'Scored', color: 'bg-purple-50' },
    { key: 'accepted', title: 'Accepted', color: 'bg-green-50' },
    { key: 'rejected', title: 'Rejected', color: 'bg-red-50' }
  ]

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading pipeline...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
      {columns.map((column) => (
        <div key={column.key} className={`${column.color} p-4 rounded-lg`}>
          <h3 className="font-semibold mb-4 text-center">
            {column.title}
            <Badge className="ml-2">{pipeline[column.key as keyof PipelineData].length}</Badge>
          </h3>
          
          <div className="space-y-3">
            {pipeline[column.key as keyof PipelineData].map((founder: Founder & { interview?: { score?: number }; memo?: { id: string } }) => (
              <Card key={founder.id} className="p-3">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-sm font-medium">{founder.name}</CardTitle>
                  {founder.company && (
                    <p className="text-xs text-gray-500">{founder.company}</p>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {founder.pitchText?.substring(0, 100)}...
                  </p>
                  
                  {founder.interview?.score && (
                    <div className="mb-2">
                      <Badge variant="outline">Score: {founder.interview.score}/100</Badge>
                    </div>
                  )}
                  
                  <div className="flex gap-1 flex-wrap">
                    {column.key === 'new' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStartInterview(founder.id)}
                        className="text-xs"
                      >
                        Start Interview
                      </Button>
                    )}
                    
                    {column.key === 'scored' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDecision(founder.id, 'accepted')}
                          className="text-xs"
                        >
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDecision(founder.id, 'rejected')}
                          className="text-xs"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {founder.memo && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`/memo/${founder.memo?.id}`, '_blank')}
                        className="text-xs"
                      >
                        View Memo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {pipeline[column.key as keyof PipelineData].length === 0 && (
            <div className="text-center text-gray-500 text-sm mt-8">
              No founders in this stage
            </div>
          )}
        </div>
      ))}
    </div>
  )
}