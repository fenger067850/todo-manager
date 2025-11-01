import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const updateCategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空').max(50, '分类名称最多50个字符').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, '颜色格式无效').optional(),
  description: z.string().max(200, '描述最多200个字符').optional(),
})

// PUT - 更新分类
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
    const validatedData = updateCategorySchema.parse(body)

    // 检查分类是否存在且属于当前用户
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: params.id,
        userId: decoded.userId,
      },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: '分类不存在' }, { status: 404 })
    }

    // 如果更新了名称，检查新名称是否已存在
    if (validatedData.name && validatedData.name !== existingCategory.name) {
      const duplicateCategory = await prisma.category.findFirst({
        where: {
          name: validatedData.name,
          userId: decoded.userId,
          id: { not: params.id },
        },
      })

      if (duplicateCategory) {
        return NextResponse.json({ error: '分类名称已存在' }, { status: 400 })
      }
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        _count: {
          select: { todos: true }
        }
      },
    })

    return NextResponse.json({
      message: '分类更新成功',
      category,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '输入数据验证失败', details: error.errors },
        { status: 400 }
      )
    }

    console.error('更新分类失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// DELETE - 删除分类
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

    // 检查分类是否存在且属于当前用户
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: params.id,
        userId: decoded.userId,
      },
      include: {
        _count: {
          select: { todos: true }
        }
      },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: '分类不存在' }, { status: 404 })
    }

    // 检查是否有关联的待办事项
    if (existingCategory._count.todos > 0) {
      return NextResponse.json(
        { error: `无法删除，该分类下还有 ${existingCategory._count.todos} 个待办事项` },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: '分类删除成功',
    })
  } catch (error) {
    console.error('删除分类失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}