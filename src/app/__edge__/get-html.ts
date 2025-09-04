/// <reference lib="dom" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
function cors() {
  return {
    "access-control-allow-origin": "*",
  };
}
Deno.serve(async (req) => {
  // Minimal CORS for preflight (some browsers may still send OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...cors(),
        "access-control-allow-methods": "GET,OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
      },
    });
  }
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        ...cors(),
        allow: "GET,OPTIONS",
      },
    });
  }
  const u = new URL(req.url);
  const rawUrl = u.searchParams.get("url");
  if (!rawUrl) {
    return new Response('Missing query param "url".', {
      status: 400,
      headers: cors(),
    });
  }
  let target;
  try {
    target = new URL(rawUrl);
  } catch {
    return new Response("Invalid URL.", {
      status: 400,
      headers: cors(),
    });
  }
  // Fetch upstream (follow redirects)
  const upstream = await fetch(target.toString(), {
    redirect: "follow",
  });
  const html = await upstream.text();
  // Return the HTML verbatim
  return new Response(html, {
    status: upstream.ok ? 200 : upstream.status,
    headers: {
      ...cors(),
      "content-type": "text/html; charset=utf-8",
    },
  });
});
