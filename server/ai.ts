import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import { sendErrorNotification } from './lineNotify'

dotenv.config()

if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
  console.error('Error: GEMINI_API_KEY or OPENAI_API_KEY must be set in environment variables')
  process.exit(1)
}

const GPT_MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-5-nano', 'gpt-5-mini'] as const
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'] as const
type GPT_MODEL = typeof GPT_MODELS[number]
type GEMINI_MODEL = typeof GEMINI_MODELS[number]
type MODEL = GPT_MODEL | GEMINI_MODEL

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
  dangerouslyAllowBrowser: true
})

const chatGpt = <T>(prompt: Prompt | Prompt[], model: GPT_MODEL): Promise<T> => {
  const messages = (Array.isArray(prompt) ? prompt : [prompt]).map(v => {
    return typeof v === 'string'
      ? { role: 'user' as const, content: v }
      : { role: v.role, content: v.content }
  })
  return openai.chat.completions.create({
    messages,
    model,
    response_format: { type: 'json_object' }
  }).then(v => {
    return JSON.parse(v.choices[0].message.content as string) as T
  }).catch(e => {
    sendErrorNotification(`ネムルへの手紙: OpenAI API error: ${e.message || e}`)
    throw e
  })
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

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

const chatGemini = <T>(prompt: Prompt | Prompt[], model: GEMINI_MODEL): Promise<T> => {
  const getRole = (role: Role) => {
    if (role === 'user') return 'user'
    if (role === 'assistant') return 'model'
    throw new Error(`Unknown role: ${role}`)
  }
  const contents = (Array.isArray(prompt) ? prompt : [prompt]).map(v => {
      return typeof v === 'string'
        ? { role: 'user', parts: [{ text: v }] }
        : { role: getRole(v.role), parts: [{ text: v.content }] }
  })
  return genAI.getGenerativeModel({
    model,
    safetySettings,
    generationConfig: {
      responseMimeType: 'application/json'
    }
  }).generateContent({ contents }).then(result => {
    const text = result.response.text()
    return JSON.parse(text) as T
  }).catch(e => {
    sendErrorNotification(`ネムルへの手紙: Gemini API error: ${e.message || e}`)
    throw e
  })
}

type Role = 'user' | 'assistant'
type Prompt = string | { role: Role; content: string }

const isGPTModel = (model: MODEL): model is GPT_MODEL => GPT_MODELS.includes(model as GPT_MODEL)
const isGeminiModel = (model: MODEL): model is GEMINI_MODEL => GEMINI_MODELS.includes(model as GEMINI_MODEL)

export const chatAi = <T>(prompt: Prompt | Prompt[], model: MODEL): Promise<T> => {
  if (isGPTModel(model)) {
    return chatGpt<T>(prompt, model)
  } else if (isGeminiModel(model)) {
    return chatGemini<T>(prompt, model)
  }
  throw new Error(`Unknown model: ${model}`)
}
