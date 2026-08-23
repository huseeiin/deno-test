// main.ts
Deno.serve((req: Request) => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    return new Response("Hello from Deno Deploy! 🦕", {
      headers: { "content-type": "text/plain" },
    });
  }

  if (url.pathname === "/api/time") {
    return Response.json({ now: new Date().toISOString() });
  }

  return new Response("Not Found", { status: 404 });
});