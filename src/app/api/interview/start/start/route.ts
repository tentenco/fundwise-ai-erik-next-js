import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { founders, interviews, vcs } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateInterviewQuestions } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { founderId } = body

    if (!founderId) {
      return NextResponse.json({ 
        message: 'founderId is required' 
      }, { status: 400 })
    }

    // Get founder info
    const [founder] = await db
      .select()
      .from(founders)
      .where(eq(founders.id, founderId))
      .limit(1)

    if (!founder) {
      return NextResponse.json({ 
        message: 'Founder not found' 
      }, { status: 404 })
    }

    // Get VC info (assuming one VC for now)
    const [vc] = await db.select().from(vcs).limit(1)
    
    if (!vc) {
      return NextResponse.json({ 
        message: 'VC not found' 
      }, { status: 404 })
    }

    // Generate interview questions
    const questions = await generateInterviewQuestions({
      name: founder.name,
      company: founder.company || undefined,
      pitchText: founder.pitchText || undefined,
      deckUrl: founder.deckUrl || undefined
    })

    // Create interview record
    const [interview] = await db
      .insert(interviews)
      .values({
        founderId: founderId,
        vcId: vc.id,
        transcript: { questions, responses: [] },
        isCompleted: false
      })
      .returning()

    // Update founder status
    await db
      .update(founders)
      .set({ 
        status: 'interviewed',
        updatedAt: new Date()
      })
      .where(eq(founders.id, founderId))

    return NextResponse.json({ 
      message: 'Interview started successfully',
      interviewId: interview.id,
      questions
    })

  } catch (error) {
    console.error('Error starting interview:', error)
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}