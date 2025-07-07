import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateInterviewQuestions(
  founderInfo: {
    name: string
    company?: string
    pitchText?: string
    deckUrl?: string
  }
) {
  const prompt = `
You are an experienced VC partner conducting a first-round screening interview. 
Generate 5-7 dynamic follow-up questions based on the founder's information below.

Founder Information:
- Name: ${founderInfo.name}
- Company: ${founderInfo.company || 'Not provided'}
- Pitch: ${founderInfo.pitchText || 'Not provided'}

Focus on these key areas:
1. Problem validation and market size
2. Solution differentiation and competitive advantage
3. Team background and expertise
4. Traction and metrics
5. Business model and unit economics
6. Funding ask and use of funds

Make questions specific to their business and avoid generic questions.
Format as JSON array of question objects with "question" and "category" fields.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('No content generated')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating interview questions:', error)
    throw new Error('Failed to generate interview questions')
  }
}

export async function generateMemoFromInterview(
  interview: {
    founderId: string
    transcript: unknown
    founderInfo: {
      name: string
      company?: string
      pitchText?: string
    }
  }
) {
  const prompt = `
Based on the interview transcript below, generate a comprehensive investment memo.

Founder: ${interview.founderInfo.name}
Company: ${interview.founderInfo.company || 'Not provided'}
Original Pitch: ${interview.founderInfo.pitchText || 'Not provided'}

Interview Transcript:
${JSON.stringify(interview.transcript, null, 2)}

Generate a structured memo with:
1. Executive Summary (2-3 sentences)
2. Problem & Solution
3. Market Opportunity
4. Team Assessment
5. Traction & Metrics
6. Business Model
7. Strengths (3-5 bullet points)
8. Weaknesses/Concerns (3-5 bullet points)
9. Recommendation (Pass/Consider/Strong Interest)
10. Investment Score (0-100)

Format as JSON with these fields: summary, problem, solution, market, team, traction, businessModel, strengths, weaknesses, recommendation, score
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('No content generated')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating memo:', error)
    throw new Error('Failed to generate investment memo')
  }
}

export async function scoreInterview(
  transcript: unknown,
  scoringWeights: { category: string; weight: number }[]
) {
  const prompt = `
Analyze this interview transcript and provide scores for each category (0-100):

Transcript:
${JSON.stringify(transcript, null, 2)}

Score these categories:
${scoringWeights.map(w => `- ${w.category}: ${w.weight}% weight`).join('\n')}

Provide detailed reasoning for each score and calculate a weighted total.
Format as JSON with "categoryScores" object and "totalScore" number.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.2,
      max_tokens: 1500,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('No content generated')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error scoring interview:', error)
    throw new Error('Failed to score interview')
  }
}

export default openai