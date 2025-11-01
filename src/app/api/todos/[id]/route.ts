import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const updateTodoSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题最多100个字符').optional(),
  description: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  isCompleted: z.boolean().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  quadrant: z.enum([
    'URGENT_IMPORTANT',
    'NOT_URGENT_IMPORTANT',
    'URGENT_NOT_IMPORTANT',
    'NOT_URGENT_NOT_IMPORTANT'
  ]).nullable().optional(),
  categoryId: z.string().nullable().optional(),
})

// PUT - 更新待办事项
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = updateTodoSchema.parse(body)

    // 检查待办事项是否存在且属于当前用户
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id: params.id,
        userId: decoded.userId,
      },
    })

    if (!existingTodo) {
      return NextResponse.json(
        { error: '待办事项不存在或无权访问' },
        { status: 404 }
      )
    }

    // 如果提供了 categoryId，验证它是否属于当前用户
    if (validatedData.categoryId !== undefined) {
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
    }

    const todo = await prisma.todo.update({
      where: { id: params.id },
      data: validatedData,
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
    })

    return NextResponse.json({
      message: '待办事项更新成功',
      todo,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '输入数据验证失败', details: error.errors },
        { status: 400 }
      )
    }

    console.error('更新待办事项失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// DELETE - 删除待办事项
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '无效的认证令牌' }, { status: 401 })
    }

    // 检查待办事项是否存在且属于当前用户
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id: params.id,
        userId: decoded.userId,
      },
    })

    if (!existingTodo) {
      return NextResponse.json(
        { error: '待办事项不存在或无权访问' },
        { status: 404 }
      )
    }

    await prisma.todo.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: '待办事项删除成功',
    })
  } catch (error) {
    console.error('删除待办事项失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}