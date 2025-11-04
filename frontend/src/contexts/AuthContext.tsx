import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { storageService } from '../services/storage'
import { apiService } from '../services/apiService'

interface User {
id: string
firstName: string
lastName: string
email: string
phone: string
role: 'homeowner' | 'contractor' | 'admin'
avatar?: string
isVerified: boolean
createdAt: string
lastLogin: string
}

interface AuthContextType {
user: User | null
isAuthenticated: boolean
isLoading: boolean
isInitialized: boolean
initialize: () => Promise<void>
login: (email: string, password: string) => Promise<{ user: User; token: string; refreshToken: string }>
logout: () => Promise<void>
register: (data: any) => Promise<{ user: User; token: string; refreshToken: string }>
refreshToken: () => Promise<string>
updateProfile: (data: Partial<User>) => Promise<User>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
const context = useContext(AuthContext)
if (context === undefined) {
throw new Error('useAuth must be used within an AuthProvider')
}
return context
}

interface AuthProviderProps {
children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
const [user, setUser] = useState<User | null>(null)
const [isLoading, setIsLoading] = useState(true)
const [isInitialized, setIsInitialized] = useState(false)

const initialize = async (): Promise<void> => {
try {
setIsLoading(true)

const token = storageService.getItem('auth_token')
const refreshToken = storageService.getItem('refresh_token')

if (token) {
try {
// Set token in API service
apiService.setToken(token)

// Verify token and get user data
const response = await apiService.get('/auth/me')

if (response?.data) {
setUser(response.data)
}
} catch (error) {
// Token is invalid, try to refresh
if (refreshToken) {
try {
const newToken = await refreshToken()
apiService.setToken(newToken)

const response = await apiService.get('/auth/me')
if (response?.data) {
setUser(response.data)
}
} catch (refreshError) {
// Refresh failed, clear tokens
await logout()
}
} else {
// No refresh token, clear auth data
await logout()
}
}
}
} catch (error) {
console.error('Auth initialization failed:', error)
} finally {
setIsLoading(false)
setIsInitialized(true)
}
}

const login = async (email: string, password: string): Promise<{ user: User; token: string; refreshToken: string }> => {
try {
const response = await apiService.post('/auth/login', {
email,
password
})

if (response?.data) {
const { user: userData, accessToken, refreshToken: refreshTokenValue } = response.data

setUser(userData)

// Store tokens
storageService.setItem('auth_token', accessToken)
storageService.setItem('refresh_token', refreshTokenValue)

// Set token in API service
apiService.setToken(accessToken)

return { user: userData, token: accessToken, refreshToken: refreshTokenValue }
}

throw new Error('Login failed: Invalid response')
} catch (error: any) {
console.error('Login failed:', error)
throw new Error(error.message || 'Login failed')
}
}

const logout = async (): Promise<void> => {
try {
const refreshToken = storageService.getItem('refresh_token')

if (refreshToken) {
await apiService.post('/auth/logout', { refreshToken })
}
} catch (error) {
console.error('Logout API call failed:', error)
} finally {
// Clear local state and storage regardless of API call success
setUser(null)

storageService.removeItem('auth_token')
storageService.removeItem('refresh_token')

apiService.clearToken()
}
}

const register = async (data: any): Promise<{ user: User; token: string; refreshToken: string }> => {
try {
const response = await apiService.post('/auth/register', data)

if (response?.data) {
const { user: userData, accessToken, refreshToken: refreshTokenValue } = response.data

setUser(userData)

// Store tokens
storageService.setItem('auth_token', accessToken)
storageService.setItem('refresh_token', refreshTokenValue)

// Set token in API service
apiService.setToken(accessToken)

return { user: userData, token: accessToken, refreshToken: refreshTokenValue }
}

throw new Error('Registration failed: Invalid response')
} catch (error: any) {
console.error('Registration failed:', error)
throw new Error(error.message || 'Registration failed')
}
}

const refreshToken = async (): Promise<string> => {
try {
const refreshToken = storageService.getItem('refresh_token')

if (!refreshToken) {
throw new Error('No refresh token available')
}

const response = await apiService.post('/auth/refresh', {
refreshToken
})

if (response?.data?.accessToken) {
const newToken = response.data.accessToken

// Update stored token
storageService.setItem('auth_token', newToken)

// Update API service token
apiService.setToken(newToken)

return newToken
}

throw new Error('Token refresh failed: Invalid response')
} catch (error: any) {
console.error('Token refresh failed:', error)
// Clear auth data if refresh fails
await logout()
throw error
}
}

const updateProfile = async (data: Partial<User>): Promise<User> => {
try {
const response = await apiService.put('/auth/profile', data)

if (response?.data) {
const updatedUser = response.data
setUser(updatedUser)
return updatedUser
}

throw new Error('Profile update failed: Invalid response')
} catch (error: any) {
console.error('Profile update failed:', error)
throw new Error(error.message || 'Profile update failed')
}
}

// Initialize auth on mount
useEffect(() => {
initialize()
}, [])

const value: AuthContextType = {
user,
isAuthenticated: !!user,
isLoading,
isInitialized,
initialize,
login,
logout,
register,
refreshToken,
updateProfile
}

return (
<AuthContext.Provider value={value}>
{children}
</AuthContext.Provider>
)
}

export default AuthContext