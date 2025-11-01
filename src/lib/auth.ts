import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'
import type { User, CreateUserInput } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export interface AuthResult {
  user?: User
  token?: string
  error?: string
}

export async function register(data: CreateUserInput): Promise<AuthResult> {
  try {
    // 检查用户是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    })

    if (existingUser) {
      return { error: '用户名或邮箱已存在' }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    })

    // 生成JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 返回用户信息（不包含密码）
    const { password, ...userWithoutPassword } = user

    return { user: userWithoutPassword, token }
  } catch (error) {
    console.error('注册错误:', error)
    return { error: '注册失败，请稍后再试' }
  }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return { error: '用户不存在' }
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return { error: '密码错误' }
    }

    // 生成JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, token }
  } catch (error) {
    console.error('登录错误:', error)
    return { error: '登录失败，请稍后再试' }
  }
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) return null

    // 返回用户信息（不包含密码）
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error('获取用户信息错误:', error)
    return null
  }
}