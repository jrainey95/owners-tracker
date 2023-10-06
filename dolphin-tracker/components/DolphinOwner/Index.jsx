import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import "./index.scss";

function DolphinOwner() {
  const [data, setData] = useState("");
  const [raceDays, setRaceDays] = useState([]);
  const [raceTimes, setRaceTimes] = useState([]);
  const [horseNames, setHorseNames] = useState([]);
  const [locations, setLocations] = useState([]);
  const [chantillyTime, setChantillyTime] = useState("");
  const [kensingtonTime, setKensingtonTime] = useState("");
  const [kemptonTime, setKemptonTime] = useState(""); // Define kemptonTime
  const [kentuckyTime, setKentuckyTime] = useState(""); 
   const [rosehillTime, setRosehillTime] = useState("");// Define kentuckyTime
  const [pstTime, setPstTime] = useState("");
useEffect(() => {
  fetch("http://localhost:3001/api/fetchData")
    .then((response) => response.text())
    .then((html) => {
      setData(html);
      extractRaceDays(html);
      extractRaceTimes(html);
      extractHorseNames(html);
      extractLocations(html);

      const chantillyNow = new Date().toLocaleString("fr-FR", {
        timeZone: "Europe/Paris", // Chantilly, France
      });
      setChantillyTime(formatTime(chantillyNow));

      const kentuckyNow = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York", // Kentucky, USA (Eastern Time Zone)
      });
      setKentuckyTime(formatTime(kentuckyNow));

      const kensingtonNow = new Date().toLocaleString("en-AU", {
        timeZone: "Australia/Sydney", // Kensington, Australia
      });
      setKensingtonTime(formatTime(kensingtonNow));

      const kemptonNow = new Date().toLocaleString("en-GB", {
        timeZone: "Europe/London", // Kempton, England
      });
      const kemptonTimeInMs = new Date(kemptonNow).getTime();
      const pstTimeInMs = kemptonTimeInMs - 8 * 60 * 60 * 1000; // 8 hours behind
      const pstTimeStr = new Date(pstTimeInMs).toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      });
      setKemptonTime(formatTime(kemptonNow)); // Corrected this line

      setPstTime(formatTime(pstTimeStr));
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}, []);

  const extractRaceDays = (html) => {
    const dayRegex = /<span class="header__text">([^<]+)<\/span>/g;
    const matches = html.match(dayRegex);

    if (matches) {
      const days = matches.map((match) => {
        return match.match(/<span class="header__text">([^<]+)<\/span>/)[1];
      });
      setRaceDays(days);
    }
  };

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

  const extractHorseNames = (html) => {
    const horseNameRegex =
      /<div class="pure-u-2-3 pure-u-sm-1 horse-name"><a[^>]*>([^<]+)<\/a><\/div>/g;
    const matches = html.match(horseNameRegex);

    if (matches) {
      const horseNames = matches.map((match) => {
        return match.match(
          /<div class="pure-u-2-3 pure-u-sm-1 horse-name"><a[^>]*>([^<]+)<\/a><\/div>/
        )[1];
      });
      setHorseNames(horseNames);
    }
  };

  const extractLocations = (html) => {
    const locationRegex =
      /<span class="racecourse-name">\s*([^<]+)\s*<\/span>/g;
    const matches = html.match(locationRegex);

    if (matches) {
      const locations = matches.map((match) => {
        return match.match(
          /<span class="racecourse-name">\s*([^<]+)\s*<\/span>/
        )[1];
      });
      setLocations(locations);
    }
  };

const getTimeUntilRace = (raceTime, location) => {
  const currentTime = new Date();
  const timeUntilRace = raceTime - currentTime;

  const hoursUntilRace = Math.floor(timeUntilRace / (1000 * 60 * 60));
  const minutesUntilRace = Math.floor(
    (timeUntilRace % (1000 * 60 * 60)) / (1000 * 60)
  );

  // Calculate the time zone offset for the given location
  let timeZoneOffset = 0;
  if (location === "Ascot, Kempton, England (GMT)") {
    timeZoneOffset = 0; // GMT (no offset)
  } else if (location === "Chantilly, France (CET)") {
    timeZoneOffset = -1; // CET (GMT-1)
  } else if (location === "Kensington, Australia (AEDT)") {
    timeZoneOffset = -8; // AEDT (GMT-8)
  }

  // Adjust the hours and minutes based on the time zone offset
  const adjustedHours = hoursUntilRace + timeZoneOffset;

  return `${adjustedHours}h ${minutesUntilRace}m`;
};


  const displayTimeWithHorse = (horseIndex) => {
    const raceTime = raceTimes[horseIndex];
    const horseName = horseNames[horseIndex];

    return (
      <React.Fragment>
        <span className="horse">{horseName}</span>
        <br />
        {raceTime.toLocaleTimeString("en-US", {
          timeZone: "America/Los_Angeles",
        })}
        <br />
        {getTimeUntilRace(raceTime)}
      </React.Fragment>
    );
  };
  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const TimeInfo = ({ location, time }) => (
    <p>
      Current Time in {location}: {time} (PST: {pstTime})
    </p>
  );

  return (
    <div className="main">
      <h2>Main Content</h2>
      <TimeInfo location="Ascot/Kempton, England (GMT)" time={kemptonTime} />
      <TimeInfo location="Chantilly, France (CET)" time={chantillyTime} />
      <TimeInfo location="Kensington/ Australia (AEDT)" time={kensingtonTime} />
      <TimeInfo location="New South Wales/ Australia (AEST)" time={rosehillTime} />
      <TimeInfo location="New York/Kentucky, USA (EST)" time={kentuckyTime} />
      <div className="container">
        <div className="scrollable-content">
          <div className="dolphin-content"></div>
          {parse(data)}
        </div>
        <div className="time-content">
          {raceDays.map((raceDay, index) => (
            <div className="race__days ui-accordion open" key={index}>
              <div className="ui-accordion__header">
                <span className="header__text">{raceDay}</span>
              </div>
              <div className="ui-accordion__content">
                <table>
                  <thead>
                    <tr>
                      <th className="location">Location</th>
                      <th className="horse">Horse</th>
                      <th className="time">PST Time</th>
                      <th className="MTP">Time Until Race</th>
                      <th className="alert">Alert</th>
                      <th className="save">Save Horse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {raceTimes.map((_, index) => (
                      <tr key={index}>
                        <td>{locations[index]}</td>
                        <td>{horseNames[index]}</td>
                        <td>
                          {raceTimes[index].toLocaleTimeString("en-US", {
                            timeZone: "America/Los_Angeles",
                          })}
                        </td>
                        <td>{getTimeUntilRace(raceTimes[index])}</td>
                        <td>
                          <button className="button-alert">ALERT</button>
                          <button className="button-alert-all">
                            ALERT ALL
                          </button>
                        </td>
                        <td>
                          <button className="button-save">SAVE</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DolphinOwner;
