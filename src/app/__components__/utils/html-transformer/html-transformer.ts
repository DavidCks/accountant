// html-transformer.ts

import { ExtractedLink } from "./types";

export class HTMLTransformer {
  public static getLinks(html: string): ExtractedLink[] {
    if (typeof DOMParser === "undefined") return [];
    const doc = new DOMParser().parseFromString(html, "text/html");

    const baseHref =
      doc.querySelector<HTMLBaseElement>("base[href]")?.href ||
      doc.querySelector<HTMLLinkElement>('link[rel="canonical"][href]')?.href ||
      doc
        .querySelector<HTMLMetaElement>('meta[property="og:url"][content]')
        ?.getAttribute("content") ||
      null;

    const seen = new Set<string>();
    const out: ExtractedLink[] = [];

    const toAbsolute = (href: string): string | null => {
      try {
        if (/^https?:\/\//i.test(href)) return new URL(href).toString();
        if (baseHref) return new URL(href, baseHref).toString();
        return null;
      } catch {
        return null;
      }
    };

    doc.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((a) => {
      const raw = (a.getAttribute("href") || "").trim();
      if (
        !raw ||
        raw.startsWith("#") ||
        raw.startsWith("javascript:") ||
        raw.startsWith("mailto:") ||
        raw.startsWith("tel:") ||
        raw.startsWith("data:")
      ) {
        return;
      }

      const abs = toAbsolute(raw);
      const key = (abs || raw).toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);

      out.push({
        href: raw,
        absolute: abs || undefined,
        text: (a.textContent || "").replace(/\s+/g, " ").trim(),
        rel: a.getAttribute("rel"),
        target: a.getAttribute("target"),
      });
    });

    return out;
  }

