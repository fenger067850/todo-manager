'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from './ui/button'
import {
  Home,
  CheckSquare,
  Calendar,
  Grid3X3,
  Settings,
  LogOut,
  User
} from 'lucide-react'

const navigation = [
  { name: '首页', href: '/', icon: Home },
  { name: '待办事项', href: '/dashboard', icon: CheckSquare },
  { name: '四象限视图', href: '/quadrants', icon: Grid3X3 },
  { name: '月历视图', href: '/calendar', icon: Calendar },
  { name: '设置', href: '/settings', icon: Settings },
]

export function Navigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  return (
    <nav className="bg-gradient-to-r from-pink-50 to-purple-50 shadow-sm border-b-2 border-pink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-pink-600">
                凤歌-待办管理
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? 'border-pink-500 text-pink-900'
                        : 'border-transparent text-pink-600 hover:border-pink-300 hover:text-pink-800'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-pink-800">
              <User className="w-4 h-4" />
              <span>{user.name || user.username}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-pink-600 hover:text-pink-800 hover:bg-pink-100"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 移动端导航 */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? 'bg-pink-100 border-pink-500 text-pink-900'
                    : 'border-transparent text-pink-700 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-900'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}