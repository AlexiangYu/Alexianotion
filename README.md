This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).




## Overview

类似 Notion 的笔记类工作平台


- 后端平台：Convex 简化开发流程
- 登录/身份验证：Clerk
- Zustand 状态管理：管理用户状态
- shadcn/ui 
- 图床：EdgeStore
- Editor: blocknote 基于 Prosemirror / yjs






## 页面对应的功能与路由

### 首页 `/` -> `marketing`
- 欢迎页
- 登录账号

### 文档 `/documents/:id`
- 侧边工具栏
- 文档编辑详情

### 预览发布 `/preview/:id`
- 文档静态预览








## Getting Started

First, run the Convex sever:

```bash
npx convex dev
```

And run the development server in another terminal:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.






This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
