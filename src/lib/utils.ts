import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isTomorrow, isYesterday, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return '无截止日期'

  try {
    const dateObj = new Date(date)

    if (isNaN(dateObj.getTime())) {
      return '无效日期'
    }

    if (isToday(dateObj)) {
      return `今天 ${format(dateObj, 'HH:mm')}`
    }

    if (isTomorrow(dateObj)) {
      return `明天 ${format(dateObj, 'HH:mm')}`
    }

    if (isYesterday(dateObj)) {
      return `昨天 ${format(dateObj, 'HH:mm')}`
    }

    const month = format(dateObj, 'MM')
    const day = format(dateObj, 'dd')
    const time = format(dateObj, 'HH:mm')
    return `${month}月${day}日 ${time}`
  } catch (error) {
    console.error('日期格式化错误:', error)
    return '日期格式错误'
  }
}

export function formatRelativeTime(date: Date | null | undefined): string {
  if (!date) return ''

  try {
    const dateObj = new Date(date)

    if (isNaN(dateObj.getTime())) {
      return '无效日期'
    }

    return formatDistanceToNow(dateObj, {
      addSuffix: true,
    })
  } catch (error) {
    console.error('相对时间格式化错误:', error)
    return '时间格式错误'
  }
}

export function getPriorityColor(priority: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (priority) {
    case 'HIGH':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'MEDIUM':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'LOW':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getPriorityLabel(priority: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (priority) {
    case 'HIGH':
      return '高优先级'
    case 'MEDIUM':
      return '中优先级'
    case 'LOW':
      return '低优先级'
    default:
      return '未知'
  }
}

export function getQuadrantInfo(quadrant: string | null) {
  if (!quadrant) return null

  switch (quadrant) {
    case 'URGENT_IMPORTANT':
      return {
        label: '紧急且重要',
        color: 'bg-red-100 text-red-800 border-red-200',
        bgClass: 'bg-red-50',
        description: '立即处理'
      }
    case 'NOT_URGENT_IMPORTANT':
      return {
        label: '不紧急但重要',
        color: 'bg-green-100 text-green-800 border-green-200',
        bgClass: 'bg-green-50',
        description: '计划处理'
      }
    case 'URGENT_NOT_IMPORTANT':
      return {
        label: '紧急但不重要',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        bgClass: 'bg-orange-50',
        description: '委托处理'
      }
    case 'NOT_URGENT_NOT_IMPORTANT':
      return {
        label: '不紧急且不重要',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        bgClass: 'bg-gray-50',
        description: '后续处理'
      }
    default:
      return null
  }
}