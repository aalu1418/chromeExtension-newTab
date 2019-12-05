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
    const setClock = () => {
      setTime(moment().format("hh mm ss"));
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
  const [currentWeather, setCurrentWeather] = React.useState(null);
  const [futureWeather, setFutureWeather] = React.useState(null);
  const [alertWeather, setAlertWeather] = React.useState(null);

  //get latitude & longitude on location change
  React.useEffect(() => {
    if (location) {
      fetch(
        "https://us1.locationiq.com/v1/search.php?key=" +
          process.env.REACT_APP_LOCATION_KEY +
          "&q=" +
          location +
          "&format=json&addressdetails=1"
      )
        .then(data => data.json())
        .then(response => {
          const data = {
            lat: response[0].lat,
            lon: response[0].lon,
            ...response[0].address
          };
          setLocationData(data);
          localStorage.setItem("locationData", JSON.stringify(data));
        });
    }
  }, [location]);

  //get location information & weather on locationData change
  React.useEffect(() => {
    //https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors
    //using a cors proxy
    let weatherRepeater = null;
    const getWeather = () => {
      console.log("getWeather called");
      const url =
        "https://cors-anywhere.herokuapp.com/" +
        "https://api.darksky.net/forecast/" +
        process.env.REACT_APP_WEATHER_KEY +
        "/" +
        locationData.lat +
        "," +
        locationData.lon +
        "?units=si&exclude=minutely,hourly,flags";
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setCurrentWeather(data.currently);
          setFutureWeather(data.daily.data);
          setAlertWeather(data.alerts);
        });
    };

    if (locationData) {
      getWeather();
      weatherRepeater = setInterval(() => getWeather(), 1000 * 60 * 5);
    }
    return () => clearInterval(weatherRepeater);
  }, [locationData]);

  const enterPress = event => {
    if (event.key === "Enter") {
      setLocation(event.target.value);
    }
  };

  return (
    <div className="Weather">
      <input type="text" onKeyDown={enterPress} />
      {currentWeather && (
        <div className="Weather-CurrentWeather">{currentWeather.summary}</div>
      )}
      {futureWeather && futureWeather.map(day => <div className="Weather-CurrentWeather">{day.icon}</div>)}
      {alertWeather && <div className="Weather-CurrentWeather">{alertWeather[0].title}</div>}
      {locationData && (
        <div className="Weather-Location">
          {locationData.city || locationData.town || locationData.village},{" "}
          {locationData.state}
        </div>
      )}
    </div>
  );
};
