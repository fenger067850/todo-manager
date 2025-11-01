import type { Todo, Category, CreateTodoInput, UpdateTodoInput, CreateCategoryInput } from '@/types'

class ApiClient {
  private baseURL = '' // 使用相对路径
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // 待办事项相关 API
  async getTodos(params?: {
    quadrant?: string
    priority?: string
    isCompleted?: boolean
    categoryId?: string
  }): Promise<{ todos: Todo[] }> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }

    const query = searchParams.toString()
    return this.request(`/todos${query ? `?${query}` : ''}`)
  }

  async createTodo(data: CreateTodoInput): Promise<{ message: string; todo: Todo }> {
    return this.request('/todos', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTodo(id: string, data: UpdateTodoInput): Promise<{ message: string; todo: Todo }> {
    return this.request(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTodo(id: string): Promise<{ message: string }> {
    return this.request(`/todos/${id}`, {
      method: 'DELETE',
    })
  }

  // 分类相关 API
  async getCategories(): Promise<{ categories: Category[] }> {
    return this.request('/categories')
  }

  async createCategory(data: CreateCategoryInput): Promise<{ message: string; category: Category }> {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 认证相关 API
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: {
    email: string
    username: string
    password: string
    name?: string
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }
}

export const apiClient = new ApiClient()