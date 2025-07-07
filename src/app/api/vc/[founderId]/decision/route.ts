import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { founders } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ founderId: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { decision } = body
    const { founderId } = await params

    if (!['accepted', 'rejected'].includes(decision)) {
      return NextResponse.json({ 
        message: 'Invalid decision. Must be "accepted" or "rejected"' 
      }, { status: 400 })
    }

    // Update founder status
    const [updatedFounder] = await db
      .update(founders)
      .set({ 
        status: decision,
        updatedAt: new Date()
      })
      .where(eq(founders.id, founderId))
      .returning()

    if (!updatedFounder) {
      return NextResponse.json({ 
        message: 'Founder not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      message: `Founder ${decision} successfully`,
      founder: updatedFounder 
    })

  } catch (error) {
    console.error('Error updating founder decision:', error)
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}