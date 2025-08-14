const cache = new Map<
  string,
  {
    body: ArrayBuffer;
    headers: Headers;
  }
>();

export async function GET({ params }: { params: { path: string } }) {
  if (cache.has(params.path)) {
    return new Response(cache.get(params.path)!.body, {
      headers: cache.get(params.path)!.headers,
    });
  }
  const res = await fetch(
    `https://static.wikia.nocookie.net/armoredwarfare_gamepedia/${params.path}`,
    { headers: { referer: "https://armoredwarfare.fandom.com/" } },
  );
  if (res.status === 404) return new Response(null, { status: 404 });
  const buffer = await res.arrayBuffer();
  cache.set(params.path, {
    body: buffer,
    headers: res.headers,
  });
  return new Response(buffer, { headers: res.headers });
}
