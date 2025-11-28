import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import OpenAI from 'openai'

const GPT_MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-5-nano', 'gpt-5-mini'] as const
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'] as const
type GPT_MODEL = typeof GPT_MODELS[number]
type GEMINI_MODEL = typeof GEMINI_MODELS[number]
type MODEL = GPT_MODEL | GEMINI_MODEL

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY ?? '',
  dangerouslyAllowBrowser: true
})

export const chatGpt = <T>(prompt: Prompt | Prompt[], model: GPT_MODEL): Promise<T> => {
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

export const chatGemini = <T>(prompt: Prompt | Prompt[], model: GEMINI_MODEL): Promise<T> => {
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
