export interface VC {
  id: string
  orgName: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface Founder {
  id: string
  email: string
  name: string
  company?: string
  deckUrl?: string
  pitchText?: string
  status: 'new' | 'interviewed' | 'scored' | 'accepted' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export interface Interview {
  id: string
  founderId: string
  vcId: string
  scheduledAt?: Date
  completedAt?: Date
  transcript?: unknown
  score?: number
  isCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Memo {
  id: string
  interviewId: string
  content: string
  summary?: string
  strengths?: string[]
  weaknesses?: string[]
  recommendation?: string
  createdAt: Date
  updatedAt: Date
}

export interface Question {
  id: string
  vcId: string
  question: string
  category?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ScoringWeight {
  id: string
  vcId: string
  category: string
  weight: number
  createdAt: Date
  updatedAt: Date
}