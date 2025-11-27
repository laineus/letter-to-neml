import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY ?? '',
  dangerouslyAllowBrowser: true
})

export const chatGpt = <T>(prompt: string): Promise<T> => {
  return openai.chat.completions.create({
    messages: [
      { role: 'user', content: prompt }
    ],
    model: 'gpt-4o-mini',
    // model: 'gpt-4o',
    response_format: { type: 'json_object' }
  }).then(v => {
    return JSON.parse(v.choices[0].message.content as string) as T
  })
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  }
]
export const chatGemini = <T>(prompt: string, systemInstruction?: string): Promise<T> => {
  const model = genAI.getGenerativeModel({
    // model: 'gemini-2.5-flash',
    model: 'gemini-2.5-flash-lite',
    systemInstruction,
    safetySettings,
    generationConfig: {
      responseMimeType: 'application/json'
    }
  })
  return model.generateContent(prompt).then(result => {
    const text = result.response.text()
    return JSON.parse(text) as T
  })
}

export const chatAi = <T>(prompt: string, systemInstruction?: string): Promise<T> => {
  return chatGemini<T>(prompt, systemInstruction)
  // return chatGpt<T>(prompt)
}
