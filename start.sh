#!/bin/bash

# 凤歌-待办管理系统 本地启动脚本
# ======================================

echo "🌸 凤歌-待办管理系统 启动中..."
echo "========================================"

# 颜色定义
GREEN='\033[0;32m'
PINK='\033[0;35m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ 未检测到 Node.js，请先安装 Node.js${NC}"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js 版本: $(node --version)${NC}"

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo -e "${PINK}📦 首次运行，正在安装依赖...${NC}"
    npm install --legacy-peer-deps
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}❌ 依赖安装失败${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ 依赖安装完成${NC}"
fi

# 检查环境变量文件
if [ ! -f ".env.local" ]; then
    echo -e "${PINK}📝 创建本地配置文件...${NC}"
    cat > .env.local << 'ENVEOF'
# 数据库配置（本地 SQLite）
DATABASE_URL="file:./local.db"

# JWT 密钥（请勿修改）
JWT_SECRET="i/l7WFJT3Ksp6AiVmicwNZBlwnNfk61fw6Fg0onv+k8="
JWT_EXPIRES_IN="7d"

# Next.js 配置
NEXTAUTH_SECRET="409NFKta6U8eq3XRFcG3WCQqrQ+yugf7BP4uxJ80J5M="
NEXTAUTH_URL="http://localhost:3005"

# 文件上传配置
MAX_FILE_SIZE="10485760"
UPLOAD_DIR="./uploads"

# 端口配置
PORT="3005"
ENVEOF
    echo -e "${GREEN}✓ 配置文件已创建${NC}"
fi

# 检查数据库是否初始化
if [ ! -f "prisma/local.db" ]; then
    echo -e "${PINK}🗄️  初始化数据库...${NC}"
    npx prisma generate
    npx prisma db push
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}❌ 数据库初始化失败${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ 数据库初始化完成${NC}"
fi

# 创建上传目录
mkdir -p uploads

# 启动应用
echo ""
echo -e "${PINK}🚀 启动应用...${NC}"
echo "========================================"
echo -e "${GREEN}📱 访问地址: http://localhost:3005${NC}"
echo -e "${GREEN}💡 按 Ctrl+C 停止服务${NC}"
echo "========================================"
echo ""

# 启动开发服务器
npm run dev
