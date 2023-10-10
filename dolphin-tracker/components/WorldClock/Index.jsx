import "./index.scss";

import React, { useEffect, useState } from "react";

const WorldClock = ({ timeZone }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const d = new Date();
      const timeInZone = new Date(d.toLocaleString("en-US", { timeZone }));
      const second = timeInZone.getSeconds();
      const minute = timeInZone.getMinutes();
      const hour = timeInZone.getHours();
      document.getElementById(
        `second-hand-${timeZone}`
      ).style.transform = `rotate(${second * 6}deg)`;
      document.getElementById(
        `minute-hand-${timeZone}`
      ).style.transform = `rotate(${(minute + second / 60) * 6}deg)`;
      document.getElementById(
        `hour-hand-${timeZone}`
      ).style.transform = `rotate(${(hour + minute / 60) * 30}deg)`;

      setTime(timeInZone);
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [timeZone]);

  return (
    <div className="analog-clock">
      <div className="point"></div>
      <div className="hour hour-1">1</div>
      <div className="hour hour-2">2</div>
      <div className="hour hour-3">3</div>
      <div className="hour hour-4">4</div>
      <div className="hour hour-5">5</div>
      <div className="hour hour-6">6</div>
      <div className="hour hour-7">7</div>
      <div className="hour hour-8">8</div>
      <div className="hour hour-9">9</div>
      <div className="hour hour-10">10</div>
      <div className="hour hour-11">11</div>
      <div className="hour hour-12">12</div>
      <div className="brand">{timeZone}</div>

      <div className="minute-hand-wrapper" id={`minute-hand-${timeZone}`}>
        <div className="minute-hand">
          <div className="hand"></div>
          <div className="arrow">V</div>
        </div>
      </div>

      <div className="hour-hand-wrapper" id={`hour-hand-${timeZone}`}>
        <div className="hour-hand">
          <div className="hand"></div>
          <div className="arrow">V</div>
        </div>
      </div>

      <div className="second-hand-wrapper" id={`second-hand-${timeZone}`}>
        <div className="second-hand">
          <div className="hand"></div>
        </div>
      </div>
    </div>
  );
};

export default WorldClock;
