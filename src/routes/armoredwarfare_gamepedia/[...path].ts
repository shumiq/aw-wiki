export async function GET({ params }: { params: { path: string } }) {
  const res = await fetch(
    `https://static.wikia.nocookie.net/armoredwarfare_gamepedia/${params.path}`,
    { headers: { referer: "https://armoredwarfare.fandom.com/" } },
  );
  if (res.status === 404) return new Response(null, { status: 404 });
  const response = new Response(res.body);
  for (const [key, value] of res.headers.entries()) {
    response.headers.set(key, value);
  }
  return response;
}
