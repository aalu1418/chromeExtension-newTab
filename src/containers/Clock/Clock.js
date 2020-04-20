import React from "react";
import moment from "moment";
import "./Clock.css";

//component for clock & date
const Clock = ({ screenState }) => {
  const [time, setTime] = React.useState(["--", "--", "--", "--"]);
  const [date, setDate] = React.useState("");
  const [scale, setScale] = React.useState(1);
  const [clockWidth, setClockWidth] = React.useState(0);

  //set clock & update every second
  React.useEffect(() => {
    const setClock = () => {
      setTime(
        moment()
          .format("hh mm ss A")
          .split(" ")
      );
      setDate(moment().format("dddd, DD MMMM YYYY"));
    };

    setClock();
    const clock = setInterval(() => {
      setClock();
    }, 1000);

    return () => {
      clearInterval(clock);
    };
  }, []);

  //get screensize whenever it changes (and change the scaling factor)
  const clockSizeRef = React.useRef(null);
  React.useEffect(() => {
    setTimeout(
      () => setClockWidth(clockSizeRef.current.getBoundingClientRect().width),
      0
    );

    const newWidthChange = () => {
      setScale(window.innerWidth / clockWidth);
    };
    newWidthChange();
    window.addEventListener("resize", newWidthChange);
    return () => window.removeEventListener("resize", newWidthChange);
  }, [clockWidth]);

  return (
    <div
      className="Clock"
      onClick={() => screenState.setScreen(!screenState.screen)}
      ref={clockSizeRef}
      style={screenState.screen ? { transform: `scale(${scale})` } : {}}
    >
      <div className="Clock-Time">
        <div key={`clock-hour`} className="Clock-Digits">
          {time[0].split("").map((digit, ind) => {
            return (
              <div key={`clock-hour-${ind}`} className="Clock-Digit Large">
                {digit}
              </div>
            );
          })}
        </div>
        <div key={`clock-minute`} className="Clock-Digits">
          {time[1].split("").map((digit, ind) => {
            return (
              <div key={`clock-minute-${ind}`} className="Clock-Digit Large">
                {digit}
              </div>
            );
          })}
        </div>
        <div key={`clock-second`} className="Clock-Digits">
          {time[2].split("").map((digit, ind) => {
            return (
              <div key={`clock-minute-${ind}`} className="Clock-Digit">
                <div className="Clock-Digit-Half">{digit}</div>
                <div className="Clock-Digit-Half">{time[3].split("")[ind]}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="Clock-Date">{date}</div>
    </div>
  );
};

export default Clock;
