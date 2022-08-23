import PropTypes from 'prop-types'
import React, { useEffect, useState } from "react";

function Location(props) {
  const [results, setResults] = useState(null);

  useEffect(() => {
    console.log("effect");
    navigator.geolocation.getCurrentPosition(async (l) => {
      console.log("got loc");
      const lon = l.coords.longitude * 10 ** 6 | 0;
      const lat = l.coords.latitude * 10 ** 6 | 0;
      console.log(lat, lon);
      const res = await fetch(`https://xmlopen.rejseplanen.dk/bin/rest.exe/stopsNearby?coordX=${lat}&coordY=${lon}`);
      const text = await res.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "text/xml");
      setResults(Array.from(xml.getElementsByTagName("StopLocation")).map((stop) => {
        return [
          stop.attributes.name.nodeValue,
          stop.attributes.id.nodeValue,
        ];
      }));
    });
  }, []);

  return (
    <div className="col">
      <div className="row">
        <div className="text-center">where did you see them?</div>
      </div>
      <div className="row">
        <div className="list-group">

          {
            results !== null
              ? results.map(([name, id], i) => {
                return (
                  <a className="list-group-item list-group-item-action" href="#" key={i} onClick={() => {
                    props.cb([name, id]);
                  }}>
                    {name}
                  </a>
                );
              })
              : "loading stops.."
          }
        </div>
      </div>
    </div>
  );
}

Location.propTypes = {
  cb: PropTypes.func.isRequired,
}

export default Location;
