import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import cheerio from "cheerio";
import moment from "moment-timezone";
import Time from "../Time/Index";
import "./index.scss";
// const moment = require("moment-timezone");
// require("moment-timezone/builds/moment-timezone-with-data-2022-02"); // Replace with your custom data file

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
      "Belmont At The Big A                (USA)": 3, // GMT-3
      "Hawkesbury                (AUS)": 18, // GMT+11
      "Keeneland                (USA)": 3, // GMT-3
      "Kyoto                (JPN)": 16, // GMT+9
      "Tokyo                (JPN)": 16, // GMT+9
      "Woodbine                (CAN)": 3, // GMT-3
      "Indiana Grand                (USA)": 3, // GMT-3
      "Leicester                (GB)": 8, // GMT+8
      "Southwell (AW)                (GB)": 8, // GMT+8
      "Nottingham                (GB)": 8, // GMT+8
      "York                (GB)": 8, // GMT+8
      "Delaware Park                (USA)": 3, // GMT-3
      "Kempton (AW)                (GB)": 8, // GMT+8
      "Wolverhampton (AW)                (GB)": 8, // GMT+8
      "Lyon Parilly                (FR)": 8, // GMT+8
      "Newmarket                (GB)": 8, // GMT+8
      "Newcastle (AW)                (GB)": 8, // GMT+8
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

          const timeZoneIdentifier =
            timeZoneOffset !== 0
              ? `Etc/GMT${timeZoneOffset < 10 ? "-" : "+"}${Math.abs(
                  timeZoneOffset
                )}`
              : "UTC";

          const localTime = moment.tz(timeLocal, "HH:mm", timeZoneIdentifier);
          const gmtTime = localTime.clone().subtract(timeZoneOffset, "hours");

          horseData.push({
            raceDay: raceDate,
            horseName,
            racecourse,
            timeLocal: localTime.format("hh:mm A"),
            timeGMT: gmtTime.format("hh:mm A"),
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
              <td>{horse.timeGMT}</td>
              <td>{calculateTimeUntilPost(horse.timeGMT, horse.racecourse)}</td>
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

  // const calculateTimeUntilPost = (timeGMT, racecourse) => {
  //   const raceTime = moment.tz(timeGMT, "hh:mm A", "Etc/GMT+7"); // Assuming GMT+8 for the race time
  //   const currentTime = moment();
  //   const duration = moment.duration(raceTime.diff(currentTime));

  //   if (duration.asSeconds() <= 0) {
  //     return "Race Over";
  //   }

  //   if (
  //     racecourse === "Kyoto                (JPN)" ||
  //     racecourse === "Tokyo                (JPN)" ||
  //     racecourse === "Hawkesbury                (AUS)"
  //   ) {
  //     // Check if the race is scheduled for the following day
  //     const tomorrow = moment().add(1, "day");
  //     const raceTimeAUS = moment.tz(timeGMT, "hh:mm A", "Etc/GMT+7"); // Australian time zone (GMT+11)
  //     if (
  //       moment(raceTimeAUS).isAfter(
  //         moment(tomorrow.format("YYYY-MM-DD") + " 00:00", "YYYY-MM-DD HH:mm")
  //       )
  //     ) {
  //       const timeUntilRace = moment.duration(raceTimeAUS.diff(moment()));
  //       return `Tonight at ${raceTimeAUS.format(
  //         "hh:mm A"
  //       )} (${timeUntilRace.hours()}h ${timeUntilRace.minutes()}m ${timeUntilRace.seconds()}s until race time)`;
  //     }
  //   }

  //   const hours = Math.floor(duration.asHours());
  //   const minutes = duration.minutes();
  //   const seconds = duration.seconds();

  //   if (hours === 0 && minutes === 0 && seconds === 0) {
  //     return "Race Tonight";
  //   }
  //   console.log(currentTime);
  //   return `${hours}h ${minutes}m ${seconds}s until race time`;
  // };

  const calculateTimeUntilPost = (timeGMT, racecourse) => {
    const raceTime = moment.tz(timeGMT, "hh:mm A", "Etc/GMT+7"); // Assuming GMT+8 for the race time
    const currentTime = moment();
    const duration = moment.duration(raceTime.diff(currentTime));
    const currentDate = moment().format("DD-MM-YYYY");
    console.log(currentDate);

    if (duration.asSeconds() <= 0) {
      return "Race Over";
    }

    //   if (currentDate !== currentTime) {
    //     return "Not Race Day";
    //     // console.log(currentDate);
    //   } else if (duration.asSeconds() <= 0) {
    //     return "Race Over";
    //   }

    if (
      racecourse === "Kyoto                (JPN)" ||
      racecourse === "Tokyo                (JPN)" ||
      racecourse === "Hawkesbury                (AUS)"
    ) {
      // Check if the race is scheduled for the following day
      const tomorrow = moment().add(1, "day");
      const raceTimeAUS = moment.tz(timeGMT, "hh:mm A", "Etc/GMT+7"); // Australian time zone (GMT+11)
      if (
        moment(raceTimeAUS).isAfter(
          moment(tomorrow.format("YYYY-MM-DD") + " 00:00", "YYYY-MM-DD HH:mm")
        )

        //   if (currentDate !== currentTime) {
        //     return "Not Race Day";
        //     // console.log(currentDate);
        //   } else if (duration.asSeconds() <= 0) {
        //     return "Race Over";
        //   }
      ) {
        const timeUntilRace = moment.duration(raceTimeAUS.diff(moment()));
        return `Tonight at ${raceTimeAUS.format(
          "hh:mm A"
        )} (${timeUntilRace.hours()}h ${timeUntilRace.minutes()}m ${timeUntilRace.seconds()}s until race time)`;
      }
    }

    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    if (hours === 0 && minutes === 0 && seconds === 0) {
      return "Race Tonight";
    }
    console.log(currentTime);
    return `${hours}h ${minutes}m ${seconds}s until race time`;
  };

  // const calculateTimeUntilPost = (timeGMT, raceDate) => {
  //   // Get the current date in "YYYY-MM-DD" format
  //   const currentDate = moment().format("DD-MM-YYYY");
  //   console.log("Current Date:", currentDate);

  //   // Create a moment object for the race time
  //   const raceTime = moment.tz(timeGMT, "DD-MM-YYYY", "hh:mm A", "Etc/GMT+7"); // Assuming GMT+8 for the race time
  //   const currentTime = moment();
  //   console.log(currentTime);
  //   const duration = moment.duration(raceTime.diff(currentTime));

  //   if (currentDate !== currentTime) {
  //     return "Not Race Day";
  //     // console.log(currentDate);
  //   } else if (duration.asSeconds() <= 0) {
  //     return "Race Over";
  //   }

  //   // Check if the race is on the current date
  //   if (moment(currentDate).isSame(raceTime, "day")) {
  //     const hours = duration.hours();
  //     const minutes = duration.minutes();
  //     const seconds = duration.seconds();

  //     return `${hours}h ${minutes}m ${seconds}s until race time`;
  //   } else {
  //     return "Not Race Day";
  //   }
  // };

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
                <th>PST</th>
                <th>Minutes Until Post</th>
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
