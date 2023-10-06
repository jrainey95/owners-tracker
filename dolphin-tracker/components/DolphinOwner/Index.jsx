// DolphinOwner.js
import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import "./index.scss";

function DolphinOwner() {
  const [data, setData] = useState("");
  const [raceTimes, setRaceTimes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/fetchData")
      .then((response) => response.text())
      .then((html) => {
        setData(html);
        extractRaceTimes(html); // Extract race times from HTML
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Function to extract race times from HTML
  const extractRaceTimes = (html) => {
    const raceTimeRegex = /<i class="fa fa-clock-o"><\/i>\s+(\d+:\d+)/g;
    const matches = html.match(raceTimeRegex);

    if (matches) {
      const raceTimesPST = matches.map((match) => {
        const localTime = match.match(/\d+:\d+/)[0];
        const raceTime = new Date(`2023-10-06T${localTime}:00`);
        raceTime.setHours(raceTime.getHours() - 8); // Convert to PST (UTC -8)
        return raceTime;
      });
      setRaceTimes(raceTimesPST);
    }
  };

  // Function to calculate and format time until race
  const getTimeUntilRace = (raceTime) => {
    const currentTime = new Date();
    const timeUntilRace = raceTime - currentTime;

    const hoursUntilRace = Math.floor(timeUntilRace / (1000 * 60 * 60));
    const minutesUntilRace = Math.floor(
      (timeUntilRace % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${hoursUntilRace}h ${minutesUntilRace}m`;
  };

  return (
    <div className="container">
      <div className="scrollable-content">
        <div className="dolphin-content"></div>
        {parse(data)}
      </div>

      <div className="time-content">
        <div className="time-container"></div>
        <table>
          <thead>
            <head>Day</head>
            <tr>
              <th>Horse</th>
              <th>PST Time</th>
              <th>Time Until Race</th>
            </tr>
          </thead>
          <tbody>
            {raceTimes.map((raceTime, index) => (
              <tr key={index}>
                <td></td>
                <td>
                  {raceTime.toLocaleTimeString("en-US", {
                    timeZone: "America/Los_Angeles",
                  })}
                </td>
                <td>{getTimeUntilRace(raceTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DolphinOwner;
