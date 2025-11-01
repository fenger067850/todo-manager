import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证输入数据
    const validatedData = loginSchema.parse(body)

    // 用户登录
    const result = await login(validatedData.email, validatedData.password)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: '登录成功',
      user: result.user,
      token: result.token
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '输入数据验证失败', details: error.errors },
        { status: 400 }
      )
    }

    console.error('登录API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}