import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import cheerio from "cheerio";
import moment from "moment-timezone"; // Import Moment.js for timezone conversion
import Time from "../Time/Index";
import "./index.scss";

function DolphinOwner() {
  const [data, setData] = useState("");
  const [horseData, setHorseData] = useState([]);
  const [headerDate, setHeaderDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/fetchData")
      .then((response) => response.text())
      .then((html) => {
        setData(html);
        extractHorseData(html);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const extractHorseData = (html) => {
    const $ = cheerio.load(html);
    const horseData = [];

    const worldTimes = {
      Jpn: "Asia/Tokyo", // Japan (JST)
      SydneyAEDT: "Australia/Sydney", // Sydney (AEDT)
      SydneyAEST: "Australia/Brisbane", // Sydney (AEST)
      EST: "America/New_York", // Eastern Standard Time (EST)
      GB: "Europe/London", // Great Britain (GMT)
      PST: "America/Los_Angeles", // Pacific Standard Time (PST)
      FR: "Europe/Paris", // Chantilly, France (CET)
      USA: "America/New_York",
    };

    $(".race__day").each((index, element) => {
      const headerText = $(element).find(".header__text").text().trim();
      const raceDate = headerText.split(", ")[1];

      $(element)
        .find("tbody tr")
        .each((i, row) => {
          const horseName = $(row).find(".horse-name a").text().trim();
          const racecourse = $(row).find(".racecourse-name").text().trim();
          const timeLocal = $(row).find(".time").text().trim();

          // Parse the local time and set the time zone
          const localTime = moment.tz(timeLocal, "HH:mm", worldTimes.EST);

          // Determine the current time zone based on location
          let timeZone = worldTimes.EST;
          if (racecourse === "AUS") {
            timeZone =
              localTime.isDST() && localTime.isDST() === true
                ? worldTimes.SydneyAEDT
                : worldTimes.SydneyAEST;
          } else if (racecourse === "Jpn") {
            timeZone = worldTimes.Jpn;
          } else if (racecourse === "USA") {
            timeZone = worldTimes.USA;
          }

          // Calculate the JST time (+9 from GMT) and PST time (-7 from JST)
          const jstTime = localTime.clone().tz(timeZone).add(0, "hours");
          const pstTime = jstTime.clone().subtract(16, "hours");
      

          horseData.push({
            raceDay: raceDate,
            horseName,
            racecourse,
            timeLocal: localTime.format("hh:mm A"), // Convert to AM/PM format
            timeJST: jstTime.format("hh:mm A"), // Convert to AM/PM format
            timePST: pstTime.format("hh:mm A"), // Convert to AM/PM format
          });
        });
    });

    console.log(horseData);
    setHorseData(horseData);
  };

  const uniqueDates = [...new Set(horseData.map((horse) => horse.raceDay))];

  const renderHorsesForDate = (date) => {
    return (
      <tbody key={date}>
        <tr>
          <th colSpan="7" className="th-colspan">
            {date}
          </th>
        </tr>
        {horseData
          .filter((horse) => horse.raceDay === date)
          .map((horse, index) => (
            <tr key={index}>
              <td>{horse.racecourse}</td>
              <td className="name">{horse.horseName}</td>
              <td>{horse.timeLocal}</td>
              <td>{horse.timeJST}</td>
              <td>{horse.timePST}</td>
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

  return (
    <div>
      <div className="container">
        <div className="scrollable-content">
          <div className="dolphin-content"></div>
          {parse(data)}
        </div>

        <div className="time-content">
          <div className="time-container">
            {/* Render the Time component for different locations */}
          </div>
          <table>
            <thead>
              <tr>
                <th>Racecourse</th>
                <th className="horse">Horse</th>
                <th>Local Time</th>
                <th>JST</th>
                <th>PST</th>
                <th>Alert</th>
                <th>Save Horse</th>
              </tr>
            </thead>
            {uniqueDates.map((date) => renderHorsesForDate(date))}
          </table>
        </div>
      </div>
    </div>
  );
}

export default DolphinOwner;
