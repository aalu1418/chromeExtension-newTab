import React from "react";
import moment from "moment";
import "./Clock.css";

//component for clock & date
const Clock = ({ screenState }) => {
  const [time, setTime] = React.useState(["--", "--", "--", "--"]);
  const [date, setDate] = React.useState("");
  const [scale, setScale] = React.useState(1);
  const [clockWidth, setClockWidth] = React.useState(0);
  const [analogDisplay, setAnalogDisplay] = React.useState({ display: "none" });
  const [digitalDisplay, setDigitalDisplay] = React.useState({});

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

  //window size listener
  React.useEffect(() => {
    function handleResize() {
      const hide = { display: "none" };
      // console.log(window.innerWidth);
      if (window.innerWidth <= 900) {
        setAnalogDisplay({});
        setDigitalDisplay(hide);
      } else if (window.innerWidth > 900) {
        setAnalogDisplay(hide);
        setDigitalDisplay({});
      }
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // React.useEffect(() => {
  //   console.log(analogDisplay, digitalDisplay);
  // }, [analogDisplay, digitalDisplay]);

  const analogTicks = [];
  for (let ii = 0; ii < 12; ii++) {
    analogTicks.push(
      <div
        key={`hour-${ii}`}
        className="analogClock-tick"
        style={{ transform: `translateY(-8.50rem) rotate(${30 * ii}deg)` }}
      ></div>
    );
  }

  return (
    <div
      className="Clock"
      onClick={() => screenState.setScreen(!screenState.screen)}
      ref={clockSizeRef}
      style={screenState.screen ? { transform: `scale(${scale})` } : {}}
    >
      <div className="analogClock" style={analogDisplay}>
        <div className="analogClock-center"></div>
        {analogTicks}
        <div
          className="analogClock-hour"
          style={{
            transform: `translateY(-1rem) rotate(${(time[0] / 12) * 360}deg)`
          }}
        ></div>
        <div
          className="analogClock-minute"
          style={{
            transform: `translateY(-3.5rem) rotate(${(time[1] / 60) * 360}deg)`
          }}
        ></div>
        <div
          className="analogClock-second"
          style={{
            transform: `translateY(-3rem) rotate(${(time[2] / 60) * 360}deg)`
          }}
        ></div>
      </div>
      <div className="Clock-Time" style={digitalDisplay}>
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
