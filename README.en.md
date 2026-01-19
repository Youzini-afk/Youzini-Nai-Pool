# NovelAI Pool (Shared Relay / Key Pool)

A lightweight NovelAI relay service: users contribute NovelAI API keys into a shared pool; the platform computes per-user rate limits based on contribution and config, and provides health checks, load balancing, cooldown/backoff, and audit logs for upstream requests.

## Features

- Accounts: register/login, JWT auth
- Client keys: generate `np-xxxx` keys for scripts/clients (never exposes users’ NovelAI keys)
- Shared pool: upload NovelAI keys (AES-256-GCM at rest), dedup, periodic health checks, failure cooldown, round-robin selection
- Rate limiting: contribution-based RPM (auto/manual modes)
- Upstream proxy pool (optional): availability/failover only (not for bypassing restrictions)
- Usage logs: users see their own; admins can view global logs (optional IP logging)
- Multi-node HA: Nginx load balancing + Postgres shared DB + node identity header + leader-only background tasks

## Quick start (single node)

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Create `.env` from `.env.example` and set `ENCRYPTION_KEY`:

```bash
python - << 'PY'
from app.services.crypto import generate_key
print(generate_key())
PY
```

Open:
- Web UI: `http://127.0.0.1:5002/`
- `GET /healthz`
- `GET /readyz`

## API Base URL

```
http(s)://your-domain-or-ip:5002/v1/novelai
```

For scripts/clients, use the generated client API key:

```
Authorization: Bearer np-xxxx
```

See `docs/API.en.md` for endpoints and examples.

## Multi-node (shared database)

Multi-node behaviors are guarded by `MULTI_NODE_ENABLED=true` (default off).

**Important**
- All nodes must share the same `DATABASE_URL`, `SECRET_KEY`, `ENCRYPTION_KEY`
- Use Postgres for shared state (SQLite is not suitable)
- Response header `X-NovelAIPool-Node` shows which node served the request

Examples:
- Nginx sample: `deploy/nginx.multi_node.conf`
- Docker compose demo: `deploy/docker-compose.multi_node.yml` (exposes `http://127.0.0.1:8080`)

Full guide: `docs/DEPLOYMENT.en.md`.

## Security

- CORS is disabled by default (`CORS_ALLOW_ORIGINS=`). Enable only if you need cross-origin access.
- If you log client IPs behind Nginx, set `TRUST_PROXY_HEADERS=true` to trust `X-Real-IP` / `X-Forwarded-For`.
- Basic anti-bruteforce protections are enabled for login/register (see `AUTH_LOGIN_*` / `AUTH_REGISTER_*`).

See `docs/SECURITY.en.md`.

## Privacy checklist before publishing to GitHub (Important)

- Do not publish: `backend/.env`, `.env`, `backend/data/*.db*`, any log files, or reverse-proxy configs containing real domains/cert paths.
- This project creates a SQLite database at runtime (default `backend/data/novelai_pool.db`) which may contain users/keys/usage logs: make sure no `.db/.sqlite` files exist before publishing.
- Recommended: initialize with `git` and commit (so `.gitignore` applies). Avoid uploading a whole folder/zip via the GitHub web UI, which can accidentally include local databases.

## License

PolyForm Noncommercial License 1.0.0. See `LICENSE`.
