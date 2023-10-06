import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import "./index.scss";

function DolphinOwner() {
  const [data, setData] = useState("");
  const [raceDays, setRaceDays] = useState([]);
  const [raceTimes, setRaceTimes] = useState([]);
  const [horseNames, setHorseNames] = useState([]);
  const [currentDay, setCurrentDay] = useState(""); 

  useEffect(() => {
    fetch("http://localhost:3001/api/fetchData")
      .then((response) => response.text())
      .then((html) => {
        setData(html);
        extractRaceDays(html);
        extractRaceTimes(html);
        extractHorseNames(html);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Function to extract race days from HTML
  const extractRaceDays = (html) => {
    const dayRegex = /<span class="header__text">([^<]+)<\/span>/g;
    const matches = html.match(dayRegex);

    if (matches) {
      const days = matches.map((match) => {
        return match.match(/<span class="header__text">([^<]+)<\/span>/)[1];
      });
      setRaceDays(days);
      setCurrentDay(days[0]);
    }
  };

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
      console.log(extractRaceTimes);
      setRaceTimes(raceTimesPST);
    }
  };

  // Function to extract horse names from HTML
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
        {raceDays.map((raceDay, index) => (
          <div className="race__days ui-accordion open" key={index}>
            <div className="ui-accordion__header">
              <span className="header__text">{raceDay}</span>
            </div>
            <div className="ui-accordion__content">
              <table>
                <thead>
                  <tr>
                    <th className="horse">Horse</th>
                    <th className="time">PST Time</th>
                    <th className="MTP">Time Until Race</th>
                    <th className="alert">Alert</th>
                    <th className="save">Save Horse</th>
                  </tr>
                </thead>
                <tbody>
                  {raceTimes.map((raceTime, index) => (
                    <tr key={index}>
                      <td className="horse">{horseNames[index]}</td>
                      <td>
                        {raceTime.toLocaleTimeString("en-US", {
                          timeZone: "America/Los_Angeles",
                        })}
                      </td>
                      <td>{getTimeUntilRace(raceTime)}</td>
                      <td>
                        <button className="button-alert">ALERT</button>
                        <button className="button-alert-all">ALERT ALL</button>
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


  );
}

export default DolphinOwner;
{/* <div className="block block-system first last odd" id="block- sytem-main">
  <div id="race-days-wrapper">
    <div className="race__days ui-accordion open">
      <div className="ui-accordion__header">
        <span class="header__text"></span>
      </div>
      <div className="ui-accordion__content">
        <table>
          <thead>
            <tr>
              <th className="horse">Horse</th>
              <th className="time">PST Time</th>
              <th className="MTP">Time Until Race</th>
              <th className="alert">Alert</th>
              <th className="save">Save Horse</th>
            </tr>
          </thead>
          <tbody>
            <td className="horse">Horse</td>
            <td className="time">PST Time</td>
            <td className="MTP">Time Until Race</td>
            <td className="alert">Alert</td>
            <td className="save">Save Horse</td>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>; */}