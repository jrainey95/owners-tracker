// Time.jsx
import React, { useState, useEffect, useRef } from "react";
import "./index.scss";

function Time() {
  const [times, setTimes] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null); // Create a ref to store the interval ID

  useEffect(() => {
    const fetchTimes = () => {
      try {
        const kemptonNow = new Date().toLocaleString("en-GB", {
          timeZone: "Europe/London",
        });

        const chantillyNow = new Date().toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        });

        const kensingtonNow = new Date().toLocaleString("en-AU", {
          timeZone: "Australia/Sydney",
        });

        const rosehillNow = new Date().toLocaleString("en-AU", {
          timeZone: "Australia/Sydney",
        });

        const newYorkNow = new Date().toLocaleString("en-US", {
          timeZone: "America/New_York",
        });

        const kemptonTimeInMs = new Date(kemptonNow).getTime();
        const pstTimeInMs = kemptonTimeInMs - 8 * 60 * 60 * 1000;
        const pstTimeStr = new Date(pstTimeInMs).toLocaleString("en-US", {
          timeZone: "America/Los_Angeles",
        });

        const formattedTimes = {
          kemptonTime: formatTime(kemptonNow),
          chantillyTime: formatTime(chantillyNow),
          kensingtonTime: formatTime(kensingtonNow),
          rosehillTime: formatTime(rosehillNow),
          newYorkTime: formatTime(newYorkNow),
          pstTime: formatTime(pstTimeStr),
        };

        setTimes(formattedTimes);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    // Fetch times initially
    fetchTimes();

    // Set the interval only once when the component mounts
    if (!intervalRef.current) {
      intervalRef.current = setInterval(fetchTimes, 60000);
    }

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalRef.current);
  }, []);

  const formatTime = (time) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };
    return new Date(time).toLocaleTimeString([], options);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="div-world-times">
      <div>Kempton, England (GMT): {times.kemptonTime}</div>
      <div>Chantilly, France (CET): {times.chantillyTime}</div>
      <div>Kensington, Australia (AEDT): {times.kensingtonTime}</div>
      <div>Rosehill, Australia (AEST): {times.rosehillTime}</div>
      <div>New York/Kentucky, USA (EST): {times.newYorkTime}</div>
      <div>Kempton Time converted to PST: {times.pstTime}</div>
    </div>
  );
}

export default Time;
