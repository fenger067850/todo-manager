import { prisma } from './prisma'

export interface ReminderNotification {
  id: string
  todoId: string
  todoTitle: string
  todoDescription: string | null
  remindAt: Date
  message: string | null
  userId: string
  userEmail: string
  userName: string
  category: {
    name: string
    color: string | null
  } | null
}

/**
 * 获取需要发送提醒的任务
 */
export async function getPendingReminders(): Promise<ReminderNotification[]> {
  const now = new Date()

  const reminders = await prisma.reminder.findMany({
    where: {
      isActive: true,
      remindAt: {
        lte: now, // 小于等于当前时间
      },
      todo: {
        isCompleted: false, // 任务未完成
      },
    },
    include: {
      todo: {
        include: {
          category: true,
          user: true,
        },
      },
    },
  })

  return reminders.map(reminder => ({
    id: reminder.id,
    todoId: reminder.todo.id,
    todoTitle: reminder.todo.title,
    todoDescription: reminder.todo.description,
    remindAt: reminder.remindAt,
    message: reminder.message,
    userId: reminder.todo.userId,
    userEmail: reminder.todo.user.email,
    userName: reminder.todo.user.name || reminder.todo.user.username,
    category: reminder.todo.category ? {
      name: reminder.todo.category.name,
      color: reminder.todo.category.color,
    } : null,
  }))
}

/**
 * 标记提醒为已处理（可以设置为不活跃或删除）
 */
export async function markReminderAsProcessed(reminderId: string): Promise<void> {
  await prisma.reminder.update({
    where: { id: reminderId },
    data: { isActive: false },
  })
}

/**
 * 发送提醒通知（这里预留接口，可以根据需要实现不同的通知方式）
 */
export async function sendReminderNotification(reminder: ReminderNotification): Promise<void> {
  console.log('发送提醒通知:', {
    id: reminder.id,
    todoTitle: reminder.todoTitle,
    userName: reminder.userName,
    userEmail: reminder.userEmail,
    remindAt: reminder.remindAt,
  })

  // 这里可以实现不同的通知方式：

  // 1. 浏览器推送通知（需要客户端支持）
  // 2. 邮件通知（需要配置邮件服务）
  // 3. 短信通知（需要配置短信服务）
  // 4. 微信/钉钉等企业通知
  // 5. WebSocket 实时通知

  // 示例：邮件通知（需要配置nodemailer等邮件服务）
  // await sendEmailNotification(reminder)

  // 示例：浏览器推送通知
  // await sendPushNotification(reminder)

  // 目前先记录日志，作为占位符
  try {
    // 在实际项目中，这里会调用相应的通知服务
    await markReminderAsProcessed(reminder.id)
  } catch (error) {
    console.error('发送提醒通知失败:', error)
    throw error
  }
}

/**
 * 批量处理待发送的提醒
 */
export async function processPendingReminders(): Promise<void> {
  try {
    const pendingReminders = await getPendingReminders()

    console.log(`发现 ${pendingReminders.length} 个待处理的提醒`)

    for (const reminder of pendingReminders) {
      try {
        await sendReminderNotification(reminder)
      } catch (error) {
        console.error(`处理提醒 ${reminder.id} 失败:`, error)
        // 继续处理其他提醒
      }
    }
  } catch (error) {
    console.error('批量处理提醒失败:', error)
    throw error
  }
}

/**
 * 创建定时任务处理器（可以配合cron job或类似工具使用）
 */
export function setupReminderProcessor(): void {
  // 这个函数可以在服务器启动时调用
  // 配合 cron job 或者 node-cron 等库定期执行

  console.log('提醒服务已启动')

  // 示例：使用 node-cron 每分钟检查一次
  // import * as cron from 'node-cron'
  // cron.schedule('* * * * *', async () => {
  //   await processPendingReminders()
  // })
}

/**
 * 为用户创建默认提醒（在创建任务时调用）
 */
export async function createDefaultReminders(todoId: string, dueDate: Date | null): Promise<void> {
  if (!dueDate) return

  const now = new Date()
  const dueDateTime = new Date(dueDate)

  // 如果截止时间已过，不创建提醒
  if (dueDateTime <= now) return

  const reminders = []

  // 1. 截止前1小时提醒
  const oneHourBefore = new Date(dueDateTime.getTime() - 60 * 60 * 1000)
  if (oneHourBefore > now) {
    reminders.push({
      todoId,
      remindAt: oneHourBefore,
      message: '任务即将到期，请及时处理',
    })
  }

  // 2. 截止前1天提醒
  const oneDayBefore = new Date(dueDateTime.getTime() - 24 * 60 * 60 * 1000)
  if (oneDayBefore > now) {
    reminders.push({
      todoId,
      remindAt: oneDayBefore,
      message: '任务明天就要到期了',
    })
  }

  // 3. 截止前3天提醒（如果还有足够时间）
  const threeDaysBefore = new Date(dueDateTime.getTime() - 3 * 24 * 60 * 60 * 1000)
  if (threeDaysBefore > now) {
    reminders.push({
      todoId,
      remindAt: threeDaysBefore,
      message: '任务还有3天就要到期了',
    })
  }

  // 批量创建提醒
  if (reminders.length > 0) {
    await prisma.reminder.createMany({
      data: reminders,
    })
  }
}