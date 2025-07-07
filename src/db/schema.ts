import { pgTable, uuid, text, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core'

export const vcs = pgTable('vcs', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgName: text('org_name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const founders = pgTable('founders', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  company: text('company'),
  deckUrl: text('deck_url'),
  pitchText: text('pitch_text'),
  status: text('status').default('new'), // new, interviewed, scored, accepted, rejected
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const interviews = pgTable('interviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  founderId: uuid('founder_id').references(() => founders.id).notNull(),
  vcId: uuid('vc_id').references(() => vcs.id).notNull(),
  scheduledAt: timestamp('scheduled_at'),
  completedAt: timestamp('completed_at'),
  transcript: jsonb('transcript'),
  score: integer('score'),
  isCompleted: boolean('is_completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const memos = pgTable('memos', {
  id: uuid('id').primaryKey().defaultRandom(),
  interviewId: uuid('interview_id').references(() => interviews.id).notNull(),
  content: text('content').notNull(),
  summary: text('summary'),
  strengths: jsonb('strengths'),
  weaknesses: jsonb('weaknesses'),
  recommendation: text('recommendation'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  vcId: uuid('vc_id').references(() => vcs.id).notNull(),
  question: text('question').notNull(),
  category: text('category'), // problem, solution, market, team, traction, etc.
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const scoringWeights = pgTable('scoring_weights', {
  id: uuid('id').primaryKey().defaultRandom(),
  vcId: uuid('vc_id').references(() => vcs.id).notNull(),
  category: text('category').notNull(),
  weight: integer('weight').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})