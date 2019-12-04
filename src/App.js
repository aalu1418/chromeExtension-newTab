import React from "react";
import moment from "moment";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <div className="App-Content">
        <Clock />
        <Weather />
      </div>
    </div>
  );
};

export default App;

const Clock = () => {
  const [time, setTime] = React.useState(null);
  const [date, setDate] = React.useState(null);

  React.useEffect(() => {
    const clock = setInterval(() => {
      setTime(moment().format("hh mm ss"));
      setDate(moment().format("dddd, DD MMMM YYYY"));
    }, 1000);

    return () => {
      clearInterval(clock);
    };
  }, []);

  return (
    <div className="Clock">
      <div className="Clock-Time">{time}</div>
      <div className="Clock-Date">{date}</div>
    </div>
  );
};

const Weather = () => {
  const [location, setLocation] = React.useState(null);
  const [locationData, setLocationData] = React.useState(
    JSON.parse(localStorage.getItem("locationData"))
  );

  React.useEffect(() => {
    if (location) {
      fetch(
        "https://us1.locationiq.com/v1/search.php?key=" +
          process.env.REACT_APP_LOCATION_KEY +
          "&q=" +
          location +
          "&format=json"
      )
        .then(data => data.json())
        .then(response => {
          setLocationData(response);
          localStorage.setItem("locationData", JSON.stringify(response));
        });
    }
  }, [location]);

  const enterPress = event => {
    if (event.key === "Enter") {
      setLocation(event.target.value);
    }
  };

  return (
    <div>
      <input type="text" onKeyDown={enterPress} />
    </div>
  );
};
