import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { interviews, founders, memos } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateMemoFromInterview } from '@/lib/openai'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ interviewId: string }> }
) {
  try {
    const body = await request.json()
    const { questionIndex, answer, isComplete } = body
    const { interviewId } = await params

    // Get interview
    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, interviewId))
      .limit(1)

    if (!interview) {
      return NextResponse.json({ 
        message: 'Interview not found' 
      }, { status: 404 })
    }

    // Update transcript with answer
    const transcript = interview.transcript as { questions: unknown[]; responses: unknown[] }
    if (!transcript.responses) {
      transcript.responses = []
    }
    
    transcript.responses[questionIndex] = {
      question: transcript.questions[questionIndex],
      answer,
      timestamp: new Date().toISOString()
    }

    // Update interview
    await db
      .update(interviews)
      .set({
        transcript,
        isCompleted: isComplete || false,
        completedAt: isComplete ? new Date() : null,
        updatedAt: new Date()
      })
      .where(eq(interviews.id, interviewId))

    // If interview is complete, generate memo
    if (isComplete) {
      const [founder] = await db
        .select()
        .from(founders)
        .where(eq(founders.id, interview.founderId))
        .limit(1)

      if (founder) {
        const memoData = await generateMemoFromInterview({
          founderId: founder.id,
          transcript,
          founderInfo: {
            name: founder.name,
            company: founder.company || undefined,
            pitchText: founder.pitchText || undefined
          }
        })

        // Create memo record
        await db.insert(memos).values({
          interviewId: interviewId,
          content: JSON.stringify(memoData),
          summary: memoData.summary,
          strengths: memoData.strengths,
          weaknesses: memoData.weaknesses,
          recommendation: memoData.recommendation
        })

        // Update founder status and interview score
        await db
          .update(founders)
          .set({ 
            status: 'scored',
            updatedAt: new Date()
          })
          .where(eq(founders.id, founder.id))

        await db
          .update(interviews)
          .set({ 
            score: memoData.score,
            updatedAt: new Date()
          })
          .where(eq(interviews.id, interviewId))
      }
    }

    return NextResponse.json({ 
      message: 'Answer recorded successfully',
      isComplete
    })

  } catch (error) {
    console.error('Error recording answer:', error)
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}