  public static async probeIframeable(
    url: string,
    timeoutMs = 4000,
  ): Promise<boolean> {
    if (typeof window === "undefined" || typeof document === "undefined")
      return false;

    return new Promise<boolean>((resolve) => {
      const iframe = document.createElement("iframe");
      // keep it invisible and cheap
      iframe.style.position = "fixed";
      iframe.style.left = "-10000px";
      iframe.style.width = "1px";
      iframe.style.height = "1px";
      iframe.style.opacity = "0";
      iframe.setAttribute("referrerpolicy", "no-referrer");

      let done = false;
      let navigated = false;
      const cleanup = () => {
        iframe.onload = null;
        iframe.onerror = null;
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      };
      const finish = (ok: boolean) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        cleanup();
        resolve(ok);
      };

      iframe.onload = () => {
        // Ignore the initial about:blank load; count only after we set src.
        if (!navigated) return;
        finish(true);
      };
      iframe.onerror = () => finish(false);

      const timer = window.setTimeout(() => finish(false), timeoutMs);

      document.body.appendChild(iframe);
      // Navigate on next tick so the first onload (about:blank) doesn’t trick us
      Promise.resolve().then(() => {
        navigated = true;
        try {
          iframe.src = url;
        } catch {
          finish(false);
        }
      });
    });
  }

  /**
   * Returns textContent of the first `<div class="tw-mt-8">…</div>`.
   * Works in-browser (DOMParser) and on server/edge (regex + balanced div scan).
   */
  public static getRemotiveJobDescription(html: string): string {
    if (!html) return "";

    // Browser path
    if (typeof DOMParser !== "undefined") {
      try {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const el = doc.querySelector<HTMLElement>(".tw-mt-8");
        return (el?.textContent || "").replace(/\s+/g, " ").trim();
      } catch {
        // fall through to server/edge fallback
      }
    }

    // Server/Edge fallback: find the first opening tag with class containing "tw-mt-8"
    const openTagRE = /<div\b[^>]*class=(["'])[^"']*\btw-mt-8\b[^"']*\1[^>]*>/i;
    const m = openTagRE.exec(html);
    if (!m) return "";

    const start = m.index + m[0].length;

    // Walk forward to the matching closing </div>, accounting for nested <div>s
    let depth = 1;
    const tagRE = /<\/?div\b[^>]*>/gi;
    tagRE.lastIndex = start;

    let closeIndex = -1;
    for (let t: RegExpExecArray | null; (t = tagRE.exec(html)); ) {
      const isClose = /^<\/div/i.test(t[0]);
      depth += isClose ? -1 : 1;
      if (depth === 0) {
        closeIndex = t.index;
        break;
      }
    }

    const inner = html.slice(start, closeIndex > -1 ? closeIndex : html.length);

    // Strip scripts/styles, tags, decode entities, normalize whitespace
    const withoutCode = inner
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ");
    const noTags = withoutCode.replace(/<[^>]+>/g, " ");

    const decoded = HTMLTransformer.decodeEntities(noTags);
    return decoded.replace(/\s+/g, " ").trim();
  }

  /** Find the apply link by text:
   *  1) "continue applying"
   *  2) "apply for this position"
   * Returns absolute URL or "" if not found.
   */
  public static getTokyoDevApplyLink(html: string): string {
    if (!html) return "";

    const PHRASES = ["continue applying", "apply for this position"];

    const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

    const resolveBase = (doc?: Document): string | null => {
      if (doc) {
        return (
          doc.querySelector("base[href]")?.getAttribute("href") ||
          doc
            .querySelector('link[rel~="canonical"][href]')
            ?.getAttribute("href") ||
          doc
            .querySelector('meta[property="og:url"][content]')
            ?.getAttribute("content") ||
          null
        );
      }
      // server/edge: try to infer from raw html
      const m1 = html.match(/<base\b[^>]*href\s*=\s*(["'])(.*?)\1/i);
      if (m1?.[2]) return m1[2];
      const m2 =
        html.match(
          /<link\b[^>]*rel\s*=\s*(["'])[^"']*\bcanonical\b[^"']*\1[^>]*href\s*=\s*(["'])(.*?)\2/i,
        ) ||
        html.match(
          /<link\b[^>]*href\s*=\s*(["'])(.*?)\1[^>]*rel\s*=\s*(["'])[^"']*\bcanonical\b[^"']*\3/i,
        );
      if (m2?.[3]) return m2[3];
      const m3 =
        html.match(
          /<meta\b[^>]*property\s*=\s*(["'])og:url\1[^>]*content\s*=\s*(["'])(.*?)\2/i,
        ) ||
        html.match(
          /<meta\b[^>]*content\s*=\s*(["'])(.*?)\1[^>]*property\s*=\s*(["'])og:url\3/i,
        );
      if (m3?.[3]) return m3[3];
      return null;
    };

    const toAbs = (href: string, baseHref: string | null) => {
      try {
        if (!href) return "";
        if (/^[a-z][a-z0-9+.-]*:\/\//i.test(href))
          return new URL(href).toString();
        return baseHref ? new URL(href, baseHref).toString() : href;
      } catch {
        return href;
      }
    };

    // ---- Browser path ----
    if (typeof DOMParser !== "undefined") {
      try {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const baseHref = resolveBase(doc);

        for (const phrase of PHRASES) {
          const aTags = Array.from(
            doc.querySelectorAll<HTMLAnchorElement>("a"),
          );
          const hit = aTags.find((a) => norm(a.textContent || "") === phrase);
          if (hit)
            return toAbs((hit.getAttribute("href") || "").trim(), baseHref);
        }
      } catch {
        /* fall through */
      }
    }

    // ---- Server/edge fallback ----
    const baseHref = resolveBase();
    const anchorRE =
      /<a\b[^>]*href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/gi;

    // First pass: exact phrase match (normalized equality)
    for (const phrase of PHRASES) {
      anchorRE.lastIndex = 0;
      for (let m: RegExpExecArray | null; (m = anchorRE.exec(html)); ) {
        const href = (m[1] || m[2] || m[3] || "").trim();
        if (!href) continue;
        const inner = (m[4] || "")
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ");
        if (norm(inner) === phrase) {
          return toAbs(href, baseHref);
        }
      }
    }

    return "";
  }

  /**
   * Returns textContent of the first:
   *   <article class="... prose ..."> ... </article>
   * Works in-browser (DOMParser) and on server/edge (regex + balanced article scan).
   */
  public static getTokyoDevJobDescription(html: string): string {
    if (!html) return "";

    // Browser path
    if (typeof DOMParser !== "undefined") {
      try {
        const doc = new DOMParser().parseFromString(html, "text/html");
        // Any <article> that has the "prose" class (covers: prose, prose-slate, dark:prose-invert, etc.)
        const el = doc.querySelector<HTMLElement>("article.prose");
        return (el?.textContent || "").replace(/\s+/g, " ").trim();
      } catch {
        // fall through to server/edge fallback
      }
    }

    // Server/Edge fallback
    // 1) Find the first opening <article ... class="...prose...">
    const openTagRE =
      /<article\b[^>]*\bclass=(["'])[^"']*\bprose\b[^"']*\1[^>]*>/i;
    const m = openTagRE.exec(html);
    if (!m) return "";

    const start = m.index + m[0].length;

    // 2) Walk forward to the matching closing </article>, accounting for nested <article> tags
    let depth = 1;
    const tagRE = /<\/?article\b[^>]*>/gi;
    tagRE.lastIndex = start;

    let closeIndex = -1;
    for (let t: RegExpExecArray | null; (t = tagRE.exec(html)); ) {
      const isClose = /^<\/article/i.test(t[0]);
      depth += isClose ? -1 : 1;
      if (depth === 0) {
        closeIndex = t.index;
        break;
      }
    }

    const inner = html.slice(start, closeIndex > -1 ? closeIndex : html.length);

    // 3) Strip scripts/styles, comments, tags; decode entities; normalize whitespace
    const withoutCode = inner
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      // preserve simple line breaks before stripping tags
      .replace(/<(br|\/p|\/div|\/li)\b[^>]*>/gi, "\n");

    const noTags = withoutCode.replace(/<[^>]+>/g, " ");
    const decoded = HTMLTransformer.decodeEntities(noTags);
    return decoded
      .replace(/\s+\n/g, "\n")
      .replace(/[ \t]+\s*/g, " ")
      .trim();
  }

  private static decodeEntities(s: string): string {
    return s
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, n) =>
        String.fromCharCode(parseInt(n, 16)),
      );
  }
}
