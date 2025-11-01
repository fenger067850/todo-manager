'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search, Filter, Edit, Trash2, Paperclip } from 'lucide-react'
import { cn, formatDate, getPriorityColor, getPriorityLabel, getQuadrantInfo } from '@/lib/utils'
import { AttachmentManager } from '@/components/attachments'
import { TempAttachmentManager } from '@/components/temp-attachments'
import type { Todo, Category, Attachment } from '@/types'

export default function Dashboard() {
  const { user, token } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterQuadrant, setFilterQuadrant] = useState<string>('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [quickAddTitle, setQuickAddTitle] = useState('')
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [createFormTodoId, setCreateFormTodoId] = useState<string | null>(null)
  const [createFormAttachments, setCreateFormAttachments] = useState<Attachment[]>([])

  useEffect(() => {
    if (token) {
      fetchTodos()
      fetchCategories()
    }
  }, [token])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTodos(data.todos)
      }
    } catch (error) {
      console.error('获取待办事项失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isCompleted: !todo.isCompleted
        })
      })

      if (response.ok) {
        // 更新本地状态
        setTodos(prev => prev.map(t =>
          t.id === todo.id ? { ...t, isCompleted: !t.isCompleted } : t
        ))
      }
    } catch (error) {
      console.error('更新任务状态失败:', error)
    }
  }

  const handleCreateTodo = async (todoData: {
    title: string
    description?: string
    priority: string
    quadrant?: string
    categoryId?: string
    dueDate?: string
  }) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoData)
      })

      if (response.ok) {
        const result = await response.json()
        const newTodo = result.todo

        // 设置创建表单的待办事项ID，用于附件上传
        setCreateFormTodoId(newTodo.id)

        // 如果有临时附件，上传到服务器
        if (createFormAttachments.length > 0) {
          for (const attachment of createFormAttachments) {
            try {
              // 如果attachment.filePath是base64数据，转换为文件
              if (attachment.filePath && attachment.filePath.startsWith('data:')) {
                // 将base64转换为Blob
                const response = await fetch(attachment.filePath)
                const blob = await response.blob()
                const file = new File([blob], attachment.originalName, { type: attachment.fileType })

                const formData = new FormData()
                formData.append('file', file)
                formData.append('todoId', newTodo.id)

                const uploadResponse = await fetch('/api/attachments', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`
                  },
                  body: formData
                })

                if (uploadResponse.ok) {
                  const uploadResult = await uploadResponse.json()
                  // 更新本地todo的附件列表
                  newTodo.attachments = newTodo.attachments || []
                  newTodo.attachments.push(uploadResult.attachment)
                }
              }
            } catch (error) {
              console.error('上传附件失败:', error)
            }
          }
        }

        setTodos(prev => [newTodo, ...prev])
        setShowCreateForm(false)
        setCreateFormTodoId(null)
        setCreateFormAttachments([])
      }
    } catch (error) {
      console.error('创建任务失败:', error)
    }
  }

  // 快速添加待办事项的函数
  const handleQuickAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!quickAddTitle.trim()) return

    const todoData = {
      title: quickAddTitle.trim(),
      priority: 'MEDIUM', // 默认中等优先级
      quadrant: 'NOT_URGENT_IMPORTANT', // 默认放在"不紧急但重要"象限
    }

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoData)
      })

      if (response.ok) {
        const result = await response.json()
        setTodos(prev => [result.todo, ...prev])
        setQuickAddTitle('') // 清空输入框
      }
    } catch (error) {
      console.error('快速创建任务失败:', error)
    }
  }

  // 编辑待办事项的函数
  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setShowEditForm(true)
  }

  // 更新待办事项的函数
  const handleUpdateTodo = async (todoData: {
    title: string
    description?: string
    priority: string
    quadrant?: string
    categoryId?: string
    dueDate?: string
  }) => {
    if (!editingTodo) return

    try {
      const response = await fetch(`/api/todos/${editingTodo.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoData)
      })

      if (response.ok) {
        const result = await response.json()
        setTodos(prev => prev.map(todo =>
          todo.id === editingTodo.id ? result.todo : todo
        ))
        setShowEditForm(false)
        setEditingTodo(null)
      }
    } catch (error) {
      console.error('更新任务失败:', error)
    }
  }

  // 删除待办事项的函数
  const handleDeleteTodo = async (todo: Todo) => {
    if (!confirm('确定要删除这个待办事项吗？')) return

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setTodos(prev => prev.filter(t => t.id !== todo.id))
      }
    } catch (error) {
      console.error('删除任务失败:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (todo.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    const matchesQuadrant = !filterQuadrant || todo.quadrant === filterQuadrant
    return matchesSearch && matchesQuadrant
  })

  const todosByQuadrant = {
    URGENT_IMPORTANT: filteredTodos.filter(t => t.quadrant === 'URGENT_IMPORTANT'),
    NOT_URGENT_IMPORTANT: filteredTodos.filter(t => t.quadrant === 'NOT_URGENT_IMPORTANT'),
    URGENT_NOT_IMPORTANT: filteredTodos.filter(t => t.quadrant === 'URGENT_NOT_IMPORTANT'),
    NOT_URGENT_NOT_IMPORTANT: filteredTodos.filter(t => t.quadrant === 'NOT_URGENT_NOT_IMPORTANT'),
  }

  const quadrantConfigs = [
    { key: 'URGENT_IMPORTANT', title: '紧急且重要', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    { key: 'NOT_URGENT_IMPORTANT', title: '不紧急但重要', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { key: 'URGENT_NOT_IMPORTANT', title: '紧急但不重要', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    { key: 'NOT_URGENT_NOT_IMPORTANT', title: '不紧急且不重要', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">请先登录</h1>
          <Button onClick={() => window.location.href = '/auth/login'}>
            去登录
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">仪表板</h1>
              <p className="text-gray-600 mt-2">管理您的待办事项</p>
            </div>

            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              新建待办
            </Button>
          </div>

          {/* 快速添加待办事项 */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <form onSubmit={handleQuickAddTodo} className="flex-1 flex gap-3">
                <Input
                  type="text"
                  placeholder="快速添加待办事项，按回车创建..."
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  className="flex-1 border-none shadow-none focus:outline-none focus:ring-0 text-base"
                />
                <Button
                  type="submit"
                  disabled={!quickAddTitle.trim()}
                  size="sm"
                  className="px-4"
                >
                  快速添加
                </Button>
              </form>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索待办事项..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterQuadrant}
              onChange={(e) => setFilterQuadrant(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有象限</option>
              <option value="URGENT_IMPORTANT">紧急且重要</option>
              <option value="NOT_URGENT_IMPORTANT">不紧急但重要</option>
              <option value="URGENT_NOT_IMPORTANT">紧急但不重要</option>
              <option value="NOT_URGENT_NOT_IMPORTANT">不紧急且不重要</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {quadrantConfigs.map((config) => {
              const quadrantTodos = todosByQuadrant[config.key as keyof typeof todosByQuadrant]

              return (
                <Card key={config.key} className={cn(config.bgColor, config.borderColor, 'border')}>
                  <CardHeader>
                    <CardTitle className="text-lg">{config.title}</CardTitle>
                    <CardDescription>
                      {quadrantTodos.length} 个任务
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {quadrantTodos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          暂无任务
                        </div>
                      ) : (
                        quadrantTodos.map((todo) => (
                          <div
                            key={todo.id}
                            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={cn(
                                  'font-medium',
                                  todo.isCompleted && 'line-through text-gray-500'
                                )}>
                                  {todo.title}
                                </h4>

                                {todo.description && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {todo.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-2 mt-2">
                                  <span className={cn(
                                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
                                    getPriorityColor(todo.priority)
                                  )}>
                                    {getPriorityLabel(todo.priority)}
                                  </span>

                                  {todo.dueDate && (
                                    <span className="text-xs text-gray-500">
                                      {formatDate(todo.dueDate)}
                                    </span>
                                  )}

                                  {todo.category && (
                                    <span
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                      style={{ backgroundColor: (todo.category.color || '#666') + '20', color: todo.category.color || '#666' }}
                                    >
                                      {todo.category.name}
                                    </span>
                                  )}

                                  {todo.attachments && todo.attachments.length > 0 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                      <Paperclip className="w-3 h-3 mr-1" />
                                      {todo.attachments.length}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={todo.isCompleted}
                                  onChange={() => handleToggleComplete(todo)}
                                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                />

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditTodo(todo)}
                                  className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTodo(todo)}
                                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* 编辑任务表单 */}
        {showEditForm && editingTodo && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              // 只有点击背景时才关闭弹窗
              if (e.target === e.currentTarget) {
                setShowEditForm(false)
                setEditingTodo(null)
              }
            }}
          >
            <Card
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // 阻止点击卡片时事件冒泡到背景
            >
              <CardHeader>
                <CardTitle>编辑待办事项</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleUpdateTodo({
                    title: formData.get('title') as string,
                    description: formData.get('description') as string || undefined,
                    priority: formData.get('priority') as string,
                    quadrant: formData.get('quadrant') as string || undefined,
                    categoryId: formData.get('categoryId') as string || undefined,
                    dueDate: formData.get('dueDate') as string || undefined,
                  })
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      任务标题 *
                    </label>
                    <Input
                      name="title"
                      type="text"
                      required
                      defaultValue={editingTodo.title}
                      placeholder="请输入任务标题"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      任务描述
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={editingTodo.description || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请输入任务描述（可选）"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        优先级
                      </label>
                      <select
                        name="priority"
                        defaultValue={editingTodo.priority}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="LOW">低</option>
                        <option value="MEDIUM">中</option>
                        <option value="HIGH">高</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        四象限
                      </label>
                      <select
                        name="quadrant"
                        defaultValue={editingTodo.quadrant || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">选择象限</option>
                        <option value="URGENT_IMPORTANT">紧急且重要</option>
                        <option value="NOT_URGENT_IMPORTANT">不紧急但重要</option>
                        <option value="URGENT_NOT_IMPORTANT">紧急但不重要</option>
                        <option value="NOT_URGENT_NOT_IMPORTANT">不紧急且不重要</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        分类
                      </label>
                      <select
                        name="categoryId"
                        defaultValue={editingTodo.categoryId || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">选择分类</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        截止日期
                      </label>
                      <Input
                        name="dueDate"
                        type="datetime-local"
                        defaultValue={editingTodo.dueDate ? new Date(editingTodo.dueDate).toISOString().slice(0, 16) : ''}
                      />
                    </div>
                  </div>

                  {/* 附件管理 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      附件管理
                    </label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <AttachmentManager
                        todoId={editingTodo.id}
                        attachments={editingTodo.attachments || []}
                        onAttachmentAdded={(attachment) => {
                          // 更新编辑中的待办事项的附件列表
                          setEditingTodo(prev => prev ? {
                            ...prev,
                            attachments: [attachment, ...(prev.attachments || [])]
                          } : null)
                          // 同时更新全局待办事项列表
                          setTodos(prevTodos => prevTodos.map(todo =>
                            todo.id === editingTodo.id
                              ? { ...todo, attachments: [attachment, ...(todo.attachments || [])] }
                              : todo
                          ))
                        }}
                        onAttachmentDeleted={(attachmentId) => {
                          // 更新编辑中的待办事项的附件列表
                          setEditingTodo(prev => prev ? {
                            ...prev,
                            attachments: (prev.attachments || []).filter(a => a.id !== attachmentId)
                          } : null)
                          // 同时更新全局待办事项列表
                          setTodos(prevTodos => prevTodos.map(todo =>
                            todo.id === editingTodo.id
                              ? { ...todo, attachments: (todo.attachments || []).filter(a => a.id !== attachmentId) }
                              : todo
                          ))
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditForm(false)
                        setEditingTodo(null)
                      }}
                    >
                      取消
                    </Button>
                    <Button type="submit">
                      保存修改
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 创建任务表单 */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>创建新待办事项</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleCreateTodo({
                    title: formData.get('title') as string,
                    description: formData.get('description') as string || undefined,
                    priority: formData.get('priority') as string,
                    quadrant: formData.get('quadrant') as string || undefined,
                    categoryId: formData.get('categoryId') as string || undefined,
                    dueDate: formData.get('dueDate') as string || undefined,
                  })
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      任务标题 *
                    </label>
                    <Input
                      name="title"
                      type="text"
                      required
                      placeholder="请输入任务标题"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      任务描述
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请输入任务描述（可选）"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        优先级
                      </label>
                      <select name="priority" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="LOW">低</option>
                        <option value="MEDIUM">中</option>
                        <option value="HIGH">高</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        四象限
                      </label>
                      <select name="quadrant" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="">选择象限</option>
                        <option value="URGENT_IMPORTANT">紧急且重要</option>
                        <option value="NOT_URGENT_IMPORTANT">不紧急但重要</option>
                        <option value="URGENT_NOT_IMPORTANT">紧急但不重要</option>
                        <option value="NOT_URGENT_NOT_IMPORTANT">不紧急且不重要</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        分类
                      </label>
                      <select name="categoryId" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="">选择分类</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        截止日期
                      </label>
                      <Input
                        name="dueDate"
                        type="datetime-local"
                      />
                    </div>
                  </div>

                  {/* 附件管理 */}
                  <div>
                    <TempAttachmentManager
                      attachments={createFormAttachments}
                      onAttachmentsChange={setCreateFormAttachments}
                      todoId={createFormTodoId}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      取消
                    </Button>
                    <Button type="submit">
                      创建
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}