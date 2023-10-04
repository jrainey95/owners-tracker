import React, { useState, useEffect } from "react";
import axios from "axios";

function GodolphinOwner() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/fetchData")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>GodolphinOwner</h1>
      {data.map((item, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: item }}></div>
      ))}
    </div>
  );
}

export default GodolphinOwner;
