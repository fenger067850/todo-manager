# 部署指南

本文档提供待办事项管理系统的详细部署指南，涵盖不同部署场景和最佳实践。

## 📋 部署前检查清单

### 代码质量检查 ✅
- [ ] 代码审查完成，无严重安全问题
- [ ] TypeScript编译无错误
- [ ] ESLint检查通过
- [ ] 所有功能测试正常

### 环境配置 ✅
- [ ] 生产环境变量配置完成
- [ ] 数据库连接测试通过
- [ ] SSL证书配置完成
- [ ] 域名DNS解析正确

### 安全检查 ✅
- [ ] JWT密钥已更改为强密码
- [ ] 数据库密码符合安全要求
- [ ] 环境变量不包含敏感信息
- [ ] HTTPS证书有效

## 🔧 环境配置

### 生产环境变量
创建 `.env.production` 文件：

```env
# 数据库配置（SQLite数据库）
DATABASE_URL="file:./production.db"

# JWT配置
JWT_SECRET="your-super-secure-jwt-secret-key-32-chars-minimum"
JWT_EXPIRES_IN="7d"

# Next.js配置
NEXTAUTH_SECRET="your-nextauth-secret-key-32-chars-minimum"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"

# 可选配置
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10485760"  # 10MB
LOG_LEVEL="info"
```

### 安全配置注意事项
1. **JWT_SECRET**: 使用至少32字符的强随机字符串
2. **SQLite数据库**: 确保数据库文件权限正确，定期备份
3. **文件权限**: 确保上传目录权限正确设置
4. **HTTPS**: 生产环境必须使用HTTPS

## 🚀 部署方案

### 方案一：Vercel部署（推荐）

#### 优势
- 零配置部署
- 自动HTTPS
- 全球CDN加速
- 自动扩展

#### 步骤
1. **准备GitHub仓库**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **连接Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账号登录
   - 导入项目仓库

3. **配置环境变量**
   - 在Vercel项目设置中添加生产环境变量
   - 确保变量名称与代码中的环境变量一致

4. **部署**
   - Vercel会自动检测Next.js项目
   - 点击"Deploy"按钮开始部署

#### Vercel配置文件
创建 `vercel.json`：
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 方案二：传统服务器部署

#### 系统要求
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+
- **Node.js**: 18.0+
- **数据库**: SQLite（内置，无需额外安装）
- **内存**: 最少1GB RAM
- **存储**: 最少10GB可用空间

#### 安装步骤

1. **安装Node.js**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # CentOS/RHEL
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs npm
   ```

2. **初始化SQLite数据库**
   ```bash
   # SQLite是文件数据库，无需额外安装
   # 数据库文件会在首次运行时自动创建
   ```

3. **克隆和构建项目**
   ```bash
   git clone https://github.com/yourusername/todo-manager.git
   cd todo-manager
   npm install
   npm run build
   ```

4. **配置环境变量**
   ```bash
   sudo nano .env.production
   # 添加生产环境变量
   ```

5. **使用PM2管理进程**
   ```bash
   npm install -g pm2
   pm2 start npm --name "todo-app" -- start
   pm2 startup
   pm2 save
   ```

#### Nginx配置示例
创建 `/etc/nginx/sites-available/todo-manager`：
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/attachments {
        client_max_body_size 10M;
        proxy_pass http://localhost:3000;
    }
}
```

### 方案三：Docker部署

#### 创建Dockerfile
```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 生产镜像
FROM node:18-alpine AS runner

WORKDIR /app

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 创建上传目录
RUN mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 创建docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./production.db
      - JWT_SECRET=your-super-secret-jwt-key-32-chars-minimum
    volumes:
      - ./uploads:/app/uploads
      - ./production.db:/app/production.db
    restart: unless-stopped

volumes:
  uploads:
```

#### Docker部署命令
```bash
# 构建和启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f app

# 停止服务
docker-compose down
```

## 🔍 部署验证

### 功能测试清单
- [ ] 用户注册和登录功能
- [ ] 任务创建、编辑、删除
- [ ] 四象限功能
- [ ] 月历视图
- [ ] 附件上传下载
- [ ] 分类管理
- [ ] 响应式设计（移动端测试）

### 性能测试
- [ ] 页面加载速度
- [ ] API响应时间
- [ ] 数据库查询性能
- [ ] 文件上传下载速度

### 安全测试
- [ ] SQL注入防护
- [ ] XSS攻击防护
- [ ] 文件上传安全
- [ ] 认证授权机制

## 🔧 生产优化

### 数据库优化
SQLite数据库会自动创建基本索引。如需手动优化：
```bash
# 在开发环境中运行以下命令重新生成数据库
npx prisma db push
```

### 缓存策略
```typescript
// API缓存配置
export const revalidate = 60; // 60秒缓存

// 页面缓存
export const dynamic = 'force-dynamic';
```

### 监控配置
```javascript
// 错误监控
// 可以集成Sentry等监控服务
const errorHandler = (error) => {
  console.error('应用错误:', error);
  // 发送错误到监控服务
};
```

## 🛠️ 故障排除

### 常见部署问题

#### 1. 数据库连接失败
**症状**: 应用启动时数据库连接错误
**解决方案**:
- 检查数据库服务状态
- 验证数据库URL配置
- 确认数据库用户权限

#### 2. 文件上传失败
**症状**: 上传附件时出现权限错误
**解决方案**:
- 检查上传目录权限
- 确认磁盘空间充足
- 验证文件大小限制

#### 3. 内存不足
**症状**: 应用频繁重启或崩溃
**解决方案**:
- 增加服务器内存
- 优化数据库查询
- 启用内存监控

#### 4. SSL证书问题
**症状**: HTTPS访问失败
**解决方案**:
- 检查证书有效期
- 验证证书路径配置
- 确认域名解析正确

### 日志分析
```bash
# PM2日志
pm2 logs todo-app

# Nginx日志
sudo tail -f /var/log/nginx/error.log

# 应用日志
sudo journalctl -u todo-app
```

## 📊 监控和维护

### 监控指标
- **性能指标**: 响应时间、吞吐量、错误率
- **资源指标**: CPU使用率、内存使用率、磁盘空间
- **业务指标**: 用户活跃度、任务完成率、附件使用量

### 备份策略
- **数据库备份**: 每日自动备份
- **文件备份**: 定期备份上传的附件
- **配置备份**: 备份环境变量和配置文件

### 更新部署
```bash
# 代码更新
git pull origin main
npm install
npm run build
pm2 restart todo-app

# 数据库迁移
npx prisma db deploy
```

## 📞 技术支持

部署过程中如遇到问题，请：

1. 查看本文档的故障排除部分
2. 检查GitHub Issues
3. 搜索相关技术文档
4. 寻求技术社区帮助

---

**最后更新**: 2025年11月1日