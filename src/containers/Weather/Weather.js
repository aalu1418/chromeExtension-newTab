import React from "react";
import moment from "moment";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import "./Weather.css";
import "../../../node_modules/weather-icons/css/weather-icons.css";
import {
  updateLocalStorage,
  readLocalStorage
} from "../../scripts/updateLocalStorage";
import { sampleData } from "../../scripts/sampleData";
import { WeatherDisplay } from "../../components/WeatherDisplay/WeatherDisplay";

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
  const [maxDays, setMaxDays] = React.useState(6);

  //get latitude & longitude on location change
  React.useEffect(() => {
    if (location) {
      fetch(
        "https://nominatim.openstreetmap.org/search?q=" +
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
            console.log("OpenStreetMap Error: " + response.error);
            setLocationData({});
          }
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
        .add(-10, "m")
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
      }, 1000 * 60 * 10);
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

  //window size listener
  React.useEffect(() => {
    function handleResize() {
      // console.log(window.innerWidth);
      if (window.innerWidth > 950) {
        setMaxDays(6);
      } else {
        setMaxDays(Math.floor(window.innerWidth/950*7)-1)
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return _ => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
              future={futureWeather.slice(0, maxDays)}
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

export default Weather;
