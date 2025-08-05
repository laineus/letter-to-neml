import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export const generateImage = (prompt: string) => {
  return openai.images.generate({
    size: '1024x1024',
    model: 'dall-e-3',
    n: 1,
    response_format: 'b64_json',
    quality: 'hd',
    style: 'vivid',
    prompt
  }).then(v => {
    return `data:image/webp;base64,${v.data?.[0].b64_json}`
    // const img = document.createElement('img')
    // img.src = `data:image/webp;base64,${v.data[0].b64_json}`
    // img.width = 400
    // document.body.appendChild(img)
  })
}

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

export const chatGemini = <T>(prompt: string): Promise<T> => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    // model: 'gemini-2.5-flash-lite',
    generationConfig: {
      responseMimeType: 'application/json'
    }
  })
  return model.generateContent(prompt).then(result => {
    const text = result.response.text()
    return JSON.parse(text) as T
  })
}

export const chatAi = <T>(prompt: string): Promise<T> => {
  return chatGemini<T>(prompt)
  // return chatGpt<T>(prompt)
}
