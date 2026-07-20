import { API_BASE_URL, API_TIMEOUT, AUTH_TOKEN_KEY } from './constants'
import type { ApiResponse, ApiError } from '@/types'

/**
 * Type-safe API client that wraps fetch with:
 * - Automatic auth header injection
 * - JSON request/response handling
 * - Timeout via AbortController
 * - Structured error mapping
 * - Request/response interceptors
 */

class ApiClient {
  private baseUrl: string
  private timeout: number

  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl
    this.timeout = timeout
  }

  /**
   * Get the stored auth token.
   */
  private getAuthToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  }

  /**
   * Build default headers for every request.
   */
  private getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders)
    headers.set('Content-Type', 'application/json')

    const token = this.getAuthToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  }

  /**
   * Core request method. All HTTP methods delegate here.
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(options.headers),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        const error: ApiError = {
          message: errorBody?.error?.message || response.statusText,
          code: errorBody?.error?.code || 'UNKNOWN_ERROR',
          status: response.status,
          details: errorBody?.error?.details,
        }
        throw error
      }

      return (await response.json()) as ApiResponse<T>
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw {
          message: 'Request timed out',
          code: 'TIMEOUT',
          status: 408,
        } as ApiError
      }

      // Re-throw ApiError as-is
      if (error && typeof error === 'object' && 'code' in error) {
        throw error
      }

      throw {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
        status: 0,
      } as ApiError
    }
  }

  /** HTTP GET */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  /** HTTP POST */
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /** HTTP PATCH */
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /** HTTP PUT */
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /** HTTP DELETE */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

/** Singleton API client instance used across the app. */
export const apiClient = new ApiClient()
