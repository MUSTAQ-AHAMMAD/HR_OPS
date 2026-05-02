import { NextRequest } from 'next/server'
import { apiResponse, apiError, handleApiError, validateRequestBody } from '@/lib/api-utils'

/**
 * POST /api/ai/grammar
 * Check grammar and provide suggestions using AI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await validateRequestBody<{
      text: string
    }>(request)

    if (!body?.text) {
      return apiError('Text is required', 400)
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return apiError('AI service not configured', 503)
    }

    // Call OpenAI API for grammar checking
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional grammar checker. Analyze the text and provide corrections and suggestions. Return a JSON response with: correctedText, suggestions (array of {type, message, original, suggestion}), and score (0-100).',
          },
          {
            role: 'user',
            content: body.text,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content

    if (!aiResponse) {
      throw new Error('Invalid AI response')
    }

    // Parse AI response
    let result
    try {
      result = JSON.parse(aiResponse)
    } catch {
      // If AI doesn't return valid JSON, create a basic response
      result = {
        correctedText: body.text,
        suggestions: [],
        score: 90,
      }
    }

    return apiResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}
