import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const createCategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空').max(50, '分类名称最多50个字符'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, '颜色格式无效').optional(),
  description: z.string().max(200, '描述最多200个字符').optional(),
})

// GET - 获取当前用户的所有分类
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

    const categories = await prisma.category.findMany({
      where: { userId: decoded.userId },
      include: {
        _count: {
          select: { todos: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('获取分类失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// POST - 创建新的分类
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
    const validatedData = createCategorySchema.parse(body)

    // 检查分类名称是否已存在
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: validatedData.name,
        userId: decoded.userId,
      },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: '分类名称已存在' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        ...validatedData,
        userId: decoded.userId,
      },
      include: {
        _count: {
          select: { todos: true }
        }
      },
    })

    return NextResponse.json({
      message: '分类创建成功',
      category,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '输入数据验证失败', details: error.errors },
        { status: 400 }
      )
    }

    console.error('创建分类失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}