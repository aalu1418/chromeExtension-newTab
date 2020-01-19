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
import { updateLocalStorage, readLocalStorage } from "./updateLocalStorage";
import { sampleData } from "./sampleData";
import { ttcAlerts } from "./getTTCalerts";

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
const Weather = ({ bgColor, unit }) => {
  const [location, setLocation] = React.useState(null);
  const [newLocation, setNewLocation] = React.useState(false);
  const [locationData, setLocationData] = React.useState(
    readLocalStorage("locationData") || {}
  );
  const [currentWeather, setCurrentWeather] = React.useState(
    readLocalStorage("currentlyData") || {}
  );
  const [futureWeather, setFutureWeather] = React.useState(
    readLocalStorage("dailyData") || []
  );
  const [alertWeather, setAlertWeather] = React.useState(
    readLocalStorage("alertData") || {}
  );
  const [activeInput, setActiveInput] = React.useState(!locationData);

  //get latitude & longitude on location change
  React.useEffect(() => {
    if (location) {
      if (process.env.REACT_APP_LOCATION_KEY) {
        fetch(
          "https://us1.locationiq.com/v1/search.php?key=" +
            process.env.REACT_APP_LOCATION_KEY +
            "&q=" +
            location +
            "&format=json&addressdetails=1"
        )
          .then(data => data.json())
          .then(response => {
            if (!response.error) {
              const data = {
                lat: response[0].lat,
                lon: response[0].lon,
                ...response[0].address
              };
              setLocationData(data);
              setNewLocation(true);
              updateLocalStorage({ locationData: data });
            } else {
              console.log("LocationIQ error: " + response.error);
              setLocationData({});
            }
          });
      } else {
        console.log("No LocationIQ api key present");
        setLocationData(sampleData.locationData);
      }
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
          let storagePayload = {
            currentlyData: data.currently,
            dailyData: data.daily.data.slice(0, 6),
            alertData: {}
          };
          if (data.alerts) {
            // console.log(data.alerts);
            setAlertWeather(data.alerts[0]);
            storagePayload = { ...storagePayload, alertData: data.alerts[0] };
          } else {
            setAlertWeather({});
          }
          updateLocalStorage(storagePayload);
          document.title =
            Math.round(data.currently.temperature) + "\xB0 | New Tab";
        });
    };

    if (
      Object.keys(locationData).length !== 0 &&
      process.env.REACT_APP_WEATHER_KEY
    ) {
      //only run getWeather if saved data is too old (only happens on page load)
      const currentTime = moment()
        .add(-5, "m")
        .unix();
      // console.log(currentWeather.time, currentTime);
      if (currentWeather.time <= currentTime || newLocation) {
        getWeather();
        setNewLocation(false);
      } else {
        document.title =
          Math.round(currentWeather.temperature) + "\xB0 | New Tab";
      }
      weatherRepeater = setInterval(() => {
        getWeather();
      }, 1000 * 60 * 5);
    }

    if (!process.env.REACT_APP_WEATHER_KEY) {
      console.log("No DarkSky api key present");
      setCurrentWeather(sampleData.currentlyData);
      setFutureWeather(sampleData.dailyData);
    }
    return () => clearInterval(weatherRepeater);
  }, [newLocation, locationData, currentWeather]);

  const enterPress = event => {
    if (event.key === "Enter") {
      if (event.target.value.trim() !== "") {
        setLocation(event.target.value);
        setCurrentWeather({});
        setFutureWeather([]);
      }
      setActiveInput(false);
    }
  };

  //location display logic
  const neighbourhood =
    Object.keys(locationData).length !== 0 ? locationData.neighbourhood : null;
  const city =
    Object.keys(locationData).length !== 0
      ? locationData.city ||
        locationData.town ||
        locationData.village ||
        locationData.state_district
      : null;
  const state =
    Object.keys(locationData).length !== 0
      ? city === locationData.state
        ? locationData.country
        : locationData.state || locationData.country
      : null;

  return (
    <div className="Weather">
      {(activeInput || Object.keys(locationData).length === 0) && (
        <input
          autoFocus
          className="Weather-Input"
          type="text"
          onKeyDown={enterPress}
          placeholder="Location"
          onBlur={() => setActiveInput(false)}
        />
      )}
      {!activeInput && Object.keys(locationData).length !== 0 && (
        <div className="Weather-Location" onClick={() => setActiveInput(true)}>
          {neighbourhood && `${neighbourhood}, `}
          {city && `${city}, `}
          {state && `${state}`}
          {!neighbourhood && !city && !state && "Location Error"}
        </div>
      )}
      {Object.keys(locationData).length !== 0 && (
        <span>
          {futureWeather.length !== 0 ? (
            <WeatherDisplay
              current={currentWeather}
              future={futureWeather}
              alert={alertWeather}
              bgColor={bgColor}
              location={locationData}
              unit={unit}
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
const WeatherDisplay = ({ current, future, alert, bgColor, location, unit }) => {
  return (
    <div className="WeatherDisplay">
      {current && (
        <CurrentWeather
          current={current}
          alert={alert}
          day={future[0]}
          bgColor={bgColor}
          location={location}
          unit={unit}
        />
      )}
      {future &&
        future.map(day => (
          <FutureWeather key={moment.unix(day.time).format("dddd")} day={day} unit={unit}/>
        ))}
    </div>
  );
};

//component for single day future weather
const FutureWeather = ({ day, unit }) => {
  const [index, setIndex] = React.useState(0);

  const weatherData = [
    <TempDisplay text={moment.unix(day.time).format("dddd")}>
      <span>{tempConvert(day.temperatureHigh, unit)}</span>
      <span className="Weather-LowTemp">{tempConvert(day.temperatureLow, unit)}</span>
    </TempDisplay>,
    <DescriptionText text={day.summary} />,
    <PrecipChance data={day} />,
    <WindData data={day} unit={unit} />,
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
const CurrentWeather = ({ current, alert, day, bgColor, location, unit }) => {
  const [index, setIndex] = React.useState(0);
  const [transitAlerts, setTransitAlerts] = React.useState([]);
  day = { sunriseTime: 0, sunsetTime: 0, ...day };

  const weatherData = [
    <TempDisplay text="Now">
      <span>{tempConvert(current.temperature || null, unit)}</span>
    </TempDisplay>,
    <DescriptionText text={current.summary} />,
    <TempDisplay text="Feels like" textClass="Weather-Display-SmallText">
      <span>{tempConvert(current.apparentTemperature || null, unit)}</span>
    </TempDisplay>,
    <PrecipChance data={current} />,
    <WindData data={current} unit={unit}/>,
    <DescriptionText
      text={`Humidity: ${Math.round(current.humidity * 100)}%`}
    />
  ];

  if (transitAlerts.length !== 0) {
    const multiLine = (
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>TTC alert:</li>
        {transitAlerts.map(alert => (
          <li key={alert.transit}>
            <a href="https://www.ttc.ca/Service_Advisories/all_service_alerts.jsp">
              {alert.transit}
            </a>
          </li>
        ))}
      </ul>
    );
    weatherData.splice(1, 0, <DescriptionText text={multiLine} />);
  }

  if (Object.keys(alert).length !== 0) {
    // console.log(alert.uri);
    const output = (<a href={alert.uri}>{alert.title}</a>)
    weatherData.splice(1, 0, <DescriptionText text={output} />);
  }

  React.useEffect(() => {
    let transitRepeater = null;
    const getTransitAlerts = async () => {
      if (location.city === "Toronto") {
        const alerts = await ttcAlerts();
        setTransitAlerts(alerts.outputAlerts);
        console.log(alerts);
      }
    };
    getTransitAlerts();
    transitRepeater = setInterval(() => getTransitAlerts(), 1000 * 60 * 5);
    return () => clearInterval(transitRepeater);
  }, [location.city]);

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
            style={{ backgroundColor: bgColor }}
          ></FontAwesomeIcon>
        )}
        {transitAlerts.length !== 0 && (
          <div
            className="Weather-Alert Transit"
            style = {{borderColor: bgColor}}
          >
            <FontAwesomeIcon icon={faSubway} style={{color: bgColor}}/>
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

const WindData = ({ data, unit }) => {
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
          <div className="Weather-Display-SmallText">{speedConvert(data.windSpeed, unit)}</div>
          <div className="Weather-Display-SmallText">{`${speedConvert(data.windGust, unit)} (gusts)`}</div>
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
      {data.moonPhase && (
        <span>
          <div className="Weather-Display-SmallText">{description}</div>
        </span>
      )}
    </span>
  );
};

const tempConvert = (temp, unit) => {
  if (unit === "us") {
    return Math.round(temp*9/5 + 32)
  } else {
    return Math.round(temp)
  }
}

const speedConvert = (speed, unit) => {
  if (unit === "us") {
    return `${Math.round(speed*2.23694)} mph`
  } else {
    return `${Math.round(speed)} m/s`
  }
}

export default Weather;
