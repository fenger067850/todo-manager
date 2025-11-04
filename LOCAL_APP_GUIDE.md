# 🌸 凤歌-待办管理系统 本地应用使用指南

## 📦 什么是本地应用？

这是一个**完全本地运行**的待办事项管理系统，所有数据存储在您的电脑上，无需联网即可使用！

### ✨ 特点
- 🔒 **数据隐私**：所有数据存储在本地，完全私密
- 💾 **离线使用**：不需要网络连接
- 🚀 **一键启动**：双击即可运行
- 💕 **粉色主题**：温馨可爱的界面设计
- 📱 **全功能**：包含所有在线版功能

---

## 🚀 快速启动

### Windows 用户

1. **双击运行** `start.bat` 文件
2. 等待程序启动（首次运行需要安装依赖，约1-2分钟）
3. 浏览器会自动打开 http://localhost:3005
4. 开始使用！

### macOS / Linux 用户

**方式一：双击 .command 文件（推荐）**
1. 双击 `凤歌待办管理.command` 文件
2. 如果提示权限问题，右键 → "打开"
3. 浏览器自动打开应用

**方式二：使用终端**
1. 打开终端（Terminal）
2. 运行命令：
   ```bash
   cd /path/to/todo-manager
   ./start.sh
   ```
3. 访问 http://localhost:3005

---

## 📋 系统要求

### 必需
- ✅ **Node.js 18+**（必须安装）
  - 下载地址：https://nodejs.org/
  - 建议下载 LTS（长期支持）版本

### 推荐配置
- 💻 **操作系统**：Windows 10+、macOS 10.15+、Linux
- 🧠 **内存**：4GB RAM 以上
- 💾 **硬盘空间**：500MB 以上

---

## 📂 文件结构

```
todo-manager/
├── start.sh              # macOS/Linux 启动脚本
├── start.bat             # Windows 启动脚本
├── 凤歌待办管理.command   # macOS 快捷启动
├── prisma/
│   └── local.db          # 本地数据库（自动创建）
├── uploads/              # 文件上传目录
├── .env.local            # 本地配置文件（自动生成）
└── LOCAL_APP_GUIDE.md    # 本文档
```

---

## 🎯 首次使用指南

### 1. 启动应用

根据您的系统选择对应的启动方式（见上文"快速启动"）

### 2. 访问应用

启动成功后，在浏览器访问：
```
http://localhost:3005
```

### 3. 注册账号

1. 点击"注册"按钮
2. 填写用户名、邮箱、密码
3. 创建您的第一个账号

⚠️ **注意**：这是本地账号，仅存储在您的电脑上

### 4. 登录使用

使用刚才创建的账号登录，开始管理您的待办事项！

---

## 💡 功能说明

### 📝 待办事项管理
- ✅ 创建、编辑、删除任务
- 🎯 设置优先级（高、中、低）
- 📅 设置截止日期
- 🏷️ 添加分类标签
- ✔️ 标记完成状态

### 🔲 四象限视图
基于重要性和紧急性的任务分类：
- **Q1**：紧急且重要（粉色）
- **Q2**：不紧急但重要（紫色）
- **Q3**：紧急但不重要（浅粉色）
- **Q4**：不紧急且不重要（淡紫色）

### 📅 月历视图
- 查看整月任务安排
- 日期快速跳转
- 任务日期标记

### 📁 文件附件
- 每个任务可以添加文件
- 支持格式：Word、Excel、PPT、PDF、TXT
- 单文件最大：10MB
- 用户存储限制：100MB

### 🏷️ 分类管理
- 自定义分类
- 颜色标记
- 分类筛选

---

## 🔧 常见问题

### Q1: 启动失败怎么办？

**检查 Node.js 是否安装：**
```bash
node --version
```

如果显示版本号，说明已安装。如果提示"未找到命令"，请先安装 Node.js。

**Windows 下检查：**
```cmd
where node
```

### Q2: 端口 3005 被占用

编辑 `.env.local` 文件，修改端口：
```env
PORT="3006"  # 改为其他端口
```

### Q3: 依赖安装失败

**清理缓存重试：**
```bash
# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install --legacy-peer-deps
```

