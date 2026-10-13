// Thin client for the PHP endpoints in /public/api (run on Hostinger).
export async function postJSON<T = { ok: boolean; error?: string }>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // PHP not available (e.g. `next dev`) or server error page.
  }
  if (!res.ok || !data) {
    const msg = (data as { error?: string } | null)?.error;
    throw new Error(msg || (res.status === 404 ? "This feature is available once the site is deployed to Hostinger." : "Something went wrong. Please call us and we'll help right away."));
  }
  return data as T;
}
