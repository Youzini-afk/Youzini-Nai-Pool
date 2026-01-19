<!--
PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD_PAD
-->
# 安全与运维建议（中文）

## 1) 密钥与机密

- 不要把 `.env`、数据库文件、备份中包含的敏感信息提交到公开仓库
- `SECRET_KEY`、`ENCRYPTION_KEY`、`ADMIN_PASSWORD` 必须使用高强度随机值
- 多机共享 DB 时所有节点必须使用相同的 `SECRET_KEY`/`ENCRYPTION_KEY`

## 2) TLS

强烈建议在 Nginx/宝塔层启用 HTTPS。

## 3) CORS

默认 `CORS_ALLOW_ORIGINS=`（禁用 CORS）。只有在你明确需要跨域访问时才开启，并收敛到具体域名列表。

## 4) IP 日志与反代

默认不记录 IP。若你开启“记录并显示请求 IP”：
- 直连部署：保持 `TRUST_PROXY_HEADERS=false`
- 反代部署（Nginx）：设置 `TRUST_PROXY_HEADERS=true`，由 Nginx 负责写入 `X-Real-IP/X-Forwarded-For`

## 5) 防爆破与滥用

- 登录/注册启用了基础防爆破（IP 频率限制、失败锁定）
- 建议配合 WAF/Fail2ban（可选）进一步加固

## 6) 代理池

代理池仅用于线路容灾/保活，不用于规避限制。

