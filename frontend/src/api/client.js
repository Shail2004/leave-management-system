import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
export const api = axios.create({ baseURL })

export function fmtDate(d) {
  if (!d) return ''
  const x = new Date(d)
  return x.toISOString().split('T')[0]
}
