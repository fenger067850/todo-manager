'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Navigation } from '@/components/navigation'
import { Calendar } from '@/components/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate, getPriorityColor, getPriorityLabel, cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Paperclip } from 'lucide-react'
import type { Todo } from '@/types'

export default function CalendarView() {
  const { user, token } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
        setTodos(data.todos)
      }
    } catch (error) {
      console.error('获取待办事项失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const selectedDateTodos = useMemo(() => {
    if (!selectedDate) return []

    const selectedDateStart = new Date(selectedDate)
    selectedDateStart.setHours(0, 0, 0, 0)
    const selectedDateEnd = new Date(selectedDate)
    selectedDateEnd.setHours(23, 59, 59, 999)

    return todos.filter(todo => {
      if (!todo.dueDate) return false
      try {
        const todoDate = new Date(todo.dueDate)
        return todoDate >= selectedDateStart && todoDate <= selectedDateEnd
      } catch (error) {
        console.error('日期解析错误:', error)
        return false
      }
    })
  }, [selectedDate, todos])

  const handleTodoClick = (todo: Todo) => {
    console.log('点击任务:', todo)
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
        setTodos(prev => prev.map(t =>
          t.id === todo.id ? { ...t, isCompleted: !t.isCompleted } : t
        ))
      }
    } catch (error) {
      console.error('更新任务状态失败:', error)
    }
  }

  const getCurrentMonthStats = () => {
    const now = new Date()
    const currentMonth = format(now, 'yyyy-MM')

    const thisMonthTodos = todos.filter(todo => {
      if (!todo.dueDate) return false
      return format(new Date(todo.dueDate), 'yyyy-MM') === currentMonth
    })

    return {
      total: thisMonthTodos.length,
      completed: thisMonthTodos.filter(t => t.isCompleted).length,
      high: thisMonthTodos.filter(t => t.priority === 'HIGH').length,
      overdue: thisMonthTodos.filter(t =>
        t.dueDate && new Date(t.dueDate) < now && !t.isCompleted
      ).length
    }
  }

  const stats = getCurrentMonthStats()

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

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">月历视图</h1>
          <p className="text-gray-600 mt-2">
            以月历形式查看和管理您的任务安排
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                本月任务
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">
                总任务数
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                已完成
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-gray-500 mt-1">
                完成率 {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                高优先级
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.high}</div>
              <p className="text-xs text-gray-500 mt-1">
                需要优先处理
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                逾期任务
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.overdue}</div>
              <p className="text-xs text-gray-500 mt-1">
                需要立即处理
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">
          <div className="xl:col-span-5">
            {isLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <div className="text-gray-500">加载中...</div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Calendar
                todos={todos}
                onDateClick={handleDateClick}
                onTodoClick={handleTodoClick}
              />
            )}
          </div>

          <div className="xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate
                    ? format(selectedDate, 'MM月dd日')
                    : '选择日期查看任务'
                  }
                </CardTitle>
                {selectedDate && (
                  <CardDescription>
                    {selectedDateTodos.length} 个任务
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent>
                {selectedDateTodos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {selectedDate ? '该日期暂无任务' : '请点击日历中的日期查看任务'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                        onClick={() => handleTodoClick(todo)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={todo.isCompleted}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleToggleComplete(todo)
                            }}
                            className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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

                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className={cn(
                                "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border",
                                getPriorityColor(todo.priority)
                              )}>
                                {getPriorityLabel(todo.priority)}
                              </span>

                              {todo.category && (
                                <span
                                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
                                  style={{
                                    backgroundColor: (todo.category.color || '#666') + '20',
                                    color: todo.category.color || '#666'
                                  }}
                                >
                                  {todo.category.name}
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
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">使用说明</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 点击日历中的日期查看当天任务</li>
                  <li>• 任务颜色表示优先级（红=高，黄=中，绿=低）</li>
                  <li>• 点击任务可以查看或编辑详情</li>
                  <li>• 勾选复选框标记任务完成</li>
                  <li>• 右侧显示选中日期的任务列表</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}