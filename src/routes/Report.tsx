import React, { useEffect, useState } from 'react';

//import { useAuthContext } from '../App';

type Stop = {
  id: string,
  name: string,
  x: number,
  y: number,
};

async function fetchNearbyStops(lat: number, lng: number): Promise<Stop[]> {
  const res = await fetch(`https://xmlopen.rejseplanen.dk/bin/rest.exe/stopsNearby?coordX=56150450&coordY=10204610`);
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

function Report() {
  const [lat, lng]: [number, number] = [56.150450, 10.204610];
  const [data, setData] = useState<Stop[]>([]);
  //const [] = useAuthContext();
  useEffect(() => {
    fetchNearbyStops(lat, lng)
      .then((data) => setData(data));
  })
  return (
    <>
      {
        data.map((stop, i) => {
          return (
            <p key={i}>{stop.name}</p>
          );
        })
      }
    </>
  );
}

export default Report;
