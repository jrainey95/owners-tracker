import React, { useState, useEffect, useRef } from "react";
import "./index.scss";
import moment from "moment-timezone";
import WorldClock from "../WorldClock/Index";
import England from "../../England/Index";
// import EnglandWorldClock from "../WorldClock/England/Index";

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
      <div className="h2-world-header">World Clocks</div>
      <div className="pst-clock">
        
        <WorldClock />
        </div>
      
      {/* <div className="england-clock"> 
      <England/>
      </div> */}

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
