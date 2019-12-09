import React from 'react';
import moment from "moment";
import "./Clock.css"

//component for clock & date
const Clock = () => {
  const [time, setTime] = React.useState([]);
  const [date, setDate] = React.useState("");

  //set clock & update every second
  React.useEffect(() => {
    const setClock = () => {
      setTime(
        moment()
          .format("hh mm ss")
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

  return (
    <div className="Clock">
      <div className="Clock-Time">
        {time.map((digits, index) => {
          return (
            <div key={`clock-${index}`} className="Clock-Digits">
              {digits.split("").map((digit, ind) => {
                return (
                  <div key={`clock-${index}-${ind}`} className="Clock-Digit">
                    {digit}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="Clock-Date">{date}</div>
    </div>
  );
};

export default Clock;
