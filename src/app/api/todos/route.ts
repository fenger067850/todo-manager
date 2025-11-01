import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const createTodoSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题最多100个字符'),
  description: z.string().optional(),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : null),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  quadrant: z.enum([
    'URGENT_IMPORTANT',
    'NOT_URGENT_IMPORTANT',
    'URGENT_NOT_IMPORTANT',
    'NOT_URGENT_NOT_IMPORTANT'
  ]).optional(),
  categoryId: z.string().optional(),
})

// GET - 获取当前用户的所有待办事项
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '无效的认证令牌' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const quadrant = searchParams.get('quadrant')
    const priority = searchParams.get('priority')
    const isCompleted = searchParams.get('isCompleted')
    const categoryId = searchParams.get('categoryId')

    // 构建查询条件
    const where: any = { userId: decoded.userId }

    if (quadrant) where.quadrant = quadrant
    if (priority) where.priority = priority
    if (isCompleted !== null) where.isCompleted = isCompleted === 'true'
    if (categoryId) where.categoryId = categoryId

    const todos = await prisma.todo.findMany({
      where,
      include: {
        category: true,
        reminders: true,
        attachments: {
          select: {
            id: true,
            originalName: true,
            fileType: true,
            fileSize: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: [
        { isCompleted: 'asc' },
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ todos })
  } catch (error) {
    console.error('获取待办事项失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// POST - 创建新的待办事项
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '无效的认证令牌' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createTodoSchema.parse(body)

    // 如果提供了 categoryId，验证它是否属于当前用户
    if (validatedData.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: validatedData.categoryId,
          userId: decoded.userId,
        },
      })

      if (!category) {
        return NextResponse.json(
          { error: '指定的分类不存在或无权访问' },
          { status: 404 }
        )
      }
    }

    const todo = await prisma.todo.create({
      data: {
        ...validatedData,
        userId: decoded.userId,
      },
      include: {
        category: true,
        reminders: true,
      },
    })

    return NextResponse.json({
      message: '待办事项创建成功',
      todo,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '输入数据验证失败', details: error.errors },
        { status: 400 }
      )
    }

    console.error('创建待办事项失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}