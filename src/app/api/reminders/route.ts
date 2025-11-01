import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const createReminderSchema = z.object({
  todoId: z.string().min(1, '待办事项ID不能为空'),
  remindAt: z.string().min(1, '提醒时间不能为空').transform(val => new Date(val)),
  message: z.string().max(200, '提醒消息最多200个字符').optional(),
})

// GET - 获取当前用户的所有提醒
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
    const isActive = searchParams.get('isActive')
    const upcoming = searchParams.get('upcoming')

    // 构建查询条件
    const where: any = {
      todo: {
        userId: decoded.userId
      }
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    // 如果查询即将到来的提醒
    if (upcoming === 'true') {
      const now = new Date()
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000) // 1小时后

      where.remindAt = {
        gte: now,
        lte: oneHourLater
      }
      where.isActive = true
    }

    const reminders = await prisma.reminder.findMany({
      where,
      include: {
        todo: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        remindAt: 'asc'
      },
    })

    return NextResponse.json({ reminders })
  } catch (error) {
    console.error('获取提醒失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// POST - 创建新的提醒
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
    const validatedData = createReminderSchema.parse(body)

    // 验证待办事项是否存在且属于当前用户
    const todo = await prisma.todo.findFirst({
      where: {
        id: validatedData.todoId,
        userId: decoded.userId,
      },
    })

    if (!todo) {
      return NextResponse.json(
        { error: '指定的待办事项不存在或无权访问' },
        { status: 404 }
      )
    }

    // 验证提醒时间不能是过去时间
    const remindAt = new Date(validatedData.remindAt)
    if (remindAt <= new Date()) {
      return NextResponse.json(
        { error: '提醒时间不能是过去时间' },
        { status: 400 }
      )
    }

    const reminder = await prisma.reminder.create({
      data: {
        ...validatedData,
        remindAt,
      },
      include: {
        todo: {
          include: {
            category: true
          }
        }
      },
    })

    return NextResponse.json({
      message: '提醒创建成功',
      reminder,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '输入数据验证失败', details: error.errors },
        { status: 400 }
      )
    }

    console.error('创建提醒失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}