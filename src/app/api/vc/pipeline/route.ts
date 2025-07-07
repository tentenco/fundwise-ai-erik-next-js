import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { founders, interviews, memos } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get all founders with their interview status
    const foundersWithInterviews = await db
      .select({
        founder: founders,
        interview: interviews,
        memo: memos
      })
      .from(founders)
      .leftJoin(interviews, eq(founders.id, interviews.founderId))
      .leftJoin(memos, eq(interviews.id, memos.interviewId))
      .orderBy(desc(founders.createdAt))

    // Group by status for kanban board
    const pipeline: Record<string, unknown[]> = {
      new: [],
      interviewed: [],
      scored: [],
      accepted: [],
      rejected: []
    }

    foundersWithInterviews.forEach(row => {
      const status = row.founder.status || 'new'
      if (pipeline[status]) {
        pipeline[status].push({
          ...row.founder,
          interview: row.interview,
          memo: row.memo
        })
      }
    })

    return NextResponse.json(pipeline)

  } catch (error) {
    console.error('Error fetching pipeline:', error)
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}