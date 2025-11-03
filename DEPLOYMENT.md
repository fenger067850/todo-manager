# 🚀 Vercel 部署指南

## 部署方式一：通过 Vercel Dashboard（推荐）

### 1. 准备工作
确保您的代码已推送到 GitHub：
```bash
git add .
git commit -m "chore: 准备 Vercel 部署"
git push
```

### 2. 导入项目到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New..."** → **"Project"**
3. 从 GitHub 导入您的仓库：`fenger067850/todo-manager`
4. 点击 **"Import"**

### 3. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

#### 必需的环境变量

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `file:./prod.db` | SQLite 数据库路径 |
| `JWT_SECRET` | `生成一个32位随机字符串` | JWT 密钥 |
| `NEXTAUTH_SECRET` | `生成一个32位随机字符串` | NextAuth 密钥 |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | 应用URL（部署后获取） |

**生成随机密钥**：
```bash
# 方法1: 使用 openssl
openssl rand -base64 32

# 方法2: 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 方法3: 在线生成
# 访问 https://generate-secret.vercel.app/32
```

#### 可选的环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `MAX_FILE_SIZE` | `10485760` | 最大文件大小（10MB） |
| `UPLOAD_DIR` | `./uploads` | 文件上传目录 |
| `NODE_ENV` | `production` | 运行环境 |

### 4. 部署设置

- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install --legacy-peer-deps`

### 5. 开始部署

点击 **"Deploy"** 按钮，等待部署完成（通常需要 2-3 分钟）。

### 6. 部署后配置

1. 获取您的部署URL（例如：`https://todo-manager-xxx.vercel.app`）
2. 更新 `NEXTAUTH_URL` 环境变量为实际的部署URL
3. 在项目设置中点击 **"Redeploy"** 重新部署

---

## 部署方式二：通过 Vercel CLI

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 部署项目

```bash
cd ~/todo-manager
vercel
```

按照提示操作：
- **Set up and deploy**: Yes
- **Which scope**: 选择您的账户
- **Link to existing project**: No
- **Project name**: todo-manager
- **Directory**: ./
- **Override settings**: No

### 4. 配置环境变量

```bash
# 添加 JWT_SECRET
vercel env add JWT_SECRET production

# 添加 NEXTAUTH_SECRET
vercel env add NEXTAUTH_SECRET production

# 添加 NEXTAUTH_URL
vercel env add NEXTAUTH_URL production
```

### 5. 生产部署

```bash
vercel --prod
```

---

## 📝 重要注意事项

### 1. SQLite 数据库限制

⚠️ **重要**：Vercel 的文件系统是只读的，SQLite 数据库在无服务器环境中有限制。

**建议的解决方案**：

#### 方案 A：使用 Vercel Postgres（推荐）
```bash
# 安装 Vercel Postgres
npm install @vercel/postgres

# 更新 DATABASE_URL
DATABASE_URL="postgres://..."
```

#### 方案 B：使用 PlanetScale（MySQL）
```bash
# 更新 Prisma schema
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

#### 方案 C：使用 Supabase（PostgreSQL）
```bash
# 免费的 PostgreSQL 数据库
DATABASE_URL="postgresql://..."
```

#### 方案 D：使用 Turso（分布式 SQLite）
```bash
# LibSQL - 适合 SQLite 用户
npm install @libsql/client
```

### 2. 文件上传限制

Vercel 的无服务器函数有以下限制：
- **请求体大小**: 4.5MB (Hobby), 100MB (Pro)
- **执行时间**: 10秒 (Hobby), 60秒 (Pro)
- **文件系统**: 只读

**建议的解决方案**：
- 使用对象存储服务（如 AWS S3、Cloudflare R2、Vercel Blob）
- 限制文件大小到 4MB 以下

### 3. 环境变量管理

生产环境必需的环境变量：
```env
DATABASE_URL=          # 数据库连接
JWT_SECRET=            # JWT 密钥（32位+）
NEXTAUTH_SECRET=       # NextAuth 密钥（32位+）
NEXTAUTH_URL=          # 应用URL
```

---

## 🔍 故障排查

### 构建失败

**问题**: `npm install` 失败
**解决**: 使用 `--legacy-peer-deps` 标志
```bash
# 在 vercel.json 中配置
"installCommand": "npm install --legacy-peer-deps"
```

**问题**: Prisma 生成失败
**解决**: 确保 `postinstall` 脚本存在
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### 数据库连接错误

**问题**: SQLite 数据库无法写入
**解决**: 切换到云数据库（见上文数据库方案）

### 环境变量未生效

**问题**: 环境变量读取失败
**解决**: 
1. 检查变量名拼写
2. 确保已重新部署
3. 使用 `vercel env pull` 本地测试

---

## 📊 性能优化

### 1. 启用边缘运行时（可选）

```typescript
// src/app/layout.tsx
export const runtime = 'edge'
```

### 2. 图片优化

确保使用 Next.js Image 组件：
```typescript
import Image from 'next/image'
```

### 3. 启用 ISR（增量静态生成）

```typescript
export const revalidate = 3600 // 每小时重新验证
```

---

## 🔗 有用的链接

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Prisma 部署指南](https://www.prisma.io/docs/guides/deployment)
- [环境变量最佳实践](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ 部署检查清单

在部署前确认：

- [ ] 代码已推送到 GitHub
- [ ] 已创建 `.env.example` 文件
- [ ] 已配置 `vercel.json`
- [ ] 已生成安全的密钥
- [ ] 数据库方案已确定
- [ ] 文件上传策略已规划
- [ ] 已测试生产构建 (`npm run build`)

---

**祝您部署顺利！** 🎉

如遇问题，请查看 [Vercel 支持文档](https://vercel.com/support) 或提交 Issue。
