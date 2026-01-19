# Security & Operations (English)

## Secrets

- Do not commit `.env` or DB backups containing secrets into public repos
- Use strong random values for `SECRET_KEY`, `ENCRYPTION_KEY`, `ADMIN_PASSWORD`
- In multi-node, all nodes must share the same `SECRET_KEY` and `ENCRYPTION_KEY`

## TLS

Use HTTPS via Nginx/BT-Panel.

## CORS

CORS is disabled by default (`CORS_ALLOW_ORIGINS=`). Enable only if you need cross-origin access and restrict origins.

## IP logging & reverse proxy

If you enable IP logging behind Nginx, set `TRUST_PROXY_HEADERS=true`.

## Anti-bruteforce

Basic protections are enabled for login/register (rate limit + lockout).

