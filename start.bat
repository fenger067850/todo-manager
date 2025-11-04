@echo off
chcp 65001 >nul
title 凤歌-待办管理系统

echo.
echo ========================================
echo 🌸 凤歌-待办管理系统 启动中...
echo ========================================
echo.

:: 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js 已安装
node --version

:: 切换到脚本所在目录
cd /d "%~dp0"

:: 检查依赖是否安装
if not exist "node_modules" (
    echo.
    echo 📦 首次运行，正在安装依赖...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✓ 依赖安装完成
)

:: 检查环境变量文件
if not exist ".env.local" (
    echo.
    echo 📝 创建本地配置文件...
    (
        echo # 数据库配置（本地 SQLite）
        echo DATABASE_URL="file:./local.db"
        echo.
        echo # JWT 密钥（请勿修改）
        echo JWT_SECRET="i/l7WFJT3Ksp6AiVmicwNZBlwnNfk61fw6Fg0onv+k8="
        echo JWT_EXPIRES_IN="7d"
        echo.
        echo # Next.js 配置
        echo NEXTAUTH_SECRET="409NFKta6U8eq3XRFcG3WCQqrQ+yugf7BP4uxJ80J5M="
        echo NEXTAUTH_URL="http://localhost:3005"
        echo.
        echo # 文件上传配置
        echo MAX_FILE_SIZE="10485760"
        echo UPLOAD_DIR="./uploads"
        echo.
        echo # 端口配置
        echo PORT="3005"
    ) > .env.local
    echo ✓ 配置文件已创建
)

:: 检查数据库是否初始化
if not exist "prisma\local.db" (
    echo.
    echo 🗄️  初始化数据库...
    call npx prisma generate
    call npx prisma db push
    if %errorlevel% neq 0 (
        echo ❌ 数据库初始化失败
        pause
        exit /b 1
    )
    echo ✓ 数据库初始化完成
)

:: 创建上传目录
if not exist "uploads" mkdir uploads

:: 启动应用
echo.
echo ========================================
echo 🚀 启动应用...
echo ========================================
echo 📱 访问地址: http://localhost:3005
echo 💡 按 Ctrl+C 停止服务
echo ========================================
echo.

:: 启动开发服务器
call npm run dev

pause