### Q4: 数据库错误

**重置数据库：**
```bash
# 删除数据库文件
rm prisma/local.db

# 重新初始化
npx prisma db push
```

⚠️ **警告**：这会删除所有数据！

### Q5: 找不到浏览器自动打开

手动在浏览器中访问：
```
http://localhost:3005
```

### Q6: 如何停止应用？

在启动窗口按 `Ctrl+C` 即可停止服务。

---

## 📊 数据管理

### 数据存储位置

所有数据存储在：
```
prisma/local.db
```

这是一个 SQLite 数据库文件，包含：
- 用户信息
- 所有待办事项
- 分类数据
- 提醒设置

### 备份数据

**简单备份**：
```bash
# 复制数据库文件
cp prisma/local.db prisma/local.db.backup

# 复制上传文件
cp -r uploads uploads.backup
```

**恢复数据**：
```bash
# 恢复数据库
cp prisma/local.db.backup prisma/local.db

# 恢复文件
cp -r uploads.backup uploads
```

### 导出数据

使用 Prisma Studio 查看和导出数据：
```bash
npx prisma studio
```

会在浏览器打开数据库管理界面。

---

## 🔒 安全说明

### 本地安全
- ✅ 数据仅存储在您的电脑
- ✅ 密码使用 bcrypt 加密
- ✅ JWT Token 本地生成
- ✅ 不会上传任何数据到云端

### 使用建议
- 🔐 定期备份数据
- 💾 不要删除 `.env.local` 文件
- 🚫 不要分享您的数据库文件
- 🔑 使用强密码保护账号

---

## 🎨 自定义配置

### 修改端口

编辑 `.env.local`：
```env
PORT="3006"  # 改为您想要的端口
```

### 修改文件上传限制

编辑 `.env.local`：
```env
MAX_FILE_SIZE="20971520"  # 20MB（单位：字节）
```

### 修改上传目录

编辑 `.env.local`：
```env
UPLOAD_DIR="./my-uploads"  # 自定义目录
```

---

## 🌐 网络访问（可选）

如果您想让局域网内的其他设备访问：

### 1. 查找本机 IP

**Windows：**
```cmd
ipconfig
```
查找 "IPv4 地址"

**macOS/Linux：**
```bash
ifconfig
```
查找 "inet" 地址

### 2. 修改配置

编辑 `.env.local`：
```env
NEXTAUTH_URL="http://YOUR_IP:3005"  # 替换为实际 IP
```

### 3. 访问

局域网内其他设备访问：
```
http://YOUR_IP:3005
```

⚠️ **安全提示**：不建议在公网暴露此应用！

---

## 🆙 更新应用

### 从 GitHub 获取最新代码

```bash
# 备份数据
cp prisma/local.db prisma/local.db.backup

# 拉取最新代码
git pull origin main

# 重新安装依赖
npm install --legacy-peer-deps

# 更新数据库
npx prisma generate
npx prisma db push

# 重启应用
./start.sh  # 或 start.bat
```

---

## 🗑️ 完全卸载

### 1. 备份重要数据

```bash
# 备份数据库
cp prisma/local.db ~/Desktop/todo-backup.db

# 备份上传文件
cp -r uploads ~/Desktop/uploads-backup
```

### 2. 删除应用

直接删除整个 `todo-manager` 文件夹即可。

---

## 📞 技术支持

### 遇到问题？

1. 查看终端/命令行的错误信息
2. 检查 Node.js 版本是否符合要求
3. 查看本文档的"常见问题"部分
4. 在 GitHub 提交 Issue：
   https://github.com/fenger067850/todo-manager/issues

### 功能建议

欢迎在 GitHub 提交功能建议或改进意见！

---

## 📄 许可证

本项目采用 MIT 许可证，可自由使用和修改。

---

## 🎉 开始使用

现在您已经了解了所有使用方法，快双击启动脚本，开始管理您的待办事项吧！

**启动命令回顾：**

- **Windows**：双击 `start.bat`
- **macOS**：双击 `凤歌待办管理.command`
- **Linux**：运行 `./start.sh`

祝您使用愉快！💕

---

*凤歌-待办管理系统 | 让生活更有条理* 🌸
