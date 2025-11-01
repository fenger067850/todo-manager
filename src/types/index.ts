export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type Quadrant = 'URGENT_IMPORTANT' | 'NOT_URGENT_IMPORTANT' | 'URGENT_NOT_IMPORTANT' | 'NOT_URGENT_NOT_IMPORTANT'

export interface User {
  id: string
  email: string
  username: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  color: string | null
  description: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
  _count?: {
    todos?: number
  }
}

export interface Attachment {
  id: string
  todoId: string
  filename: string
  originalName: string
  fileType: string
  fileSize: number
  filePath: string
  createdAt: Date
}

export interface Todo {
  id: string
  title: string
  description: string | null
  dueDate: Date | null
  isCompleted: boolean
  priority: Priority
  quadrant: Quadrant | null
  userId: string
  categoryId: string | null
  createdAt: Date
  updatedAt: Date
  attachments?: Attachment[]
  category?: Category
}

export interface Reminder {
  id: string
  todoId: string
  remindAt: Date
  message: string | null
  isActive: boolean
  createdAt: Date
}

export interface CreateTodoInput {
  title: string
  description?: string
  dueDate?: Date
  priority?: Priority
  quadrant?: Quadrant
  categoryId?: string
}

export interface UpdateTodoInput {
  title?: string
  description?: string
  dueDate?: Date
  isCompleted?: boolean
  priority?: Priority
  quadrant?: Quadrant
  categoryId?: string
}

export interface CreateUserInput {
  email: string
  username: string
  password: string
  name?: string
}

export interface CreateCategoryInput {
  name: string
  color?: string
  description?: string
}

export interface CreateReminderInput {
  todoId: string
  remindAt: Date
  message?: string
}