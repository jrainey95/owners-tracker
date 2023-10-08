import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import cheerio from "cheerio";
import moment from "moment-timezone";
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

  const racecourseOffsets = {
    "Belmont At The Big A                (USA)": -5, // GMT-5
    "Hawkesbury                (AUS)": 11, // GMT+11
    "Keeneland                (USA)": -5, // GMT-5
    "Kyoto                (JPN)": 9, // GMT+9
    "Tokyo                (JPN)": 9, // GMT+9
    "Woodbine                (CAN)": -5, // GMT-5
    "Indiana Grand                (USA)": -5, // GMT-5
    "Leicester                (GB)": 1, // GMT+1
    "Southwell (AW)                (GB)": 1, // GMT+1
    "Nottingham                (GB)": 1, // GMT+1
    "York                (GB)": 1, // GMT+1
    "Delaware Park                (USA)": -5, // GMT-5
    "Kempton (AW)                (GB)": 1, // GMT+1
    "Wolverhampton (AW)                (GB)": 1, // GMT+1
    "Lyon Parilly                (FR)": 1, // GMT+1
    "Newmarket                (GB)": 1, // GMT+1
    "Newcastle (AW)                (GB)": 1, // GMT+1 with
    // Add more racecourses and their offsets as needed
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

          let timeZoneOffset = racecourseOffsets[racecourse] || 0;

          const localTime = moment.tz(
            timeLocal,
            "HH:mm",
            `Etc/GMT${timeZoneOffset < 10 ? "-" : "+"}${Math.abs(
              timeZoneOffset
            )}`
          );

          // Inside the extractHorseData function
          console.log("Racecourse:", racecourse); // Log the racecourse name
          console.log("Offset:", timeZoneOffset); // Log the offset being used

          const gmtTime = localTime.clone().subtract(timeZoneOffset, "hours");

          horseData.push({
            raceDay: raceDate,
            horseName,
            racecourse,
            timeLocal: localTime.format("hh:mm A"),
            timeGMT: gmtTime.format("hh:mm A"),
            racecourseOffset: timeZoneOffset,
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
          <th colSpan="8" className="th-colspan">
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
              <td>{horse.racecourseOffset}</td>
              <td>{horse.timeGMT}</td>
              <td>{horse.timePST}</td>{" "}
              {/* Add this if you need to display PST */}
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
                <th>GMT</th>
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
