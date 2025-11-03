'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatDate, getPriorityColor, getPriorityLabel } from '@/lib/utils'
import { Paperclip } from 'lucide-react'
import type { Todo } from '@/types'

interface QuadrantData {
  URGENT_IMPORTANT: Todo[]
  NOT_URGENT_IMPORTANT: Todo[]
  URGENT_NOT_IMPORTANT: Todo[]
  NOT_URGENT_NOT_IMPORTANT: Todo[]
}

const quadrantConfigs = [
  {
    key: 'URGENT_IMPORTANT',
    title: '紧急且重要',
    subtitle: '立即处理',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    headerBg: 'bg-red-100',
    textColor: 'text-red-800',
    description: '需要立即处理的危机和紧急任务'
  },
  {
    key: 'NOT_URGENT_IMPORTANT',
    title: '不紧急但重要',
    subtitle: '计划处理',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    headerBg: 'bg-green-100',
    textColor: 'text-green-800',
    description: '需要长期规划和重要发展任务'
  },
  {
    key: 'URGENT_NOT_IMPORTANT',
    title: '紧急但不重要',
    subtitle: '委托处理',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    headerBg: 'bg-orange-100',
    textColor: 'text-orange-800',
    description: '可以委托他人处理的干扰性任务'
  },
  {
    key: 'NOT_URGENT_NOT_IMPORTANT',
    title: '不紧急且不重要',
    subtitle: '后续处理',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    headerBg: 'bg-gray-100',
    textColor: 'text-gray-800',
    description: '可以减少或消除的浪费时间活动'
  }
]

export default function QuadrantsView() {
  const { user, token } = useAuth()
  const [quadrants, setQuadrants] = useState<QuadrantData>({
    URGENT_IMPORTANT: [],
    NOT_URGENT_IMPORTANT: [],
    URGENT_NOT_IMPORTANT: [],
    NOT_URGENT_NOT_IMPORTANT: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null)

  useEffect(() => {
    if (token) {
      fetchTodos()
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
        const todos = data.todos

        // 按象限分组待办事项
        const groupedTodos: QuadrantData = {
          URGENT_IMPORTANT: todos.filter((t: Todo) => t.quadrant === 'URGENT_IMPORTANT'),
          NOT_URGENT_IMPORTANT: todos.filter((t: Todo) => t.quadrant === 'NOT_URGENT_IMPORTANT'),
          URGENT_NOT_IMPORTANT: todos.filter((t: Todo) => t.quadrant === 'URGENT_NOT_IMPORTANT'),
          NOT_URGENT_NOT_IMPORTANT: todos.filter((t: Todo) => t.quadrant === 'NOT_URGENT_NOT_IMPORTANT')
        }

        setQuadrants(groupedTodos)
      }
    } catch (error) {
      console.error('获取待办事项失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragStart = (todo: Todo) => {
    setDraggedTodo(todo)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetQuadrant: string) => {
    e.preventDefault()

    if (!draggedTodo) return

    try {
      const response = await fetch(`/api/todos/${draggedTodo.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quadrant: targetQuadrant
        })
      })

      if (response.ok) {
        // 更新本地状态
        setQuadrants(prev => {
          const updated = { ...prev }

          // 从原象限移除
          const sourceQuadrant = draggedTodo.quadrant
          if (sourceQuadrant) {
            updated[sourceQuadrant as keyof QuadrantData] = updated[sourceQuadrant as keyof QuadrantData]
              .filter(t => t.id !== draggedTodo.id)
          }

          // 添加到目标象限
          const updatedTodo = { ...draggedTodo, quadrant: targetQuadrant as any }
          updated[targetQuadrant as keyof QuadrantData] = [...updated[targetQuadrant as keyof QuadrantData], updatedTodo]

          return updated
        })
      }
    } catch (error) {
      console.error('更新任务象限失败:', error)
    }

    setDraggedTodo(null)
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
        setQuadrants(prev => {
          const updated = { ...prev }
          Object.keys(updated).forEach(quadrant => {
            updated[quadrant as keyof QuadrantData] = updated[quadrant as keyof QuadrantData]
              .map(t => t.id === todo.id ? { ...t, isCompleted: !t.isCompleted } : t)
          })
          return updated
        })
      }
    } catch (error) {
      console.error('更新任务状态失败:', error)
    }
  }

  const TodoCard = ({ todo }: { todo: Todo }) => (
    <div
      draggable
      onDragStart={() => handleDragStart(todo)}
      className={cn(
        "bg-white p-3 rounded-lg border border-gray-200 cursor-move hover:shadow-md transition-all",
        "dragging:opacity-50",
        todo.isCompleted && "opacity-60"
      )}
    >
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => handleToggleComplete(todo)}
          className="mt-1 h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
        />

        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-medium text-sm truncate",
            todo.isCompleted && "line-through text-gray-500"
          )}>
            {todo.title}
          </h4>

          {todo.description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {todo.description}
            </p>
          )}

          <div className="flex items-center gap-1 mt-2 flex-wrap">
            <span className={cn(
              "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border",
              getPriorityColor(todo.priority)
            )}>
              {getPriorityLabel(todo.priority)}
            </span>

            {todo.dueDate && (
              <span className="text-xs text-gray-500">
                {formatDate(todo.dueDate)}
              </span>
            )}

            {todo.attachments && todo.attachments.length > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                <Paperclip className="w-3 h-3 mr-1" />
                {todo.attachments.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

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
          <h1 className="text-3xl font-bold text-gray-900">四象限管理</h1>
          <p className="text-gray-600 mt-2">
            根据重要性和紧急性来管理您的任务，提高工作效率
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {quadrantConfigs.map((config) => (
              <Card
                key={config.key}
                className={cn(
                  "h-full min-h-[400px] flex flex-col",
                  config.bgColor,
                  config.borderColor,
                  "border-2"
                )}
              >
                <CardHeader className={cn(config.headerBg, "pb-3")}>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className={cn("text-lg", config.textColor)}>
                        {config.title}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {config.subtitle} • {quadrants[config.key as keyof QuadrantData].length} 个任务
                      </CardDescription>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {config.description}
                  </p>
                </CardHeader>

                <CardContent
                  className="flex-1 p-4"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, config.key)}
                >
                  <div className="space-y-3 min-h-[300px]">
                    {quadrants[config.key as keyof QuadrantData].length === 0 ? (
                      <div className="text-center py-12 text-gray-500 text-sm">
                        拖拽任务到这里
                      </div>
                    ) : (
                      quadrants[config.key as keyof QuadrantData].map((todo) => (
                        <TodoCard key={todo.id} todo={todo} />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 bg-pink-50 border border-pink-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-pink-900 mb-3">使用说明</h3>
          <ul className="space-y-2 text-sm text-pink-800">
            <li>• 拖拽任务卡片到不同象限来改变任务的分类</li>
            <li>• 勾选复选框标记任务完成状态</li>
            <li>• 点击任务可以查看详细信息</li>
            <li>• 优先级和截止日期会显示在任务卡片上</li>
          </ul>
        </div>
      </div>
    </div>
  )
}