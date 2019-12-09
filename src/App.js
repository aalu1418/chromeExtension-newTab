import React from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faSubway
} from "@fortawesome/free-solid-svg-icons";
import LoadingAnimation from "./LoadingAnimation";
import "./App.css";
import "../node_modules/weather-icons/css/weather-icons.css";

//weather icons
const weatherIcons = {
  "clear-day": "wi-day-sunny",
  "clear-night": "wi-night-clear",
  rain: "wi-rain",
  snow: "wi-snow",
  sleet: "wi-sleet",
  wind: "wi-strong-wind",
  fog: "wi-fog",
  cloudy: "wi-cloudy",
  "partly-cloudy-day": "wi-day-sunny-overcast",
  "partly-cloudy-night": "wi-night-alt-cloudy",
  hail: "wi-hail",
  thunderstorm: "wi-thunderstorm",
  tornado: "wi-tornado"
};

//algorithm to pick icons based on time & precipitation time
const weatherIconPicker = (icon, time, sunrise, sunset) => {
  const modifiableWeather = [
    "rain",
    "snow",
    "sleet",
    "cloudy",
    "hail",
    "thunderstorm"
  ];
  if (!modifiableWeather.includes(icon) || !time) {
    return weatherIcons[icon];
  } else {
    const stringArray = weatherIcons[icon].split("-");
    const dayTime = time > sunrise && time < sunset;
    const timeModifier = dayTime ? "day" : "night-alt";
    stringArray.splice(1, 0, timeModifier);
    // console.log(dayTime, stringArray.join("-"));
    return stringArray.join("-");
  }
};

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

//component for all weather data + inputting location
const Weather = () => {
  const [location, setLocation] = React.useState(null);
  const [locationData, setLocationData] = React.useState(
    JSON.parse(localStorage.getItem("locationData"))
  );
  const [currentWeather, setCurrentWeather] = React.useState({});
  const [futureWeather, setFutureWeather] = React.useState([]);
  const [alertWeather, setAlertWeather] = React.useState({});
  const [activeInput, setActiveInput] = React.useState(!locationData);

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
          setFutureWeather(data.daily.data.slice(0, 6));
          if (data.alerts) {
            setAlertWeather(data.alerts[0]);
          }
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
      if (event.target.value.trim() !== "") {
        setLocation(event.target.value);
        setFutureWeather([]);
        setCurrentWeather({});
        setAlertWeather({});
      }
      setActiveInput(false)
    }
  };

  return (
    <div className="Weather">
      {activeInput && (
        <input
          autoFocus
          className="Weather-Input"
          type="text"
          onKeyDown={enterPress}
          placeholder="Location"
          onBlur={() => setActiveInput(false)}
        />
      )}
      {!activeInput && locationData && (
        <div className="Weather-Location" onClick={() => setActiveInput(true)}>
          {locationData.city || locationData.town || locationData.village},{" "}
          {locationData.state}
        </div>
      )}
      {locationData && (
        <span>
          {futureWeather.length !== 0 ? (
            <WeatherDisplay
              current={currentWeather}
              future={futureWeather}
              alert={alertWeather}
            />
          ) : (
            <LoadingAnimation />
          )}
        </span>
      )}
    </div>
  );
};

//component for entire weather forecast
const WeatherDisplay = ({ current, future, alert }) => {
  return (
    <div className="WeatherDisplay">
      {current && (
        <CurrentWeather current={current} alert={alert} day={future[0]} />
      )}
      {future && future.map(day => <FutureWeather key={day.time} day={day} />)}
    </div>
  );
};

//component for single day future weather
const FutureWeather = ({ day }) => {
  const [index, setIndex] = React.useState(0);

  const weatherData = [
    <TempDisplay text={moment.unix(day.time).format("dddd")}>
      <span>{Math.round(day.temperatureHigh)}</span>
      <span className="Weather-LowTemp">{Math.round(day.temperatureLow)}</span>
    </TempDisplay>,
    <DescriptionText text={day.summary} />,
    <PrecipChance data={day} />
  ];

  return (
    <div
      className="FutureWeather"
      onClick={() => setIndex((index + 1) % weatherData.length)}
    >
      <div className="Weather-Icon Future">
        <i
          className={`wi ${weatherIconPicker(
            day.icon,
            day.precipIntensityMaxTime || false,
            day.sunriseTime,
            day.sunsetTime
          )}`}
        ></i>
      </div>
      <div style={{ height: "60px" }}>{weatherData[index]}</div>
    </div>
  );
};

//component for current weather + associated data
const CurrentWeather = ({ current, alert, day }) => {
  const [index, setIndex] = React.useState(0);
  day = { sunriseTime: 0, sunsetTime: 0, ...day };

  const weatherData = [
    <TempDisplay text="Now">
      <span>{Math.round(current.temperature || null)}</span>
    </TempDisplay>,
    <DescriptionText text={current.summary} />,
    <TempDisplay text="Feels like" textClass="Weather-Display-SmallText">
      <span>{Math.round(current.apparentTemperature || null)}</span>
    </TempDisplay>,
    <PrecipChance data={current} />
  ];

  if (Object.keys(alert).length !== 0) {
    weatherData.splice(1, 0, <DescriptionText text={alert.title} />);
  }

  return (
    <div
      className="CurrentWeather"
      onClick={() => setIndex((index + 1) % weatherData.length)}
    >
      <div className="Weather-Icon Current">
        <i
          className={`wi ${weatherIconPicker(
            current.icon,
            current.time,
            day.sunriseTime,
            day.sunsetTime
          )}`}
        ></i>
        {Object.keys(alert).length !== 0 && (
          <FontAwesomeIcon
            className="Weather-Alert Weather"
            icon={faExclamationCircle}
          ></FontAwesomeIcon>
        )}
        {false && (
          <div className="Weather-Alert Transit">
            <FontAwesomeIcon icon={faSubway} />
          </div>
        )}
      </div>
      <div style={{ height: "100px" }}>{weatherData[index]}</div>
    </div>
  );
};

//component for temperature data
const TempDisplay = ({ text, textClass, children }) => {
  return (
    <span className="Weather-TempDisplay">
      <div className={textClass}>{text}</div>
      <div className="Weather-Temperature">{children}</div>
    </span>
  );
};

//component for text
const DescriptionText = ({ text }) => {
  return <div className="Weather-Display-SmallText">{text}</div>;
};

//component for precipitation chance data
const PrecipChance = ({ data }) => {
  const icon = data.precipType
    ? weatherIconPicker(data.precipType, null, "", "")
    : "wi-cloud";
  return (
    <span className="Weather-TempDisplay">
      <i className={`wi ${icon}`} />
      {icon !== "wi-cloud" && (
        <div className="Weather-Display-SmallText">
          {data.precipProbability * 100 + "% of " + data.precipType}
        </div>
      )}
      {icon === "wi-cloud" && (
        <div className="Weather-Display-SmallText">{"0% of precipation"}</div>
      )}
    </span>
  );
};
