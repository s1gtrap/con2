const apiUrl = process.env['REACT_APP_API_URL'] || '';

export type Stop = {
  id: string,
  name: string,
  x: number,
  y: number,
};

type Opts = { method?: string, headers?: object, body?: any };

export async function fetchJson<T>(resource: string, opts: Opts = {}): Promise<T> {
  const opts2 = {
    ...opts,
    headers: {
      ...(opts.headers ? opts.headers : {}),
      ...(opts.body ? { 'content-type': 'application/json' } : {}),
    },
    ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
  }
  const res = await fetch(`${apiUrl}${resource}`, opts2);
  console.log(opts2);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
}

export async function fetchAuthJson<T>(accessToken: string, resource: string, opts: Opts = {}): Promise<T> {
  return await fetchJson<T>(resource, {
    ...opts,
    headers: {
      ...(opts.headers || {}),
      'authorization': `Bearer ${accessToken}`,
    },
  });
}

export async function fetchNearbyStops(lat: number, lng: number): Promise<Stop[]> {
  const x = Math.round(lat * 1000000);
  const y = Math.round(lng * 1000000);
  const res = await fetch(`https://xmlopen.rejseplanen.dk/bin/rest.exe/stopsNearby?coordX=${x}&coordY=${y}`);
  const xml = await res.text();
  const parser = new DOMParser();
  const list = parser.parseFromString(xml, "text/xml");
  return Array.from(list.getElementsByTagName('StopLocation'))
    .map((stop) => {
      return {
        id: stop.getAttribute('id')!,
        name: stop.getAttribute('name')!,
        x: Number(stop.getAttribute('x')!),
        y: Number(stop.getAttribute('y')!),
      };
    });
}

export function geolocation(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => resolve(position.coords),
      reject,
    );
  });
}