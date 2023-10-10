import React, { useState, useEffect, useRef } from "react";
import "./index.scss";
import moment from "moment-timezone";
import WorldClock from "../WorldClock/Index";



function Time() {
  const [times, setTimes] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null); // Create a ref to store the interval ID

  useEffect(() => {
    const fetchTimes = () => {
      try {
        const kemptonTime = moment().tz("Europe/London").format("h:mm:ss A");
        const chantillyTime = moment().tz("Europe/Paris").format("h:mm:ss A");
        const kensingtonTime = moment()
          .tz("Australia/Sydney")
          .format("h:mm:ss A");
        const jpnTime = moment().tz("Asia/Tokyo").format("h:mm:ss A");
        const newYorkTime = moment().tz("America/New_York").format("h:mm:ss A");
        const pacificStandardTime = moment()
          .tz("America/Los_Angeles")
          .format("h:mm:ss A");
        const aestQldTime = moment()
              .tz("Australia/Queensland")
              .format("h:mm:ss A");


        const formattedTimes = {
          kemptonTime,
          chantillyTime,
          kensingtonTime,
          jpnTime,
          newYorkTime,
          pacificStandardTime,
          aestQldTime,
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
  <div>
    <div className="div-world-times">
      <div className="world-clock">
        <h2 className="h2-world-header">England</h2>
        <WorldClock timeZone="Europe/London" />
      </div>
      <div className="world-clock">
        <h2 className="h2-world-header">Paris France</h2>
        <WorldClock timeZone="Europe/Paris" />
      </div>
      <div className="world-clock">
        <h2 className="h2-world-header">AEST</h2>
        <WorldClock timeZone="Australia/Brisbane" />
      </div>
      <div className="world-clock">
        <h2 className="h2-world-header">AEDT</h2>
        <WorldClock timeZone="Australia/Sydney" />
      </div>
      <div className="world-clock">
        <h2 className="h2-world-header">Japan</h2>
        <WorldClock timeZone="Asia/Tokyo" />
      </div>
      <div className="world-clock">
        <h2 className="h2-world-header">EST</h2>
        <WorldClock timeZone="America/New_York" />
      </div>
      <div className="world-clock">
        <h2 className="h2-world-header">PST</h2>
        <WorldClock timeZone="America/Los_Angeles" />
      </div>
    </div>


      <div className="div-world-times">
        <div>England: {times.kemptonTime}</div>
        <div>France: {times.chantillyTime}</div>
        <div>AEST(Rosehill, Warwick) Australia: {times.aestQldTime}</div>
        <div>AEDT(Kensington) Australia: {times.kensingtonTime}</div>
        <div>Japan: {times.jpnTime}</div>
        <div>Eastern Standard Time: {times.newYorkTime}</div>
        <div>Pacific Standard Time: {times.pacificStandardTime}</div>
      </div>
    </div>
  );
}

export default Time;
