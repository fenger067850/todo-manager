# 🚀 Vercel 快速部署指南

## 📋 当前状态

您的 Vercel 登录流程已启动！

### 🔑 登录步骤

1. **访问授权页面**：https://vercel.com/oauth/device?user_code=NBNC-KHCJ
2. **授权代码**：`NBNC-KHCJ`
3. **完成授权**后，CLI 会自动继续

---

## 🎯 方案选择

### 推荐方案：通过 Vercel Dashboard 部署（更简单）

#### 优点
✅ 可视化界面，易于操作  
✅ 自动配置环境变量  
✅ 支持预览部署  
✅ 自动 HTTPS 和 CDN  

#### 步骤

1. **访问 Vercel**
   - 打开：https://vercel.com/new
   - 使用 GitHub 账号登录

2. **导入仓库**
   - 选择 `fenger067850/todo-manager`
   - 点击 "Import"

3. **配置项目**
   - **Project Name**: `todo-manager`（或自定义）
   - **Framework**: Next.js（自动检测）
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install --legacy-peer-deps`

4. **配置环境变量**

   点击 "Environment Variables"，添加以下变量：

   ```
   DATABASE_URL = file:./prod.db
   JWT_SECRET = i/l7WFJT3Ksp6AiVmicwNZBlwnNfk61fw6Fg0onv+k8=
   NEXTAUTH_SECRET = 409NFKta6U8eq3XRFcG3WCQqrQ+yugf7BP4uxJ80J5M=
   NEXTAUTH_URL = https://your-app.vercel.app
   ```

   ⚠️ **注意**：`NEXTAUTH_URL` 在首次部署后需要更新为实际URL

5. **开始部署**
   - 点击 "Deploy"
   - 等待 2-3 分钟完成构建

6. **部署后操作**
   - 复制部署URL（例如：`https://todo-manager-xxx.vercel.app`）
   - 在项目设置 → Environment Variables 中更新 `NEXTAUTH_URL`
   - 点击 "Redeploy" 触发重新部署

---

### 替代方案：通过 Vercel CLI 部署

如果您已完成 CLI 登录，可以使用以下命令：

```bash
# 进入项目目录
cd ~/todo-manager

# 部署项目（预览环境）
vercel

# 或直接部署到生产环境
vercel --prod
```

按照提示操作：
- `Set up and deploy`: **Yes**
- `Which scope`: 选择您的账户
- `Link to existing project`: **No**
- `What's your project's name`: **todo-manager**
- `In which directory is your code located`: **`./`**
- `Want to override the settings`: **No**

部署完成后，配置环境变量：

```bash
# 添加 JWT_SECRET
vercel env add JWT_SECRET production
# 输入: i/l7WFJT3Ksp6AiVmicwNZBlwnNfk61fw6Fg0onv+k8=

# 添加 NEXTAUTH_SECRET
vercel env add NEXTAUTH_SECRET production
# 输入: 409NFKta6U8eq3XRFcG3WCQqrQ+yugf7BP4uxJ80J5M=

# 添加 DATABASE_URL
vercel env add DATABASE_URL production
# 输入: file:./prod.db

# 添加 NEXTAUTH_URL
vercel env add NEXTAUTH_URL production
# 输入: https://todo-manager-xxx.vercel.app
```

然后重新部署：
```bash
vercel --prod
```

---

## ⚠️ 重要提示

### 1. SQLite 数据库限制

**问题**：Vercel 使用无服务器架构，文件系统是只读的。每次请求后，SQLite 数据库的更改会丢失。

**影响**：
- ❌ 用户注册/登录无法持久化
- ❌ 创建的任务会消失
- ❌ 文件上传无法保存

**解决方案**：

#### 🌟 推荐：使用 Vercel Postgres（免费套餐）

1. 在 Vercel Dashboard 项目页面
2. 选择 "Storage" → "Create Database" → "Postgres"
3. 免费配额：
   - 256 MB 存储
   - 60小时计算时间/月
   - 256 MB 数据传输

4. 数据库创建后，Vercel 会自动添加环境变量
5. 更新 `prisma/schema.prisma`：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

6. 重新生成 Prisma Client：
```bash
npx prisma generate
npx prisma db push
```

#### 其他数据库方案

**Supabase（PostgreSQL）**
- 免费套餐：500MB 数据库
- 注册：https://supabase.com
- 获取连接字符串并设置为 `DATABASE_URL`

**PlanetScale（MySQL）**
- 免费套餐：5GB 存储
- 注册：https://planetscale.com
- 需要在 Prisma schema 添加 `relationMode = "prisma"`

**Turso（LibSQL - SQLite 兼容）**
- 免费套餐：9GB 存储
- 注册：https://turso.tech
- 完全兼容 SQLite 语法

### 2. 文件上传限制

**Vercel 限制**：
- 请求体：4.5MB (Hobby)
- 文件系统：只读

**解决方案**：

使用 **Vercel Blob** 存储：

```bash
npm install @vercel/blob
```

或使用其他对象存储：
- AWS S3
- Cloudflare R2
- UploadThing

---

## ✅ 部署后检查清单

部署完成后，请测试以下功能：

- [ ] 访问首页正常加载
- [ ] 用户注册功能
- [ ] 用户登录功能
- [ ] 创建待办事项
- [ ] 四象限视图
- [ ] 月历视图
- [ ] 文件上传（注意大小限制）
- [ ] 分类管理
- [ ] 提醒功能

---

## 🔗 快速链接

- **Vercel Dashboard**: https://vercel.com/dashboard
- **项目仓库**: https://github.com/fenger067850/todo-manager
- **部署文档**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🆘 需要帮助？

如果遇到问题：

1. 查看 Vercel 部署日志
2. 检查环境变量配置
3. 参考 [DEPLOYMENT.md](./DEPLOYMENT.md) 故障排查部分
4. 在 GitHub 提交 Issue

---

**准备好部署了吗？现在就开始吧！** 🚀
