import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import "./index.scss";
import cheerio from "cheerio";

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
          <th colSpan="6">{date}</th>
        </tr>
        {horseData
          .filter((horse) => horse.raceDay === date)
          .map((horse, index) => (
            <tr key={index}>
              <td className="horse">{horse.horseName}</td>
              <td>{horse.racecourse}</td>
              <td>{horse.timeLocal}</td>
              <td>{getTimeUntilRace(horse.timeLocal)}</td>
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

  const getTimeUntilRace = (timeLocal) => {
    // Implement your logic here to calculate time until the race
    // This function should return a string like "X hours Y minutes"
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
        <tbody>
          <th className="dates"></th>
        </tbody>
          {uniqueDates.map((date) => renderHorsesForDate(date))}
        </table>
      </div>
    </div>
  );
}

export default DolphinOwner;
