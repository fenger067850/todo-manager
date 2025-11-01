import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// 允许的文件类型
const ALLOWED_FILE_TYPES = {
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/plain': ['.txt'],
  'application/pdf': ['.pdf']
}

// 允许的文件扩展名
const ALLOWED_EXTENSIONS = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.pdf']

// 最大文件大小 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

// POST - 上传附件
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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const todoId = formData.get('todoId') as string

    if (!file) {
      return NextResponse.json({ error: '未提供文件' }, { status: 400 })
    }

    if (!todoId) {
      return NextResponse.json({ error: '未提供待办事项ID' }, { status: 400 })
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: '文件大小不能超过10MB' }, { status: 400 })
    }

    // 验证文件类型
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json({
        error: `不支持的文件类型。支持的格式：${ALLOWED_EXTENSIONS.join(', ')}`
      }, { status: 400 })
    }

    // 验证MIME类型
    if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
      return NextResponse.json({ error: '文件MIME类型不支持' }, { status: 400 })
    }

    // 验证待办事项是否存在且属于当前用户
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: decoded.userId,
      },
    })

    if (!todo) {
      return NextResponse.json({ error: '待办事项不存在' }, { status: 404 })
    }

    // 创建上传目录
    const uploadDir = join(process.cwd(), 'uploads', 'attachments')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const uniqueFilename = `${timestamp}_${randomString}_${file.name}`
    const filePath = join(uploadDir, uniqueFilename)

    // 保存文件
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // 保存附件信息到数据库
    const attachment = await prisma.attachment.create({
      data: {
        todoId,
        filename: uniqueFilename,
        originalName: file.name,
        fileType: file.type,
        fileSize: file.size,
        filePath: `/uploads/attachments/${uniqueFilename}`,
      },
    })

    return NextResponse.json({
      message: '文件上传成功',
      attachment: {
        id: attachment.id,
        originalName: attachment.originalName,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
        createdAt: attachment.createdAt,
      },
    })

  } catch (error) {
    console.error('文件上传失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// GET - 获取待办事项的所有附件
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const { searchParams } = new URL(request.url)
    const todoId = searchParams.get('todoId')

    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '无效的认证令牌' }, { status: 401 })
    }

    if (!todoId) {
      return NextResponse.json({ error: '未提供待办事项ID' }, { status: 400 })
    }

    // 验证待办事项是否存在且属于当前用户
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: decoded.userId,
      },
    })

    if (!todo) {
      return NextResponse.json({ error: '待办事项不存在' }, { status: 404 })
    }

    // 获取附件列表
    const attachments = await prisma.attachment.findMany({
      where: {
        todoId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        originalName: true,
        fileType: true,
        fileSize: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ attachments })

  } catch (error) {
    console.error('获取附件列表失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}