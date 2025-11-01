'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@/types'
import { apiClient } from './api-client'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: {
    email: string
    username: string
    password: string
    name?: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 检查本地存储的认证信息
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setUser(user)
        setToken(storedToken)
        // 设置 API 客户端的 token
        apiClient.setToken(storedToken)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        // 设置 API 客户端的 token
        apiClient.setToken(data.token)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error: any) {
      console.error('登录失败:', error)
      return { success: false, error: '网络错误，请稍后再试' }
    }
  }

  const register = async (userData: {
    email: string
    username: string
    password: string
    name?: string
  }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        // 设置 API 客户端的 token
        apiClient.setToken(data.token)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error: any) {
      console.error('注册失败:', error)
      return { success: false, error: '网络错误，请稍后再试' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // 清除 API 客户端的 token
    apiClient.setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}