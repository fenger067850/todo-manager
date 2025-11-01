import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

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

    const { startDate, endDate } = await request.json()

    if (!startDate || !endDate) {
      return NextResponse.json({ error: '请提供开始日期和结束日期' }, { status: 400 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: '无效的日期格式' }, { status: 400 })
    }

    const todos = await prisma.todo.findMany({
      where: {
        userId: decoded.userId,
        dueDate: {
          gte: start,
          lte: end
        }
      },
      include: {
        category: true
      },
      orderBy: [
        { dueDate: 'asc' },
        { priority: 'desc' }
      ]
    })

    return NextResponse.json({ todos })
  } catch (error) {
    console.error('获取日期范围待办事项失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}