import { NextRequest, NextResponse } from 'next/server'
import { processPendingReminders } from '@/lib/reminder-service'

/**
 * 这个API端点用于手动触发提醒处理
 * 在生产环境中，应该使用cron job或其他调度工具定期调用
 */
export async function POST(request: NextRequest) {
  try {
    // 验证调用权限（可以添加特定的认证机制）
    const authHeader = request.headers.get('authorization')

    // 这里可以添加特定的验证逻辑，比如验证API密钥
    // if (authHeader !== `Bearer ${process.env.REMINDER_API_KEY}`) {
    //   return NextResponse.json({ error: '未授权的访问' }, { status: 401 })
    // }

    console.log('开始处理待发送的提醒...')

    await processPendingReminders()

    console.log('提醒处理完成')

    return NextResponse.json({
      message: '提醒处理完成',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('提醒处理失败:', error)

    return NextResponse.json(
      {
        error: '提醒处理失败',
        details: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// 也支持GET请求用于测试
export async function GET(request: NextRequest) {
  try {
    console.log('GET请求：开始处理待发送的提醒...')

    await processPendingReminders()

    console.log('GET请求：提醒处理完成')

    return NextResponse.json({
      message: '提醒处理完成（GET请求）',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('GET请求提醒处理失败:', error)

    return NextResponse.json(
      {
        error: '提醒处理失败',
        details: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}