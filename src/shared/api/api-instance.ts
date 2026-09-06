import axios from 'axios'
import { sessionStorage } from './session-storage'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const apiInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

apiInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getToken()

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
