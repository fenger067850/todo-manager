import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { readFile } from 'fs/promises'
import { join } from 'path'

// GET - 下载附件
export async function GET(
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

    // 获取附件信息，同时验证权限
    const attachment = await prisma.attachment.findFirst({
      where: {
        id: params.id,
        todo: {
          userId: decoded.userId,
        },
      },
    })

    if (!attachment) {
      return NextResponse.json({ error: '附件不存在' }, { status: 404 })
    }

    // 读取文件
    const filePath = join(process.cwd(), 'uploads', 'attachments', attachment.filename)

    try {
      const fileBuffer = await readFile(filePath)

      // 设置响应头
      const headers = new Headers()
      headers.set('Content-Type', attachment.fileType)
      headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(attachment.originalName)}"`)
      headers.set('Content-Length', fileBuffer.length.toString())

      return new NextResponse(fileBuffer, {
        status: 200,
        headers,
      })

    } catch (fileError) {
      console.error('读取文件失败:', fileError)
      return NextResponse.json({ error: '文件不存在或已损坏' }, { status: 404 })
    }

  } catch (error) {
    console.error('下载附件失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// DELETE - 删除附件
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

    // 获取附件信息，同时验证权限
    const attachment = await prisma.attachment.findFirst({
      where: {
        id: params.id,
        todo: {
          userId: decoded.userId,
        },
      },
    })

    if (!attachment) {
      return NextResponse.json({ error: '附件不存在' }, { status: 404 })
    }

    // 删除数据库记录
    await prisma.attachment.delete({
      where: { id: params.id },
    })

    // 尝试删除物理文件（不抛出错误，因为文件可能已被删除）
    try {
      const filePath = join(process.cwd(), 'uploads', 'attachments', attachment.filename)
      const fs = await import('fs/promises')
      await fs.unlink(filePath)
    } catch (fileError) {
      console.warn('删除物理文件失败:', fileError)
    }

    return NextResponse.json({
      message: '附件删除成功',
    })

  } catch (error) {
    console.error('删除附件失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}