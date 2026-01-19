# NovelAI Pool（共建共享中转 / 密钥池）

仓库名：`Youzini-Nai-Pool`。

中文为默认文档；英文版见 `README.en.md`。

一个轻量的 NovelAI API 中转服务：用户贡献 NovelAI Key 加入公共池，平台按贡献与配置计算速率配额，并对上游请求做健康检查、负载均衡、冷却与审计日志。

## 主要特性

- 账号体系：注册/登录，JWT 鉴权
- 中转 Key：为用户生成 `np-xxxx`（不会暴露用户的 NovelAI Key）
- 贡献池：上传 NovelAI Key（AES-256-GCM 加密存储）、去重、健康检测、失败熔断/冷却、轮询选 Key
- 速率限制：按贡献与系统配置计算 RPM，支持自动/手动模式
- 代理池（可选）：用于线路容灾/保活（非规避限制），支持健康面板与灵敏度配置
- 使用日志：普通用户仅看自己的；管理员可看全站（可选记录 IP）
- 多机高可用：Nginx 负载均衡 + Postgres 共享数据库 + 节点标识 + Leader-only 后台任务

## 快速开始（本地/单机）

进入后端目录并创建虚拟环境：

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

生成并配置 `ENCRYPTION_KEY`：

```bash
python - << 'PY'
from app.services.crypto import generate_key
print(generate_key())
PY
```

复制环境模板并填写必要项：

- `backend/.env.example` → `backend/.env`
- 或 或 `.env.example` → `.env`（两份一致，按你的部署目录选择）

启动：

```bash
python run.py
```

打开：
- Web 管理界面：`http://127.0.0.1:5002/`
- 健康检查：`GET /healthz`
- 就绪检查：`GET /readyz`

## 使用方式（给调用方的 APIURL 怎么填）

本站中转 API 的 Base URL：

```
http(s)://你的域名或IP:5002/v1/novelai
```

认证：
- 网页端：用账号登录（JWT）
- 脚本/客户端：在网页生成 “中转 API Key（np-xxxx）”，请求头使用：

```
Authorization: Bearer np-xxxx
```

更多接口说明见：`docs/API.md`。

## 多机高可用（共享数据库）

多机行为由 `MULTI_NODE_ENABLED=true` 控制（默认关闭 / 单机模式）。

**关键点**
- 所有节点必须使用相同的：`DATABASE_URL`、`SECRET_KEY`、`ENCRYPTION_KEY`
- 共享数据库时不要使用 SQLite，推荐 Postgres（`postgresql+asyncpg://...`）
- 响应头 `X-NovelAIPool-Node` 可帮助定位请求落在哪个节点

参考配置：
- Nginx 示例：`deploy/nginx.multi_node.conf`
- Docker Compose 演示（Postgres + 2 节点 + Nginx）：`deploy/docker-compose.multi_node.yml`（对外 `http://127.0.0.1:8080`）

避免多节点重复跑定时任务：
- 建议开启 Leader-only（健康检测/代理探活只在一个节点执行），可在管理员页面配置

多机部署完整说明见：`docs/DEPLOYMENT.md`。

## 安全说明（建议必读）

- 默认关闭 CORS：`CORS_ALLOW_ORIGINS=`，只有确实需要跨域才设置
- 若你在 Nginx 反代后启用“记录并显示请求 IP”，请设置 `TRUST_PROXY_HEADERS=true`
- 登录/注册有基础防爆破（见 `AUTH_LOGIN_*`/`AUTH_REGISTER_*`）
- 管理端 `/admin/config` 已禁用敏感项（密钥、数据库、CORS 等启动期参数）在线修改

更完整安全说明见：`docs/SECURITY.md`。

## 文档索引

- `docs/DEPLOYMENT.md`：部署（Ubuntu/宝塔/Nginx/Docker/多机）
- `docs/CONFIG.md`：环境变量与配置项说明（哪些可在网页改、哪些只能 env）
- `docs/API.md`：接口与调用示例
- `docs/SECURITY.md`：安全建议与运维注意事项
- `CONTRIBUTING.md`：贡献指南（如何开发/测试/提交 PR）

## License

PolyForm Noncommercial License 1.0.0，见 `LICENSE`。







