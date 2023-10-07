import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import "./index.scss";
import cheerio from "cheerio";

function DolphinOwner() {
  const [data, setData] = useState("");
  const [horseData, setHorseData] = useState([]);
  const [headerDate, setHeaderDate] = useState("");
  
  const [locationsByDay, setLocationsByDay] = useState({});
  const [chantillyTime, setChantillyTime] = useState("");
  const [kensingtonTime, setKensingtonTime] = useState("");
  const [kemptonTime, setKemptonTime] = useState("");
  const [kentuckyTime, setKentuckyTime] = useState("");
  const [rosehillTime, setRosehillTime] = useState("");
  const [pstTime, setPstTime] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/fetchData")
      .then((response) => response.text())
      .then((html) => {
        setData(html);
        extractHorseData(html);
         const chantillyNow = new Date().toLocaleString("fr-FR", {
           timeZone: "Europe/Paris", // Chantilly, France
         });
         setChantillyTime(formatTime(chantillyNow));

         const kentuckyNow = new Date().toLocaleString("en-US", {
           timeZone: "America/New_York", // Kentucky, USA (Eastern Time Zone)
         });
         setKentuckyTime(formatTime(kentuckyNow));

         const rosehillNow = new Date().toLocaleString("en-US", {
           timeZone: "Australia/Queensland", // New South Wales, Australia
         });
         setRosehillTime(formatTime(rosehillNow));

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
         setKemptonTime(formatTime(kemptonNow));

         setPstTime(formatTime(pstTimeStr));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const extractHorseData = (html) => {
    const $ = cheerio.load(html);
    const horseData = [];

    $(".race__day").each((index, element) => {
      const headerText = $(element).find(".header__text").text().trim();
      const raceDate = headerText.split(", ")[1];

      $(element)
        .find("tbody tr")
        .each((i, row) => {
          const horseName = $(row).find(".horse-name a").text().trim();
          const racecourse = $(row).find(".racecourse-name").text().trim();
          const timeLocal = $(row).find(".time").text().trim();

          horseData.push({
            raceDay: raceDate,
            horseName,
            racecourse,
            timeLocal,
          });
        });
    });

    setHorseData(horseData);
  };

  const uniqueDates = [...new Set(horseData.map((horse) => horse.raceDay))];

  const renderHorsesForDate = (date) => {
    return (
      <tbody key={date}>
        <tr>
          <th colSpan="6" className="th-colspan">
            {date}
          </th>
        </tr>
        {horseData
          .filter((horse) => horse.raceDay === date)
          .map((horse, index) => (
            <tr key={index}>
              <td className="name">{horse.horseName}</td>
              <td>{horse.racecourse}</td>
              <td>{horse.timeLocal}</td>
              <td>{getTimeUntilRace(horse.timeLocal, horse.racecourseLocation)}</td>
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
    );
  };

  const getTimeUntilRace = (localTime, racecourseLocation) => {
    const raceTimeDate = new Date(`2023-10-06T${localTime}:00`);

    // Determine the time zone offset of the racecourse location
    const racecourseTimeZone = getRacecourseTimeZone(racecourseLocation);

    // Convert the race time to PST
    const pstTimeDate = new Date(
      raceTimeDate.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    );

    // Calculate the time difference
    const timeUntilRace = pstTimeDate - new Date();

       // Calculate the hours and minutes until the race
    const hoursUntilRace = Math.floor(timeUntilRace / (60 * 60 * 1000));
    const minutesUntilRace = Math.floor(
      (timeUntilRace % (60 * 60 * 1000)) / (60 * 1000)
    );

    return `${hoursUntilRace} hours ${minutesUntilRace} minutes`;
  };

  const getRacecourseTimeZone = (racecourseLocation) => {
    // Implement logic to map racecourse locations to their respective time zones
    // For example:
    // if (racecourseLocation === "Chantilly") {
    //   return "Europe/Paris";
    // } else if (racecourseLocation === "Kensington") {
    //   return "Australia/Sydney";
    // }
    // Add more mappings as needed

    // Return a default time zone if the location is not found
    return "UTC";
  };

  const formatTime = (timeStr) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      timeZoneName: "short",
    };
    return new Date(timeStr).toLocaleString(undefined, options);
  };

  return (
    <div className="container">
      <div className="scrollable-content">
        <div className="dolphin-content"></div>
        {parse(data)}
      </div>

      <div className="time-content">
        <div className="time-container">
          {/* <header className="track">{headerDate}</header> */}
        </div>
        <table>
          <thead>
            <tr>
              <th className="horse">Horse</th>
              <th>Racecourse</th>
              <th>Local Time</th>
              <th>Time Until Race</th>
              <th>Alert</th>
              <th>Save Horse</th>
            </tr>
          </thead>
          {uniqueDates.map((date) => renderHorsesForDate(date))}
        </table>
      </div>
    </div>
  );
}

export default DolphinOwner;

