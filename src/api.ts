const apiUrl = process.env['REACT_APP_API_URL'] || '';

export async function fetchJson(resource: string, opts?: object) {
  const res = await fetch(`${apiUrl}${resource}`, opts);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
}
