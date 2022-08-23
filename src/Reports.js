import PropTypes from 'prop-types'
import React, { useEffect, useState } from "react";

import { API_URL } from './App';

function Reports(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_URL}/api/v1/reports`, {
        headers: {
          "accept": "application/json",
        },
      });
      setIsLoading(false);
      setResults(await res.json());
    })();
  }, []);
  return (
    <div className="col">
      <ul>
        {
          results.map((result, i) => {
            return (
              <li key={i}>
                {result.stop}
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}

export default Reports;
