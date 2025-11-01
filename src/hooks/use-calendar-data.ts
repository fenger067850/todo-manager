import { useState, useEffect, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, subMonths, addMonths } from 'date-fns'
import type { Todo } from '@/types'

interface CalendarDataCache {
  [monthKey: string]: {
    todos: Todo[]
    lastUpdated: number
  }
}

export function useCalendarData(initialTodos: Todo[] = []) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [isLoading, setIsLoading] = useState(false)
  const [cache, setCache] = useState<CalendarDataCache>({})

  // 获取月份的缓存键
  const getMonthKey = (date: Date) => {
    return format(date, 'yyyy-MM')
  }

  // 按日期分组任务（优化版本）
  const getTodosByDate = useMemo(() => {
    const todosByDate = new Map<string, Todo[]>()

    todos.forEach(todo => {
      if (todo.dueDate) {
        try {
          const todoDate = new Date(todo.dueDate)
          if (!isNaN(todoDate.getTime())) {
            const dateKey = format(todoDate, 'yyyy-MM-dd')
            if (!todosByDate.has(dateKey)) {
              todosByDate.set(dateKey, [])
            }
            todosByDate.get(dateKey)!.push(todo)
          }
        } catch (error) {
          console.error('日期解析错误:', error)
        }
      }
    })

    return todosByDate
  }, [todos])

  // 获取指定日期的任务
  const getTodosForDate = (date: Date): Todo[] => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return getTodosByDate.get(dateKey) || []
  }

  // 预加载前后几个月的数据
  const preloadAdjacentMonths = async (currentDate: Date, token: string) => {
    const monthsToPreload = [
      subMonths(currentDate, 1),
      currentDate,
      addMonths(currentDate, 1)
    ]

    const loadPromises = monthsToPreload.map(async (month) => {
      const monthKey = getMonthKey(month)
      const now = Date.now()

      // 检查缓存是否存在且未过期（5分钟）
      if (cache[monthKey] && (now - cache[monthKey].lastUpdated) < 5 * 60 * 1000) {
        return
      }

      try {
        const monthStart = startOfMonth(month)
        const monthEnd = endOfMonth(month)

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
          setCache(prev => ({
            ...prev,
            [monthKey]: {
              todos: data.todos || [],
              lastUpdated: now
            }
          }))
        }
      } catch (error) {
        console.error('预加载月份数据失败:', error)
      }
    })

    await Promise.allSettled(loadPromises)
  }

  // 更新所有任务数据
  const updateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos)
  }

  // 从缓存获取指定月份的数据
  const getCachedMonthData = (date: Date) => {
    const monthKey = getMonthKey(date)
    return cache[monthKey]?.todos || []
  }

  // 合并当前任务和缓存数据
  const getAllTodosForMonth = (date: Date) => {
    const cachedTodos = getCachedMonthData(date)
    const currentMonthKey = getMonthKey(new Date())

    // 如果是当前月份，优先使用最新的 todos 数据
    if (getMonthKey(date) === currentMonthKey) {
      return todos
    }

    return cachedTodos
  }

  return {
    todos,
    isLoading,
    getTodosForDate,
    getTodosByDate,
    updateTodos,
    preloadAdjacentMonths,
    getCachedMonthData,
    getAllTodosForMonth,
    getMonthKey
  }
}