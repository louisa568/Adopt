# 暖爪领养（Web）

React + Tailwind CSS + Supabase 的移动端优先 MVP。

## 1) 本地启动

```bash
npm install
npm run dev
```

## 2) Supabase 配置

1. 复制环境变量模板（推荐写入 `.env.local`，避免误提交）：

```bash
cp .env.example .env.local
```

2. 在 `.env.local` 中填入：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

> 注意：前端只能使用 **anon public key**。  
> `sb_secret_*` 这类密钥属于高权限密钥，不应放到前端代码或 `.env` 前端变量中。

## 3) 初始化数据库

在 Supabase 的 SQL Editor 里执行：

`supabase/schema.sql`

该脚本会创建并初始化以下表：

- `users`
- `pets`
- `applications`
- `messages`
- `revisit_logs`

并写入一批基础示例数据。

## 4) 当前数据流

应用已将原先写死的 Mock 主流程替换为 Supabase 实时读写：

- 登录/注册（手机号）
- 用户资料/实名认证状态
- 首页宠物信息流
- 发布宠物
- 领养申请
- 消息会话
- 云回访记录
