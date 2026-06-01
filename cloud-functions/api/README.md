# API 目录说明

本目录 (`cloud-functions/api/`) 包含了 EdgeOne Pages Cloud Functions 的 API 代理实现。

## 文件说明

### status.js

这是一个运行在 EdgeOne Pages 上的 Cloud Function，主要用于：
- 转发请求到 UptimeRobot API
- 处理 CORS（跨域）请求
- 处理错误响应

## 请求处理

1. OPTIONS 请求：返回 CORS 头部
2. POST 请求：转发到 UptimeRobot API
3. 错误处理：返回统一的错误响应

## 环境变量配置

在项目根目录的 `.env` 文件中配置：

```bash
# API 代理地址
VITE_UPTIMEROBOT_API_URL = "/api/status"  # 使用默认配置
```

## 部署说明

- 部署到腾讯云 EdgeOne Pages
- 路由 `/api/status` 由平台自动处理

请确保在部署前正确配置环境变量，以保证 API 请求能够正常工作。 