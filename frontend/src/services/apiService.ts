import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ApiResponse, ApiError } from '../types'
import { storageService } from './storageService'
import toast from 'react-hot-toast'

// Create axios instance
const api: AxiosInstance = axios.create({
baseURL: process.env.NODE_ENV === 'production'
? 'https://api.bidbuild.ae/api'
: 'http://localhost:5000/api',
timeout: 30000,
headers: {
'Content-Type': 'application/json',
},
withCredentials: true,
})

// Request interceptor to add auth token
api.interceptors.request.use(
(config: AxiosRequestConfig) => {
const token = storageService.getToken()
if (token && config.headers) {
config.headers.Authorization = `Bearer ${token}`
}
return config
},
(error: AxiosError) => {
return Promise.reject(error)
}
)

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
(response: AxiosResponse) => {
return response
},
async (error: AxiosError) => {
const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

if (error.response?.status === 401 && !originalRequest._retry) {
originalRequest._retry = true

try {
const refreshToken = storageService.getRefreshToken()
if (refreshToken) {
const response = await axios.post('/api/auth/refresh', { refreshToken })

if (response.data.success) {
const { token, refreshToken: newRefreshToken } = response.data.data
storageService.setToken(token)
storageService.setRefreshToken(newRefreshToken)

// Retry original request
if (originalRequest.headers) {
originalRequest.headers.Authorization = `Bearer ${token}`
}
return api(originalRequest)
}
}
} catch (refreshError) {
// Refresh failed, redirect to login
storageService.clearTokens()
window.location.href = '/login'
return Promise.reject(refreshError)
}
}

// Handle specific error cases
if (error.response?.status === 403) {
toast.error('You do not have permission to perform this action')
} else if (error.response?.status === 404) {
toast.error('The requested resource was not found')
} else if (error.response?.status >= 500) {
toast.error('Server error. Please try again later')
}

return Promise.reject(error)
}
)

// Generic API methods
export class ApiService {
private static instance: ApiService
private api: AxiosInstance

private constructor() {
this.api = api
}

public static getInstance(): ApiService {
if (!ApiService.instance) {
ApiService.instance = new ApiService()
}
return ApiService.instance
}

// Generic request method
private async request<T>(
method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
url: string,
data?: any,
config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
try {
const response = await this.api.request<ApiResponse<T>>({
method,
url,
data,
...config,
})
return response.data
} catch (error: any) {
const apiError: ApiError = {
message: error.response?.data?.message || error.message || 'An error occurred',
code: error.response?.data?.code || 'API_ERROR',
details: error.response?.data?.details || error.response?.data,
status: error.response?.status || 500,
}

return {
success: false,
message: apiError.message,
errors: error.response?.data?.errors || [apiError.message],
}
}
}

// GET request
async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
return this.request<T>('GET', url, undefined, config)
}

// POST request
async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
return this.request<T>('POST', url, data, config)
}

// PUT request
async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
return this.request<T>('PUT', url, data, config)
}

// PATCH request
async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
return this.request<T>('PATCH', url, data, config)
}

// DELETE request
async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
return this.request<T>('DELETE', url, undefined, config)
}

// File upload
async uploadFile<T>(
url: string,
file: File,
onProgress?: (progress: number) => void
): Promise<ApiResponse<T>> {
const formData = new FormData()
formData.append('file', file)

return this.request<T>('POST', url, formData, {
headers: {
'Content-Type': 'multipart/form-data',
},
onUploadProgress: (progressEvent) => {
if (onProgress && progressEvent.total) {
const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
onProgress(progress)
}
},
})
}

// Multiple file upload
async uploadFiles<T>(
url: string,
files: File[],
onProgress?: (progress: number) => void
): Promise<ApiResponse<T>> {
const formData = new FormData()
files.forEach((file, index) => {
formData.append(`files[${index}]`, file)
})

return this.request<T>('POST', url, formData, {
headers: {
'Content-Type': 'multipart/form-data',
},
onUploadProgress: (progressEvent) => {
if (onProgress && progressEvent.total) {
const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
onProgress(progress)
}
},
})
}

// Download file
async downloadFile(url: string, filename?: string): Promise<void> {
try {
const response = await this.api.get(url, {
responseType: 'blob',
})

const blob = new Blob([response.data])
const downloadUrl = window.URL.createObjectURL(blob)
const link = document.createElement('a')
link.href = downloadUrl
link.download = filename || 'download'
document.body.appendChild(link)
link.click()
document.body.removeChild(link)
window.URL.revokeObjectURL(downloadUrl)
} catch (error) {
console.error('Download failed:', error)
throw error
}
}

// Get request URL (for constructing URLs)
getRequestUrl(endpoint: string): string {
return `${this.api.defaults.baseURL}${endpoint}`
}

// Set authentication token
setAuthToken(token: string): void {
this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Remove authentication token
removeAuthToken(): void {
delete this.api.defaults.headers.common['Authorization']
}

// Set custom headers
setHeaders(headers: Record<string, string>): void {
Object.assign(this.api.defaults.headers, headers)
}

// Get current configuration
getConfig(): AxiosRequestConfig {
return this.api.defaults
}
}

// Export default instance
export const apiService = ApiService.getInstance()
export default apiService