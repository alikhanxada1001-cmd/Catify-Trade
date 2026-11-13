# Catify-Trade Cloudflare backend

This Worker is deployed separately from the Pak-Tajarat project and is bound only to the Catify-Trade resources.

## Resources
- D1: `catifytrade`
- R2: `catify-trade-assets`

## Current API routes
- `GET /api/health`
- `GET /api/products` (published products)
- `GET /api/categories`
- `POST /api/bootstrap` (one-time initial admin creation; requires email and password of at least 12 characters)
- `POST /api/login`
- `POST /api/logout`
- `GET /api/admin/products` (Bearer session required)
- `POST /api/admin/products` (Bearer session required)
- `DELETE /api/admin/products/:id` (Bearer session required)
- `POST /api/assets` (multipart field `file`, Bearer session required)
- `GET /api/assets/:key`

Admin passwords are PBKDF2-SHA256 hashed with a random salt; session tokens are stored only as SHA-256 hashes. Bootstrap is disabled once an admin exists.

## Important
The existing React app still needs its TradeContext/storage service migrated to this API before all screens are backed by D1. Do not use this backend as a reason to remove or modify any Pak-Tajarat resources.
