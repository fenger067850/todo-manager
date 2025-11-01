'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const { user } = useAuth()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            宇哥-待办事项+云盘存储管理平台
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            高效管理您的任务，支持四象限视图和月历视图
          </p>

          {!user && (
            <div className="space-x-4 mb-8">
              <Link
                href="/auth/login"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/auth/register"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                注册
              </Link>
            </div>
          )}

          {user && (
            <div className="mb-8">
              <Link
                href="/dashboard"
                className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                进入管理面板
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-red-500 text-3xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold mb-2">四象限管理</h3>
              <p className="text-gray-600">根据重要性和紧急性分类任务</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-blue-500 text-3xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">月历视图</h3>
              <p className="text-gray-600">直观查看整月任务安排</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-green-500 text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">用户管理</h3>
              <p className="text-gray-600">多用户独立管理各自任务</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-yellow-500 text-3xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold mb-2">提醒功能</h3>
              <p className="text-gray-600">及时提醒重要任务</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}