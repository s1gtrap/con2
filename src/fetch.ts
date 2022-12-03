const apiUrl = process.env['REACT_APP_API_URL'] || '';

export async function fetchJson<T>(resource: string, opts?: object): Promise<T> {
  const res = await fetch(`${apiUrl}${resource}`, opts);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
}

export async function fetchAuthJson<T>(accessToken: string, resource: string, opts?: object): Promise<T> {
  return await fetchJson<T>(resource, {
    ...opts,
    headers: {
      // FIXME: opts.headers
      'authorization': `Bearer ${accessToken}`,
    },
  });
}