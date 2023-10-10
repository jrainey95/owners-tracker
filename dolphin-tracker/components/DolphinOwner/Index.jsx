import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import cheerio from "cheerio";
import moment from "moment-timezone";
import Time from "../Time/Index";
import "./index.scss";

function DolphinOwner() {
  const [data, setData] = useState("");
  const [horseData, setHorseData] = useState([]);
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(true);
  const currentJapanDate = moment().tz("Asia/Tokyo").format("DD-MM-YYYY");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/fetchData");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const html = await response.text();
        setData(html);
        extractHorseData(html);
        setIsLoading(false);
        // Start the countdown timer when data is fetched
        startCountdown();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
      "Newcastle (AW)                (GB)": 8,
      "Chantilly                (FR)": 9, // GMT+8
      "Warwick Farm                (AUS)": 17,
      "Chelmsford (AW)                (GB)": 8,
      "Goodwood                (GB)": 8,
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
          const currentDate = moment().format("DD MMMM YYYY");

          const raceDateMoment = moment(raceDate, "DD MMMM YYYY");

          const raceDateTime = moment(
            `${raceDateMoment.format("DD MMMM YYYY")} ${timeLocal}`,
            "DD MMMM YYYY HH:mm A"
          );
          const daysUntilRace = raceDateTime.diff(currentDate, "days");
          console.log(daysUntilRace);
          // console.log(raceDateMoment);

          const combinedDateTime = moment({
            year: raceDateMoment.year(),
            month: raceDateMoment.month(),
            day: raceDateMoment.date(),
            hour: gmtTime.hours(),
            minute: gmtTime.minutes(),
          });

          //  raceDayWithTimeGMT.push({
          //    horseName,
          //    racecourse,
          //    raceDay: combinedDateTime.format("YYYY-MM-DD HH:mm:ss"),
          //    daysUntilRace, // Assign the calculated daysUntilRace here
          //  });

          horseData.push({
            raceDay: raceDate,
            actualRaceDay: combinedDateTime.format("YYYY-MM-DD HH:mm:ss"),
            horseName,
            racecourse,
            currentJapanDate,
            timeLocal: localTime.format("hh:mm A"),
            timeGMT: gmtTime.format("hh:mm A"),
            adjustedCurrentDate: currentDate,
            daysUntilRace,
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
              {/* <td>{horse.daysUntilRace}{calculateTimeUntilPost(horse.timeGMT, horse.racecourse)}</td> */}
              <td>{calculateTimeUntilPost(horse.actualRaceDay)}</td>

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

  const calculateTimeUntilPost = (actualRaceDay) => {
    const raceTime = moment(actualRaceDay, "YYYY-MM-DD HH:mm:ss");
    const currentTime = moment();
    const duration = moment.duration(raceTime.diff(currentTime));

    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    if (days < 0) {
      return "Race Over";
    }

    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      return "Race Tonight";
    }

    return `${days}d ${hours}hrs ${minutes}mins ${seconds}sec until Post Time`;
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
  const startCountdown = () => {
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);

      // Reset the countdown to 60 seconds when it reaches 0
      if (countdown === 0) {
        setCountdown(60);
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  };

  if (isLoading) {
    // While loading, display a loading spinner or message
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div>
      <div className="world-times"> <Time/></div>
      {/* <div className="countdown">Countdown: {countdown} seconds</div> */}

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
