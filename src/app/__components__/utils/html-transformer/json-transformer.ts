// json-transformer.ts
import { ExtractedLink } from "./types";

export class JSONTransformer {
  private static urlKeys = ["url", "href", "link", "redirect_url"];
  private static titleKeys = ["title", "name", "position", "job_title", "role"];

  public static getLinks(json: string): ExtractedLink[] {
    const out: ExtractedLink[] = [];
    const seen = new Set<string>();

    const add = (hrefRaw: unknown, titleRaw?: unknown) => {
      if (typeof hrefRaw !== "string") return;
      const href = hrefRaw.trim();
      if (!/^https?:\/\//i.test(href)) return; // keep absolute http(s) only
      const key = href.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);

      const text =
        typeof titleRaw === "string" && titleRaw.trim()
          ? titleRaw.trim()
          : href;

      out.push({
        href,
        absolute: href,
        text,
        rel: null,
        target: null,
      });
    };

    // 1) Prefer real JSON parsing + tree walk
    try {
      const root = JSON.parse(json);

      const walk = (node: unknown) => {
        if (node == null) return;

        if (Array.isArray(node)) {
          for (const item of node) walk(item);
          return;
        }

        if (typeof node === "object") {
          const obj = node as Record<string, unknown>;

          let urlValue: unknown;
          for (const k of JSONTransformer.urlKeys) {
            if (typeof obj[k] === "string") {
              urlValue = obj[k];
              break;
            }
          }

          let titleValue: unknown;
          for (const k of JSONTransformer.titleKeys) {
            if (typeof obj[k] === "string") {
              titleValue = obj[k];
              break;
            }
          }

          if (urlValue) add(urlValue, titleValue);

          for (const v of Object.values(obj)) walk(v);
        }
      };

      walk(root);
      if (out.length) return out;
    } catch {
      // ignore and try regex fallback
    }

    // 2) Regex fallback: find small objects that contain both a url-like key and a title-like key (any order)
    try {
      const pairRe =
        /{[^{}]*?(?:"url"\s*:\s*"([^"]+)"[^{}]*?"(?:title|name|position|job_title|role)"\s*:\s*"([^"]+)"|"(?:title|name|position|job_title|role)"\s*:\s*"([^"]+)"[^{}]*?"url"\s*:\s*"([^"]+)")[^{}]*?}/gis;

      let m: RegExpExecArray | null;
      while ((m = pairRe.exec(json))) {
        const href = m[1] || m[4];
        const title = m[2] || m[3];
        add(href, title);
      }
      if (out.length) return out;
    } catch {
      // continue to last resort
    }

    // 3) Last resort: grab any http(s) URL and use it as both href and text
    const urlRe = /https?:\/\/[^\s"'}]+/gi;
    let um: RegExpExecArray | null;
    while ((um = urlRe.exec(json))) add(um[0]);

    return out;
  }
}
