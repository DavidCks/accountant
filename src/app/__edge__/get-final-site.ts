/// <reference lib="dom" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// ---- CORS ----
function corsHeaders(req: Request) {
  const reqHeaders =
    req.headers.get("access-control-request-headers") ??
    "content-type,authorization,apikey";
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": reqHeaders,
    "access-control-max-age": "86400",
    Vary: "Origin",
  };
}
function bad(message: string, status = 400, req?: Request) {
  return new Response(message, {
    status,
    headers: { ...(req ? corsHeaders(req) : {}), "content-type": "text/plain" },
  });
}

// ---- tiny helpers ----
const MAX_HOPS = 20;
const META_RE =
  /<meta\s+http-equiv=["']?refresh["']?\s+content=["']?\s*\d+\s*;\s*url=([^"'>\s]+)["']?/i;
const JS_RE_LIST = [
  /(?:window\.)?location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/i,
  /(?:window\.)?location\.assign\(\s*['"]([^'"]+)['"]\s*\)/i,
  /(?:window\.)?location\.replace\(\s*['"]([^'"]+)['"]\s*\)/i,
  /document\.location\s*=\s*['"]([^'"]+)['"]/i,
];

type Hop = {
  url: string;
  status: number;
  location?: string;
  via?: "http" | "refresh-header" | "meta-refresh" | "js";
};
type ResolveOut = {
  ok: boolean;
  start_url: string;
  final_url?: string;
  final_status?: number;
  final_content_type?: string;
  total_hops?: number;
  meta_refresh_followed: boolean;
  hops: Hop[];
  html?: string; // only filled when format=html or include_html=1
  error?: string;
};

function absolutize(nextUrl: string, base: string) {
  try {
    return new URL(nextUrl, base).toString();
  } catch {
    return null;
  }
}

function parseRefreshHeader(v?: string | null) {
  if (!v) return null;
  // e.g. "0; url=https://…"
  const m = /url=([^;]+)/i.exec(v);
  return m ? m[1].trim() : null;
}

function pickJSRedirect(html: string): string | null {
  for (const re of JS_RE_LIST) {
    const m = re.exec(html);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

function parseSetCookies(resp: Response): string[] {
  // Multiple Set-Cookie headers may be present
  const out: string[] = [];
  // Deno runtime concatenates sometimes; iterate getSetCookie?
  // Work with get() (newline separated) and raw headers.
  const raw = resp.headers.get("set-cookie");
  if (!raw) return out;
  // split very conservatively on newline or comma followed by space + token=
  // but many CDNs send a single cookie; the below handles common cases
  const parts = raw.split(/,(?=[^;]+?=)/g);
  for (const p of parts) out.push(p.trim());
  return out;
}

function mergeCookieJar(jar: Map<string, string>, setCookies: string[]) {
  for (const sc of setCookies) {
    const [nv] = sc.split(";", 1);
    if (!nv) continue;
    const eq = nv.indexOf("=");
    if (eq <= 0) continue;
    const name = nv.slice(0, eq).trim();
    const val = nv.slice(eq + 1).trim();
    if (!name) continue;
    jar.set(name, val);
  }
}

function jarHeader(jar: Map<string, string>) {
  const arr: string[] = [];
  for (const [k, v] of jar.entries()) arr.push(`${k}=${v}`);
  return arr.join("; ");
}

Deno.serve(async (req: Request) => {
  // Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }

  // Read inputs
  let urlStr = "";
  let format: "json" | "html" = "json";
  let includeHtml = false;
  let initialReferer = "";

  if (req.method === "GET") {
    const u = new URL(req.url);
    urlStr = (u.searchParams.get("url") ?? "").toString();
    const f = (u.searchParams.get("format") ?? "").toLowerCase();
    if (f === "html") format = "html";
    includeHtml = u.searchParams.get("include_html") === "1";
    initialReferer = (u.searchParams.get("referer") ?? "").toString();
  } else if (req.method === "POST") {
    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      return bad("Expected application/json body.", 415, req);
    }
    const body = await req.json().catch(() => ({}));
    urlStr = (body.url ?? "").toString();
    const f = (body.format ?? "").toString().toLowerCase();
    if (f === "html") format = "html";
    includeHtml = Boolean(body.include_html);
    initialReferer = (body.referer ?? "").toString();
  } else {
    return bad("Method Not Allowed", 405, req);
  }

  if (!urlStr) return bad('Missing "url".', 400, req);
  let current: URL;
  try {
    current = new URL(urlStr);
  } catch {
    return bad("Invalid URL.", 400, req);
  }
  if (!/^https?:$/.test(current.protocol)) {
    return bad("Only http(s) URLs are allowed.", 400, req);
  }

  // State for following
  const hops: Hop[] = [];
  const jar = new Map<string, string>();
  let referer = initialReferer || current.origin + "/";
  let metaFollowed = false;
  let lastResp: Response | null = null;
  let lastHTML = "";
  let lastCT = "";
  let lastStatus = 0;

  for (let i = 0; i < MAX_HOPS; i++) {
    // --- request ---
    const headers: Record<string, string> = {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      "upgrade-insecure-requests": "1",
      // Some sites are picky; these hints help occasionally
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "navigate",
      "sec-fetch-user": "?1",
      "sec-fetch-dest": "document",
      referer,
    };
    const cookieHeader = jarHeader(jar);
    if (cookieHeader) headers["cookie"] = cookieHeader;

    let resp: Response;
    try {
      // manual so we can capture Location + cookies
      resp = await fetch(current.toString(), {
        method: "GET",
        headers,
        redirect: "manual",
      });
    } catch (e) {
      const out: ResolveOut = {
        ok: false,
        start_url: urlStr,
        hops,
        meta_refresh_followed: metaFollowed,
        error: String(e),
      };
      return new Response(JSON.stringify(out, null, 2), {
        status: 200,
        headers: { ...corsHeaders(req), "content-type": "application/json" },
      });
    }

    lastResp = resp;
    lastStatus = resp.status;
    lastCT = resp.headers.get("content-type") ?? "";

    // capture cookies from this response
    mergeCookieJar(jar, parseSetCookies(resp));

    // HTTP redirect?
    if (resp.status >= 300 && resp.status <= 399) {
      const loc = resp.headers.get("location") || "";
      const nextAbs = absolutize(loc, current.toString());
      hops.push({
        url: current.toString(),
        status: resp.status,
        location: nextAbs ?? loc,
        via: "http",
      });
      if (!nextAbs) break;
      referer = current.toString();
      current = new URL(nextAbs);
      continue;
    }

    // Not an HTTP redirect: record this hop
    hops.push({ url: current.toString(), status: resp.status });

    // If content-type is HTML, read body so we can look for meta/js redirects
    let html = "";
    if ((lastCT || "").includes("text/html")) {
      html = await resp.text().catch(() => "");
      lastHTML = html;

      // Header-refresh redirect
      const refreshH = resp.headers.get("refresh");
      const hdrNext = parseRefreshHeader(refreshH);
      if (hdrNext) {
        const nextAbs = absolutize(hdrNext, current.toString());
        if (nextAbs) {
          metaFollowed = true;
          hops[hops.length - 1].via = "refresh-header";
          referer = current.toString();
          current = new URL(nextAbs);
          continue;
        }
      }

      // <meta http-equiv="refresh" ...>
      const m = META_RE.exec(html);
      if (m?.[1]) {
        const nextAbs = absolutize(m[1], current.toString());
        if (nextAbs) {
          metaFollowed = true;
          hops[hops.length - 1].via = "meta-refresh";
          referer = current.toString();
          current = new URL(nextAbs);
          continue;
        }
      }

      // very simple JS redirects (string-literal only)
      const j = pickJSRedirect(html);
      if (j) {
        const nextAbs = absolutize(j, current.toString());
        if (nextAbs) {
          hops[hops.length - 1].via = "js";
          referer = current.toString();
          current = new URL(nextAbs);
          continue;
        }
      }
    } else {
      // Non-HTML: read small bodies defensively (don’t block on blobs)
      lastHTML = await resp.text().catch(() => "");
    }

    // No more redirects we can follow -> stop here
    break;
  }

  const out: ResolveOut = {
    ok: true,
    start_url: urlStr,
    final_url: lastResp ? current.toString() : undefined,
    final_status: lastStatus || undefined,
    final_content_type: lastCT || undefined,
    total_hops: hops.length,
    meta_refresh_followed: metaFollowed,
    hops,
  };

  // -------- Response modes --------
  if (format === "html") {
    // Always give the HTML so your client can parse it, even if upstream blocked with 403
    return new Response(lastHTML ?? "", {
      status: 200, // <- force 200 so client code that checks res.ok can still read body
      headers: {
        ...corsHeaders(req),
        "content-type":
          lastCT && lastCT.includes("text/html")
            ? lastCT
            : "text/html; charset=utf-8",
        "x-final-url": out.final_url ?? "",
        "x-upstream-status": String(out.final_status ?? ""),
        "x-total-hops": String(out.total_hops ?? 0),
      },
    });
  }

  if (includeHtml) out.html = lastHTML;

  return new Response(JSON.stringify(out, null, 2), {
    status: 200,
    headers: { ...corsHeaders(req), "content-type": "application/json" },
  });
});
