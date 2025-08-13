This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).




## Overview

类似 Notion 的笔记类工作平台：Next.js + TypeScript + Tailwind CSS 


- 后端平台：Convex 简化开发流程
- 登录/身份验证：Clerk (GitHubS授权)
- Zustand 状态管理：管理用户状态
- shadcn/ui 
- 图床：EdgeStore
- Editor: blocknote 基于 Prosemirror / yjs


编辑页面支持的功能：
- 添加 Icon/背景图
- 文中嵌入图片

文档管理：
- 子文档嵌套
- 搜索功能
- 回收站
- 发布

UI：
- 明暗模式切换
- 响应式导航栏
- 移动端适配



### 目录结构

```bash
├── app\
│   ├── (main)\
│   │   ├── _components\
│   │   ├── (routes)\
│   │   └── layout.tsx
│   ├── (marketing)\
│   │   ├── _components\
│   │   ├── favicon.ico
│   │   └── marketing\
│   ├── (public)\
│   │   └── (routes)\
│   ├── api\
│   │   └── edgestore\
│   ├── error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── preview\
│       ├── [documentId]\
│       └── layout.tsx
├── components\
│   ├── editor.tsx
│   ├── modals\
│   │   ├── confirm-modal.tsx
│   │   ├── cover-image-modal.tsx
│   │   └── settings-modal.tsx
│   ├── mode-toggle.tsx
│   ├── providers\
│   │   ├── convex-provider.tsx
│   │   ├── modal-provider.tsx
│   │   └── theme-provider.tsx
│   ├── search-command.tsx
│   ├── single-image-deopzone.tsx
│   ├── spinner.tsx
│   ├── ui\
│   └── upload\
│       ├── progress-circle.tsx
│       ├── single-image.tsx
│       └── uploader-provider.tsx
├── convex\
│   ├── README.md
│   ├── _generated\
│   │   ├── api.d.ts
│   │   ├── api.js
│   │   ├── dataModel.d.ts
│   │   ├── server.d.ts
│   │   └── server.js
│   ├── auth.config.ts
│   ├── documents.ts
│   ├── schema.ts
│   └── tsconfig.json
├── hooks\
│   ├── use-cover-images.tsx
│   ├── use-origin.tsx
│   ├── use-scroll-top.tsx
│   ├── use-search.tsx
│   └── use-settings.tsx
├── lib\
│   ├── edgestore.ts
│   └── utils.ts
├── public\
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
└── tsconfig.json
```







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


Generate static pages:

```bash
pnpm build
```



This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
