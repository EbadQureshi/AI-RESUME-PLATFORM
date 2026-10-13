const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
const API_URL_KEY = 'resumeai.apiUrl'
const TOKEN_KEY = 'resumeai.token'

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_API_URL
  return (localStorage.getItem(API_URL_KEY) || DEFAULT_API_URL).replace(/\/+$/, '')
}

export function setApiBaseUrl(url: string | null) {
  if (url && url.trim()) localStorage.setItem(API_URL_KEY, url.trim().replace(/\/+$/, ''))
  else localStorage.removeItem(API_URL_KEY)
}

export function getDefaultApiBaseUrl() {
  return DEFAULT_API_URL
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  detail: unknown

  constructor(status: number, message: string, detail?: unknown) {
    super(message)
    this.status = status
    this.detail = detail
  }
}

type ValidationItem = { loc?: (string | number)[]; msg?: string }

function formatDetail(detail: unknown, status: number): string {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return (detail as ValidationItem[])
      .map((d) => {
        const field = d.loc?.filter((p) => p !== 'body').join('.')
        return field ? `${field}: ${d.msg}` : d.msg
      })
      .filter(Boolean)
      .join(' • ')
  }
  return `Request failed (${status})`
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  auth?: boolean
  raw?: boolean
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, raw = false, headers, ...rest } = options
  const finalHeaders = new Headers(headers)
  const token = getToken()

  if (auth && token) finalHeaders.set('Authorization', `Bearer ${token}`)

  let finalBody: BodyInit | undefined
  if (body instanceof FormData) {
    finalBody = body
  } else if (body !== undefined) {
    finalHeaders.set('Content-Type', 'application/json')
    finalBody = JSON.stringify(body)
  }

  let response: Response
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: finalBody,
    })
  } catch {
    throw new ApiError(
      0,
      `Cannot reach the API at ${getApiBaseUrl()}. Check that the server is running and CORS is enabled.`,
    )
  }

  if (!response.ok) {
    let detail: unknown
    try {
      detail = (await response.json()).detail
    } catch {
      detail = undefined
    }
    if (response.status === 401 && auth && token) {
      setToken(null)
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('resumeai:unauthorized'))
    }
    throw new ApiError(response.status, formatDetail(detail, response.status), detail)
  }

  if (raw) return response as unknown as T
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}
