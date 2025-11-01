'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Paperclip } from 'lucide-react'
import type { Todo } from '@/types'

interface CalendarProps {
  todos: Todo[]
  cachedTodos?: Todo[]
  onDateClick?: (date: Date) => void
  onTodoClick?: (todo: Todo) => void
  onMonthChange?: (date: Date) => void
  token?: string
}

export function Calendar({ todos, cachedTodos = [], onDateClick, onTodoClick, onMonthChange, token }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: startDate, end: endDate })
  const weekDays = ['一', '二', '三', '四', '五', '六', '日']

  const navigateMonth = useCallback(async (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1)
    setCurrentDate(newDate)
    onMonthChange?.(newDate)

    // 如果有token，预加载下一个月的数据
    if (token) {
      try {
        const monthStart = startOfMonth(newDate)
        const monthEnd = endOfMonth(newDate)

        const response = await fetch('/api/todos/date-range', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            startDate: monthStart.toISOString(),
            endDate: monthEnd.toISOString()
          })
        })

        if (response.ok) {
          const data = await response.json()
          // 这里可以通过回调更新父组件的缓存
        }
      } catch (error) {
        console.error('预加载月份数据失败:', error)
      }
    }
  }, [currentDate, onMonthChange, token])

  // 合并当前todos和缓存的todos
  const allTodos = useMemo(() => {
    const currentMonth = format(new Date(), 'yyyy-MM')
    const calendarMonth = format(currentDate, 'yyyy-MM')

    // 如果是当前月份，使用最新的todos
    if (calendarMonth === currentMonth) {
      return todos
    }

    // 否则使用缓存的todos
    return cachedTodos.length > 0 ? cachedTodos : todos
  }, [todos, cachedTodos, currentDate])

  const getTodosForDate = useCallback((date: Date) => {
    // 使用时间戳范围查找，避免字符串格式化
    const dateStart = new Date(date)
    dateStart.setHours(0, 0, 0, 0)
    const dateEnd = new Date(date)
    dateEnd.setHours(23, 59, 59, 999)

    return allTodos.filter(todo => {
      if (!todo.dueDate) return false
      try {
        const todoDate = new Date(todo.dueDate)
        return todoDate >= dateStart && todoDate <= dateEnd
      } catch (error) {
        return false
      }
    })
  }, [allTodos])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500'
      case 'MEDIUM': return 'bg-yellow-500'
      case 'LOW': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getChineseMonth = (date: Date) => {
    const months = [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ]
    return `${date.getFullYear()}年 ${months[date.getMonth()]}`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* 日历头部 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {getChineseMonth(currentDate)}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            今天
          </button>

          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-base font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, new Date())
          const dayTodos = getTodosForDate(day)

          return (
            <div
              key={day.toString()}
              className={cn(
                'min-h-[160px] p-3 border rounded-lg cursor-pointer transition-all',
                isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100',
                isToday && 'bg-blue-50 border-blue-300',
                'hover:border-blue-400 hover:shadow-sm'
              )}
              onClick={() => onDateClick?.(day)}
            >
              <div className={cn(
                'text-lg font-medium mb-3',
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                isToday && 'text-blue-600'
              )}>
                {format(day, 'd')}
              </div>

              {/* 任务指示器 */}
              <div className="space-y-0.5">
                {dayTodos.slice(0, 6).map((todo) => (
                  <div
                    key={todo.id}
                    className="text-sm p-1 rounded cursor-pointer hover:opacity-80 leading-tight"
                    style={{
                      backgroundColor: getPriorityColor(todo.priority) + '20',
                      color: getPriorityColor(todo.priority).replace('bg-', ''),
                      borderLeft: `2px solid ${getPriorityColor(todo.priority)}`
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onTodoClick?.(todo)
                    }}
                    title={todo.title}
                  >
                    <div className="flex items-center gap-1">
                      <span className="truncate flex-1">{todo.title}</span>
                      {todo.attachments && todo.attachments.length > 0 && (
                        <Paperclip className="w-3 h-3 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}

                {dayTodos.length > 6 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayTodos.length - 6} 更多
                  </div>
                )}
              </div>

              {/* 任务数量指示器 */}
              {dayTodos.length > 0 && (
                <div className="flex justify-end mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 图例 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="font-medium">优先级：</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>高</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>中</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>低</span>
            </div>
          </div>

          <div className="text-gray-500">
            点击日期查看详情，点击任务编辑
          </div>
        </div>
      </div>
    </div>
  )
}