# 🚀 快速部署指南

## 📦 编译打包（本地）

### 强制编译脚本（推荐）
```bash
# 修复了部署问题的版本
./build-force.sh
```

**输出**: `build-temp/todo-manager-*.zip` (约 7.6M)

**包含文件**：
- ✅ `.next/` - Next.js 编译产物
- ✅ `src/` - 应用源码（必需）
- ✅ `public/` - 静态资源
- ✅ `prisma/` - 数据库配置
- ✅ `package.json` - 项目配置
- ✅ 配置文件 - next.config.js, tsconfig.json

### PowerShell 版本（Windows）
```powershell
.\build-package.ps1
```

## 🚀 服务器部署

### 一键部署（推荐）
```bash
# 上传新的部署包
scp build-temp/todo-manager-*.zip user@server:/tmp/

# 自动部署
sudo ./deploy-built.sh
```

### 手动部署
```bash
# 1. 清理旧版本
sudo rm -rf /var/www/todo-manager

# 2. 解压新版本
sudo mkdir -p /var/www/todo-manager
sudo unzip /tmp/todo-manager-*.zip -d /var/www/todo-manager/

# 3. 设置权限
sudo chown -R www-data:www-data /var/www/todo-manager
sudo chmod -R 755 /var/www/todo-manager

# 4. 配置环境
cd /var/www/todo-manager
sudo nano .env.production

# 5. 启动应用
./start.sh
```

## 🆘 部署问题修复

### 如果遇到 "找不到 app 目录" 错误：

```bash
# 检查文件结构
cd /var/www/todo-manager
ls -la src/app/

# 如果缺少文件，重新上传部署包
```

### 详细修复指南：
查看 `FIX_DEPLOY.md` 文件

## 📋 环境配置

编辑 `.env.production`：
```env
DATABASE_URL="file:./production.db"
JWT_SECRET="your-super-secret-jwt-key-32-chars-minimum"
NEXTAUTH_SECRET="your-nextauth-secret-32-chars-minimum"
NEXTAUTH_URL="http://your-domain.com"
NODE_ENV="production"
```

## 🛠️ 管理命令

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs todo-manager

# 重启应用
pm2 restart todo-manager

# 停止应用
pm2 stop todo-manager
```

## 📋 部署包结构

```
/var/www/todo-manager/
├── .next/              # 编译产物
├── src/                # 源码（必需）
├── public/             # 静态文件
├── prisma/             # 数据库配置
├── package.json        # 项目配置
├── ecosystem.config.js # PM2 配置
└── start.sh           # 启动脚本
```

## 💡 重要提示

1. **源码必需** - Next.js 生产模式仍需要源码文件
2. **使用修复版本** - `build-force.sh` 包含所有必要文件
3. **检查权限** - 确保文件权限正确
4. **验证文件** - 部署前检查关键文件是否存在

## 🎯 快速部署流程

```bash
# 1. 本地编译
./build-force.sh

# 2. 上传到服务器
scp build-temp/todo-manager-*.zip user@server:/tmp/

# 3. 服务器部署
sudo ./deploy-built.sh

# 4. 验证部署
curl http://your-domain.com
```

**推荐使用修复后的 `build-force.sh`，确保部署成功！** 🚀