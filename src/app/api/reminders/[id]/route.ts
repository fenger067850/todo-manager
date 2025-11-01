import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const updateReminderSchema = z.object({
  remindAt: z.string().optional().transform(val => val ? new Date(val) : undefined),
  message: z.string().max(200, '提醒消息最多200个字符').optional(),
  isActive: z.boolean().optional(),
})

// PUT - 更新提醒
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
    const validatedData = updateReminderSchema.parse(body)

    // 检查提醒是否存在且属于当前用户
    const existingReminder = await prisma.reminder.findFirst({
      where: {
        id: params.id,
        todo: {
          userId: decoded.userId,
        },
      },
    })

    if (!existingReminder) {
      return NextResponse.json(
        { error: '提醒不存在或无权访问' },
        { status: 404 }
      )
    }

    // 如果更新提醒时间，验证不能是过去时间
    if (validatedData.remindAt) {
      const remindAt = new Date(validatedData.remindAt)
      if (remindAt <= new Date()) {
        return NextResponse.json(
          { error: '提醒时间不能是过去时间' },
          { status: 400 }
        )
      }
    }

    const reminder = await prisma.reminder.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        todo: {
          include: {
            category: true
          }
        }
      },
    })

    return NextResponse.json({
      message: '提醒更新成功',
      reminder,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '输入数据验证失败', details: error.errors },
        { status: 400 }
      )
    }

    console.error('更新提醒失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// DELETE - 删除提醒
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

    // 检查提醒是否存在且属于当前用户
    const existingReminder = await prisma.reminder.findFirst({
      where: {
        id: params.id,
        todo: {
          userId: decoded.userId,
        },
      },
    })

    if (!existingReminder) {
      return NextResponse.json(
        { error: '提醒不存在或无权访问' },
        { status: 404 }
      )
    }

    await prisma.reminder.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: '提醒删除成功',
    })
  } catch (error) {
    console.error('删除提醒失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}