# toy-wholesale-web Docker 镜像（服务器自托管，公共前台 + 内嵌 /admin）
# 构建：docker build -t colindoc/toy-wholesale-web:prod .
# 构建期固化参数（运行时环境变量不生效，全部 --build-arg 注入）：
#   NEXT_PUBLIC_BACKEND_URL  后端地址（默认生产后端）
#   NEXT_PUBLIC_SITE_ID      公共前台站点编码（默认 sintone）
#   NEXT_PUBLIC_BASE_URL     站点公开域名（sitemap/robots，默认生产域名）
# 注：不用 output:'standalone' 产物——Next 16 + Turbopack 构建在 .nft.json 追踪阶段
#     有已知故障（同 retail-admin），改跑完整 node_modules + next start。

# ---- 构建阶段 ----
FROM node:22-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_URL=http://47.82.116.234:1100
ARG NEXT_PUBLIC_SITE_ID=sintone
ARG NEXT_PUBLIC_BASE_URL=https://www.adult-toy-wholesale.com
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_SITE_ID=$NEXT_PUBLIC_SITE_ID
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# 依赖层（利用 Docker 层缓存）
COPY package.json package-lock.json ./
RUN npm ci

# 源码 + 构建
COPY . .
RUN npm run build

# ---- 运行阶段 ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public

# 容器内固定 3000（宿主映射按部署）
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
