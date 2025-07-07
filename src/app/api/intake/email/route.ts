import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { founders } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, company, subject, content, attachments } = body

    // Extract pitch deck URL from attachments if present
    const deckUrl = attachments?.find((att: { filename?: string; url?: string }) => 
      att.filename?.includes('.pdf') || att.filename?.includes('.ppt')
    )?.url

    // Check if founder already exists
    const existingFounder = await db.select().from(founders).where(eq(founders.email, email)).limit(1)

    if (existingFounder.length > 0) {
      return NextResponse.json({ 
        message: 'Founder already exists',
        founderId: existingFounder[0].id 
      }, { status: 200 })
    }

    // Create new founder record
    const [newFounder] = await db.insert(founders).values({
      email,
      name: name || email.split('@')[0],
      company,
      deckUrl,
      pitchText: `${subject}\n\n${content}`,
      status: 'new'
    }).returning()

    return NextResponse.json({ 
      message: 'Founder created successfully',
      founderId: newFounder.id 
    }, { status: 201 })

  } catch (error) {
    console.error('Error processing email intake:', error)
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}