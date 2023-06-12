import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export const telegramApi = axios.create({
  baseURL: `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}`,
})
