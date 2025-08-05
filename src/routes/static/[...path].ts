export async function GET({ params }: { params: { path: string } }) {
  const res = await fetch(`https://arwar.ru/static/${params.path}`);
  if (res.status === 404) return new Response(null, { status: 404 });
  const response = new Response(res.body);
  for (const [key, value] of res.headers.entries()) {
    response.headers.set(key, value);
  }
  return response;
}
