import React from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faSubway
} from "@fortawesome/free-solid-svg-icons";
import LoadingAnimation from "./LoadingAnimation";
import "./Weather.css";
import "../../node_modules/weather-icons/css/weather-icons.css";

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
  tornado: "wi-tornado",
  windDirection: "wi-wind-default"
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

//component for all weather data + inputting location
const Weather = () => {
  const [location, setLocation] = React.useState(null);
  const [locationData, setLocationData] = React.useState(
    JSON.parse(localStorage.getItem("locationData")) || {}
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
          document.title =
            Math.round(data.currently.temperature) + "\xB0 | New Tab";
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
      setActiveInput(false);
    }
  };

  //location display logic
  const neighbourhood = Object.keys(locationData).length !== 0 ? locationData.neighbourhood : null;
  const city = Object.keys(locationData).length !== 0
    ? locationData.city ||
      locationData.town ||
      locationData.village ||
      locationData.state_district
    : null;
  const state = Object.keys(locationData).length !== 0
    ? city === locationData.state
      ? locationData.country
      : locationData.state
    : null;

  return (
    <div className="Weather">
      {(activeInput || !locationData) && (
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
          {neighbourhood && `${neighbourhood}, `}
          {city && `${city}, `}
          {state && `${state}`}
          {!neighbourhood && !city && !state && "Location Error"}
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
      {future &&
        future.map(day => (
          <FutureWeather key={moment.unix(day.time).format("dddd")} day={day} />
        ))}
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
    <PrecipChance data={day} />,
    <WindData data={day} />,
    <MoonData data={day} />,
    <DescriptionText text={`Humidity: ${Math.round(day.humidity * 100)}%`} />
  ];

  return (
    <div
      className="FutureWeather"
      onMouseLeave={() => setIndex(0)}
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
    <PrecipChance data={current} />,
    <WindData data={current} />,
    <DescriptionText
      text={`Humidity: ${Math.round(current.humidity * 100)}%`}
    />
  ];

  if (Object.keys(alert).length !== 0) {
    weatherData.splice(1, 0, <DescriptionText text={alert.title} />);
  }

  return (
    <div
      className="CurrentWeather"
      onClick={() => setIndex((index + 1) % weatherData.length)}
      onMouseLeave={() => setIndex(0)}
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
      <div className="Weather-Details" style={{ height: "100px" }}>
        {weatherData[index]}
      </div>
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
          {Math.round(data.precipProbability * 100) + "% of " + data.precipType}
        </div>
      )}
      {icon === "wi-cloud" && (
        <div className="Weather-Display-SmallText">{"0% of precipation"}</div>
      )}
    </span>
  );
};

const WindData = ({ data }) => {
  const icon = weatherIcons["windDirection"];
  const rotationAngle =
    data.windSpeed !== 0 ? (data.windBearing + 180) % 360 : 0;

  return (
    <span className="Weather-TempDisplay">
      <i
        className={`wi ${icon}`}
        style={{ transform: `rotate(${rotationAngle}deg)` }}
      />
      {data.windBearing && (
        <span>
          <div className="Weather-Display-SmallText">{`${Math.round(
            data.windSpeed
          )} m/s`}</div>
          <div className="Weather-Display-SmallText">{`${Math.round(
            data.windGust
          )} m/s (gusts)`}</div>
        </span>
      )}
    </span>
  );
};

const MoonData = ({ data }) => {
  const specialPhaseCheck = [0, 0.25, 0.5, 0.75].includes(data.moonPhase);
  let icon = [];

  if (specialPhaseCheck) {
    switch (data.moonPhase) {
      case 0:
        icon.push("New");
        break;
      case 0.25:
        icon.push(..."First-Quarter".split("-"));
        break;
      case 0.5:
        icon.push("Full");
        break;
      case 0.75:
        icon.push(..."3rd-Quarter".split("-"));
        break;
      default:
    }
  } else {
    if (data.moonPhase < 0.5) {
      icon.push("Waxing");
    } else {
      icon.push("Waning");
    }

    if (data.moonPhase > 0.25 && data.moonPhase < 0.75) {
      icon.push("Gibbous");
    } else if (data.moonPhase < 0.25) {
      //handles a spelling error in package
      icon.push("Cresent");
    } else {
      icon.push("Crescent");
    }

    icon.push(Math.ceil((data.moonPhase % 0.25) / 0.04));
  }

  //handles spelling error in package
  let iconString = icon;
  if (iconString.includes("Cresent")) {
    iconString[1] = "Crescent";
  }

  const description =
    iconString.length === 1
      ? `${iconString[0]} Moon`
      : iconString.slice(0, 2).join(" ");

  return (
    <span className="Weather-TempDisplay">
      <i className={`wi wi-moon-${icon.join("-").toLowerCase()}`} />
      {data.windBearing && (
        <span>
          <div className="Weather-Display-SmallText">{description}</div>
        </span>
      )}
    </span>
  );
};

export default Weather;
