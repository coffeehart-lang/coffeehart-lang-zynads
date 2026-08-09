export async function onRequestGet() {
  return new Response(
    JSON.stringify({
      status: "ok",
      time: new Date().toISOString(),
      platform: "Cloudflare Pages Functions"
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
