import "./index.scss";
import React, { useEffect, useState } from "react";

const England = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const d = new Date();
      const second = d.getSeconds();
      const minute = d.getMinutes();
      const hour = d.getHours();
      document.getElementById("second-hand").style.transform = `rotate(${
        second * 6
      }deg)`;
      document.getElementById("minute-hand").style.transform = `rotate(${
        (minute + second / 60) * 6
      }deg)`;
      document.getElementById("hour-hand").style.transform = `rotate(${
        (hour + minute / 60) * 30
      }deg)`;

      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

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
      <div className="brand">San Francisco</div>

      <div className="minute-hand-wrapper" id="minute-hand">
        <div className="minute-hand">
          <div className="hand"></div>
          <div className="arrow">V</div>
        </div>
      </div>

      <div className="hour-hand-wrapper" id="hour-hand">
        <div className="hour-hand">
          <div className="hand"></div>
          <div className="arrow">V</div>
        </div>
      </div>

      <div className="second-hand-wrapper" id="second-hand">
        <div className="second-hand">
          <div className="hand"></div>
        </div>
      </div>
    </div>
  );
};


export default England;
