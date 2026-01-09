import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export const sendErrorNotification = (message: string) => {
  if (!process.env.LINE_NOTIFY_TOKEN || !process.env.LINE_GROUP_ID) return
  // ref: https://qiita.com/MikH/items/d9876b6e50f7c8510d0b
  const API_URL = 'https://api.line.me/v2/bot/message/push'
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.LINE_NOTIFY_TOKEN}`
  }
  const body = {
    to: process.env.LINE_GROUP_ID,
    messages: [
      {
        type: 'text',
        text: message
      }
    ]
  }
  return axios({
    method: 'post',
    url: API_URL,
    headers,
    data: body
  })
}
