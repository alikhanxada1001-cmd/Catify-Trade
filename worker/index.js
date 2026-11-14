const API = "/api";
const encoder = new TextEncoder();
const hex = (value) => Array.from(new Uint8Array(value)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...headers } });
const safeEqual = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
};
async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 210000, hash: "SHA-256" }, key, 256);
  return hex(bits);
}
async function tokenHash(token) { return hex(await crypto.subtle.digest("SHA-256", encoder.encode(token))); }
function validEmail(value) { return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254; }
function parseData(row) { try { return typeof row.data_json === "string" ? JSON.parse(row.data_json) : row.data_json || {}; } catch { return {}; } }

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = origin === "https://catify-trade.vercel.app" || origin === "https://catify-trade-alikhanxada1001-2695.vercel.app" ||
      /^https:\/\/catify-trade(?:-[a-z0-9-]+)?-alikhanxada1001-2695\.vercel\.app$/.test(origin) ||
      /^http:\/\/localhost:\d+$/.test(origin);
    const cors = {
      "Access-Control-Allow-Origin": allowed ? origin : "https://catify-trade-alikhanxada1001-2695.vercel.app",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    };
    const respond = (data, status = 200) => json(data, status, cors);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (origin && !allowed) return respond({ error: "Origin not allowed" }, 403);
    try {
      const url = new URL(request.url);
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts[0] !== "api") return respond({ service: "Catify-Trade API", status: "online" });
      const route = parts[1];

      if (route === "health") return respond({ ok: true, service: "catifytrade-api", timestamp: new Date().toISOString() });

      if (route === "products" && request.method === "GET") {
        const result = await env.DB.prepare("SELECT * FROM products WHERE status = 'published' ORDER BY created_at DESC").all();
        return respond({ data: (result.results || []).map((row) => ({ ...row, ...parseData(row) })) });
      }
      if (route === "categories" && request.method === "GET") {
        const result = await env.DB.prepare("SELECT * FROM categories ORDER BY name").all();
        return respond({ data: (result.results || []).map((row) => ({ ...row, ...parseData(row) })) });
      }

      if (route === "auth" && parts[2] === "status" && request.method === "GET") {
        const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM admin_users").first();
        return respond({ initialized: Number(row?.count || 0) > 0 });
      }

      if (route === "bootstrap" && request.method === "POST") {
        const body = await request.json();
        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");
        if (!validEmail(email) || password.length < 12 || password.length > 128) return respond({ error: "Enter a valid email and a password of at least 12 characters." }, 400);
        const result = await env.DB.prepare("SELECT COUNT(*) AS count FROM admin_users").first();
        if (Number(result?.count || 0) > 0) return respond({ error: "Administrator setup has already been completed." }, 409);
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const passwordHash = await hashPassword(password, salt);
        try {
          await env.DB.prepare("INSERT INTO admin_users(id,email,password_hash,role,is_active) VALUES(?,?,?,'admin',1)")
            .bind(crypto.randomUUID(), email, hex(salt) + ":" + passwordHash).run();
        } catch {
          return respond({ error: "Administrator setup could not be completed. Please retry." }, 409);
        }
        return respond({ ok: true }, 201);
      }

      if (route === "login" && request.method === "POST") {
        const body = await request.json();
        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");
        if (!validEmail(email) || !password || password.length > 128) return respond({ error: "Invalid email or password." }, 400);
        const blocked = await env.DB.prepare("SELECT COUNT(*) AS count FROM admin_login_attempts WHERE email=? AND attempted_at > datetime('now','-15 minutes') AND succeeded=0").bind(email).first();
        if (Number(blocked?.count || 0) >= 8) return respond({ error: "Too many sign-in attempts. Please wait 15 minutes and try again." }, 429);
        const user = await env.DB.prepare("SELECT * FROM admin_users WHERE email=? AND is_active=1").bind(email).first();
        let valid = false;
        if (user?.password_hash?.includes(":")) {
          const [saltHex, expected] = user.password_hash.split(":");
          const salt = new Uint8Array((saltHex.match(/.{2}/g) || []).map((part) => parseInt(part, 16)));
          valid = safeEqual(await hashPassword(password, salt), expected);
        }
        await env.DB.prepare("INSERT INTO admin_login_attempts(id,email,succeeded) VALUES(?,?,?)").bind(crypto.randomUUID(), email, valid ? 1 : 0).run();
        if (!valid) return respond({ error: "Invalid email or password." }, 401);
        const token = crypto.randomUUID() + crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
        await env.DB.prepare("INSERT INTO admin_sessions(id,admin_user_id,token_hash,expires_at) VALUES(?,?,?,?)")
          .bind(crypto.randomUUID(), user.id, await tokenHash(token), expiresAt).run();
        return respond({ token, expiresAt, user: { email: user.email, role: user.role } });
      }

      const authenticate = async () => {
        const token = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
        if (!token || token.length > 200) return null;
        return env.DB.prepare("SELECT u.id,u.email,u.role FROM admin_sessions s JOIN admin_users u ON u.id=s.admin_user_id WHERE s.token_hash=? AND s.expires_at>? AND u.is_active=1")
          .bind(await tokenHash(token), new Date().toISOString()).first();
      };

      if (route === "logout" && request.method === "POST") {
        const token = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
        if (token) await env.DB.prepare("DELETE FROM admin_sessions WHERE token_hash=?").bind(await tokenHash(token)).run();
        return respond({ ok: true });
      }

      if (route === "admin") {
        const admin = await authenticate();
        if (!admin) return respond({ error: "Your session has expired. Please sign in again." }, 401);
        const resource = parts[2];

        if (resource === "products" && request.method === "GET") {
          const result = await env.DB.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
          return respond({ data: (result.results || []).map((row) => ({ ...row, ...parseData(row) })) });
        }
        if (resource === "products" && request.method === "POST") {
          const body = await request.json();
          if (!body.title || !String(body.title).trim() || !body.id) return respond({ error: "Product title and ID are required." }, 400);
          const title = String(body.title).trim().slice(0, 200);
          const status = ["published", "draft", "archived"].includes(body.status) ? body.status : "draft";
          const payload = { ...body, title, status };
          const categoryId = body.category_id || null;
          try {
            await env.DB.prepare("INSERT INTO products(id,sku,slug,title,category_id,supplier_id,status,price_usd,stock_quantity,image_key,data_json) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET sku=excluded.sku,slug=excluded.slug,title=excluded.title,category_id=excluded.category_id,supplier_id=excluded.supplier_id,status=excluded.status,price_usd=excluded.price_usd,stock_quantity=excluded.stock_quantity,image_key=excluded.image_key,data_json=excluded.data_json,updated_at=CURRENT_TIMESTAMP")
              .bind(String(body.id), body.sku || null, body.slug || null, title, categoryId, body.supplier_id || null, status, Number(body.price_usd || body.salePriceUSD || body.regularPriceUSD || 0), Math.max(0, Number(body.stock_quantity ?? body.stock ?? 0)), body.image_key || null, JSON.stringify(payload)).run();
          } catch (error) {
            if (String(error.message || "").includes("UNIQUE")) return respond({ error: "A product with this SKU or URL slug already exists." }, 409);
            throw error;
          }
          await env.DB.prepare("INSERT INTO admin_activity_logs(id,admin_email,action,target,details) VALUES(?,?,?,?,?)")
            .bind(crypto.randomUUID(), admin.email, "PRODUCT_SAVED", String(body.id), "Saved product " + title).run();
          return respond({ ok: true, id: body.id });
        }
        if (resource === "products" && parts[3] && request.method === "DELETE") {
          await env.DB.prepare("DELETE FROM products WHERE id=?").bind(parts[3]).run();
          await env.DB.prepare("INSERT INTO admin_activity_logs(id,admin_email,action,target,details) VALUES(?,?,?,?,?)")
            .bind(crypto.randomUUID(), admin.email, "PRODUCT_DELETED", parts[3], "Deleted product " + parts[3]).run();
          return respond({ ok: true });
        }
        if (resource === "rfqs" && request.method === "GET") {
          const result = await env.DB.prepare("SELECT * FROM rfqs ORDER BY created_at DESC").all();
          return respond({ data: (result.results || []).map((row) => ({ ...row, ...parseData(row) })) });
        }
        if (resource === "rfqs" && parts[3] && request.method === "PATCH") {
          const body = await request.json();
          const current = await env.DB.prepare("SELECT data_json FROM rfqs WHERE id=?").bind(parts[3]).first();
          if (!current) return respond({ error: "RFQ not found." }, 404);
          const payload = { ...parseData(current), ...body };
          await env.DB.prepare("UPDATE rfqs SET status=?,data_json=?,updated_at=CURRENT_TIMESTAMP WHERE id=?")
            .bind(payload.status || "pending", JSON.stringify(payload), parts[3]).run();
          return respond({ ok: true });
        }
        if (resource === "inquiries" && request.method === "GET") {
          const result = await env.DB.prepare("SELECT * FROM trade_inquiries ORDER BY created_at DESC").all();
          return respond({ data: (result.results || []).map((row) => ({ ...row, ...parseData(row) })) });
        }
        if (resource === "inquiries" && parts[3] && request.method === "PATCH") {
          const body = await request.json();
          const current = await env.DB.prepare("SELECT data_json FROM trade_inquiries WHERE id=?").bind(parts[3]).first();
          if (!current) return respond({ error: "Inquiry not found." }, 404);
          const payload = { ...parseData(current), ...body };
          await env.DB.prepare("UPDATE trade_inquiries SET status=?,data_json=? WHERE id=?")
            .bind(payload.status || "new", JSON.stringify(payload), parts[3]).run();
          return respond({ ok: true });
        }
      }

      if (route === "inquiries" && request.method === "POST") {
        const body = await request.json();
        if (!body.contactPerson || !validEmail(body.email) || !body.cargoDetails || String(body.cargoDetails).trim().length < 10) {
          return respond({ error: "Please provide your name, a valid email address and a message of at least 10 characters." }, 400);
        }
        const id = crypto.randomUUID();
        const payload = { ...body, id, createdAt: new Date().toISOString(), status: "new" };
        await env.DB.prepare("INSERT INTO trade_inquiries(id,company_name,email,status,data_json) VALUES(?,?,?,'new',?)")
          .bind(id, String(body.companyName || "").slice(0, 180), String(body.email).trim().toLowerCase(), JSON.stringify(payload)).run();
        return respond({ ok: true, id, data: payload }, 201);
      }

      if (route === "rfqs" && request.method === "POST") {
        const body = await request.json();
        if (!body.buyerName || !validEmail(body.buyerEmail) || !body.productTitle || !Number.isFinite(Number(body.quantity)) || Number(body.quantity) < 1) return respond({ error: "Please provide a product, valid email, contact name, and quantity." }, 400);
        const id = crypto.randomUUID();
        const rfqNumber = "CT-RFQ-" + new Date().getFullYear() + "-" + crypto.randomUUID().slice(0, 6).toUpperCase();
        const payload = { ...body, id, rfqNumber, createdAt: new Date().toISOString(), status: "pending" };
        await env.DB.prepare("INSERT INTO rfqs(id,rfq_number,buyer_email,status,product_id,data_json) VALUES(?,?,?,'pending',?,?)")
          .bind(id, rfqNumber, String(body.buyerEmail).toLowerCase(), body.productId || null, JSON.stringify(payload)).run();
        return respond({ data: payload }, 201);
      }

      if (route === "assets" && parts[2] && request.method === "GET") {
        const object = await env.ASSETS.get(parts.slice(2).join("/"));
        if (!object) return respond({ error: "Image not found." }, 404);
        const headers = new Headers(cors);
        object.writeHttpMetadata(headers);
        headers.set("ETag", object.httpEtag);
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
        return new Response(object.body, { headers });
      }
      if (route === "assets" && request.method === "POST") {
        if (!await authenticate()) return respond({ error: "Your session has expired. Please sign in again." }, 401);
        const form = await request.formData();
        const file = form.get("file");
        if (!file || typeof file === "string") return respond({ error: "Choose an image to upload." }, 400);
        if (!file.type?.startsWith("image/")) return respond({ error: "Only image files are allowed." }, 415);
        if (file.size > 8 * 1024 * 1024) return respond({ error: "Image must be 8 MB or smaller." }, 413);
        const extension = (file.name.split(".").pop() || "img").replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 8);
        const key = crypto.randomUUID() + "." + (extension || "img");
        await env.ASSETS.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
        return respond({ ok: true, key, url: API + "/assets/" + key }, 201);
      }

      return respond({ error: "Endpoint not found." }, 404);
    } catch (error) {
      console.error("Catify-Trade API request failed", { message: error?.message, path: new URL(request.url).pathname });
      return respond({ error: "Something went wrong. Please try again shortly." }, 500);
    }
  }
};