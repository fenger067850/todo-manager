'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Bell, User, Database, Shield, Plus, Edit, Trash2, Tag } from 'lucide-react'
import type { Category } from '@/types'

export default function Settings() {
  const { user, token } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [showCreateCategoryForm, setShowCreateCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showEditCategoryForm, setShowEditCategoryForm] = useState(false)

  useEffect(() => {
    if (token) {
      fetchCategories()
    }
  }, [token])

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
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const handleCreateCategory = async (categoryData: {
    name: string
    color?: string
    description?: string
  }) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      })

      if (response.ok) {
        const result = await response.json()
        setCategories(prev => [result.category, ...prev])
        setShowCreateCategoryForm(false)
      } else {
        const errorData = await response.json()
        alert(`创建失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error('创建分类失败:', error)
      alert('网络错误，请稍后再试')
    }
  }

  const handleUpdateCategory = async (categoryData: {
    name?: string
    color?: string
    description?: string
  }) => {
    if (!editingCategory) return

    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      })

      if (response.ok) {
        const result = await response.json()
        setCategories(prev => prev.map(category =>
          category.id === editingCategory.id ? result.category : category
        ))
        setShowEditCategoryForm(false)
        setEditingCategory(null)
      } else {
        const errorData = await response.json()
        alert(`更新失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error('更新分类失败:', error)
      alert('网络错误，请稍后再试')
    }
  }

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`确定要删除分类"${category.name}"吗？`)) return

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setCategories(prev => prev.filter(c => c.id !== category.id))
      } else {
        const errorData = await response.json()
        alert(`删除失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error('删除分类失败:', error)
      alert('网络错误，请稍后再试')
    }
  }

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

  const handleProcessReminders = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/reminders/process', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        alert('提醒处理完成！')
        console.log('提醒处理结果:', data)
      } else {
        const errorData = await response.json()
        alert(`处理失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error('处理提醒失败:', error)
      alert('网络错误，请稍后再试')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTestReminders = async () => {
    try {
      const response = await fetch('/api/reminders/process', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        alert('提醒测试完成！')
        console.log('提醒测试结果:', data)
      } else {
        const errorData = await response.json()
        alert(`测试失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error('测试提醒失败:', error)
      alert('网络错误，请稍后再试')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">设置</h1>
          <p className="text-gray-600 mt-2">
            管理您的账户和应用设置
          </p>
        </div>

        <div className="space-y-6">
          {/* 用户信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                用户信息
              </CardTitle>
              <CardDescription>
                您的基本账户信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    用户名
                  </label>
                  <Input
                    value={user.username}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱
                  </label>
                  <Input
                    value={user.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    姓名
                  </label>
                  <Input
                    value={user.name || '未设置'}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    注册时间
                  </label>
                  <Input
                    value={new Date(user.createdAt).toLocaleDateString()}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 分类管理 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                分类管理
              </CardTitle>
              <CardDescription>
                管理您的任务分类，帮助更好地组织和查找任务
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    已创建 {categories.length} 个分类
                  </p>
                </div>
                <Button
                  onClick={() => setShowCreateCategoryForm(true)}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新建分类
                </Button>
              </div>

              {isLoadingCategories ? (
                <div className="text-center py-8 text-gray-500">
                  加载中...
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <Tag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="font-medium mb-2">暂无分类</p>
                  <p className="text-sm">创建您的第一个分类，开始更好地组织任务</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      style={{
                        borderColor: category.color ? category.color + '30' : undefined,
                        backgroundColor: category.color ? category.color + '10' : undefined
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border-2"
                            style={{
                              backgroundColor: category.color || '#666',
                              borderColor: category.color || '#666'
                            }}
                          />
                          <h4 className="font-medium">{category.name}</h4>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category)
                              setShowEditCategoryForm(true)
                            }}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {category.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {category.description}
                        </p>
                      )}

                      <div className="text-xs text-gray-500">
                        {category._count?.todos || 0} 个任务
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 提醒设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                提醒设置
              </CardTitle>
              <CardDescription>
                管理任务提醒功能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">提醒功能说明</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 系统会自动为带截止时间的任务创建提醒</li>
                  <li>• 提醒时间包括：截止前1小时、1天、3天</li>
                  <li>• 您可以手动处理待发送的提醒</li>
                  <li>• 在生产环境中，建议使用定时任务自动处理</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleProcessReminders}
                  disabled={isProcessing}
                  variant="default"
                >
                  {isProcessing ? '处理中...' : '处理待发送提醒'}
                </Button>

                <Button
                  onClick={handleTestReminders}
                  variant="outline"
                >
                  测试提醒功能
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                <p><strong>功能说明：</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>系统会自动为带截止时间的任务创建提醒</li>
                  <li>提醒功能会在任务截止前适时通知</li>
                  <li>您可以通过&ldquo;处理待发送提醒&rdquo;来触发提醒检查</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 关于 */}
          <Card>
            <CardHeader>
              <CardTitle>关于</CardTitle>
              <CardDescription>
                应用程序信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">待办事项管理系统</h4>
                <p className="text-sm text-blue-800">
                  一个高效的任务管理工具，支持四象限分类、优先级管理、分类标签和提醒功能。
                  帮助您更好地组织和跟踪日常任务。
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium text-gray-700">版本</span>
                  <span className="text-sm text-gray-600">v1.0.0</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium text-gray-700">发布日期</span>
                  <span className="text-sm text-gray-600">2025年11月1日</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-700">开发者</span>
                  <span className="text-sm text-gray-600">宇哥</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 创建分类表单 */}
        {showCreateCategoryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>创建新分类</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleCreateCategory({
                    name: formData.get('name') as string,
                    description: formData.get('description') as string || undefined,
                    color: formData.get('color') as string || undefined,
                  })
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      分类名称 *
                    </label>
                    <Input
                      name="name"
                      type="text"
                      required
                      placeholder="请输入分类名称"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      分类描述
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请输入分类描述（可选）"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      分类颜色
                    </label>
                    <div className="flex gap-2 items-center">
                      <Input
                        name="color"
                        type="color"
                        defaultValue="#3B82F6"
                        className="h-10 w-20"
                      />
                      <span className="text-sm text-gray-500">选择分类显示颜色</span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateCategoryForm(false)}
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

        {/* 编辑分类表单 */}
        {showEditCategoryForm && editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>编辑分类</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleUpdateCategory({
                    name: formData.get('name') as string,
                    description: formData.get('description') as string || undefined,
                    color: formData.get('color') as string || undefined,
                  })
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      分类名称 *
                    </label>
                    <Input
                      name="name"
                      type="text"
                      required
                      defaultValue={editingCategory.name}
                      placeholder="请输入分类名称"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      分类描述
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={editingCategory.description || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请输入分类描述（可选）"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      分类颜色
                    </label>
                    <div className="flex gap-2 items-center">
                      <Input
                        name="color"
                        type="color"
                        defaultValue={editingCategory.color || '#3B82F6'}
                        className="h-10 w-20"
                      />
                      <span className="text-sm text-gray-500">选择分类显示颜色</span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditCategoryForm(false)
                        setEditingCategory(null)
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
      </div>
    </div>
  )
}