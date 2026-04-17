import axios from 'axios'

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'https://playground.crono-api.com'
const API_TIMEOUT: number = Number(import.meta.env.VITE_API_TIMEOUT) || 30000

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error:', error)
    }
    if (error.response?.status === 500) {
      console.error('Server error:', error)
    }
    return Promise.reject(error)
  }
)

export default httpClient
