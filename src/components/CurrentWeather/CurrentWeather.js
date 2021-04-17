import React from "react";
import { TempDisplay } from "../TempDisplay/TempDisplay";
import { DescriptionText } from "../DescriptionText/DescriptionText";
import { PrecipChance } from "../PrecipChance/PrecipChance";
import { WindData } from "../WindData/WindData";
import { tempConvert } from "../../scripts/conversions.js";
import { ttcAlerts } from "../../scripts/getTTCalerts.js";
import { weatherIconPicker } from "../../scripts/icons.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faSubway,
} from "@fortawesome/free-solid-svg-icons";
import "./CurrentWeather.css";

//component for current weather + associated data
export const CurrentWeather = ({
  current,
  alert,
  day,
  location,
  unit,
}) => {
  const [index, setIndex] = React.useState(0);
  const [transitAlerts, setTransitAlerts] = React.useState([]);
  day = { sunriseTime: 0, sunsetTime: 0, ...day };

  const weatherData = [
    <TempDisplay text="Now">
      <span>{tempConvert(current.temp || null, unit)}</span>
    </TempDisplay>,
    <DescriptionText
      text={
        current.weather[0].description[0].toUpperCase() +
        current.weather[0].description.slice(1)
      }
    />,
    <TempDisplay text="Feels like" textClass="Weather-Display-SmallText">
      <span>{tempConvert(current.feels_like || null, unit)}</span>
    </TempDisplay>,
    <PrecipChance data={current} />,
    <WindData data={current} unit={unit} />,
    <DescriptionText text={`Humidity: ${Math.round(current.humidity)}%`} />,
  ];

  if (transitAlerts.length !== 0) {
    const multiLine = (
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>TTC alert:</li>
        {transitAlerts.map((alert) => (
          <li key={alert}>
            <a href="https://www.ttc.ca/Service_Advisories/all_service_alerts.jsp">
              {alert}
            </a>
          </li>
        ))}
      </ul>
    );
    weatherData.splice(1, 0, <DescriptionText text={multiLine} />);
  }

  if (Object.keys(alert).length !== 0) {
    // console.log(alert);
    weatherData.splice(1, 0, <DescriptionText text={alert.event} />);
  }

  React.useEffect(() => {
    let transitRepeater = null;
    const getTransitAlerts = async () => {
      if (
        location.city.includes("Toronto") &&
        location.state.includes("Ontario")
      ) {
        const alerts = await ttcAlerts();
        setTransitAlerts(alerts.outputAlerts);
        console.log(alerts);
      }
    };
    getTransitAlerts();
    transitRepeater = setInterval(() => getTransitAlerts(), 1000 * 60 * 5);
    return () => clearInterval(transitRepeater);
  }, [location.city, location.state]);

  return (
    <div
      className="CurrentWeather"
      onClick={() => setIndex((index + 1) % weatherData.length)}
      onMouseLeave={() => setIndex(0)}
    >
      <div className="Weather-Icon Current">
        <img
          src={weatherIconPicker(current.weather[0].icon)}
          alt="weather-icon-current"
        />

        {Object.keys(alert).length !== 0 && (
          <FontAwesomeIcon
            className="Weather-Alert Weather"
            icon={faExclamationCircle}
            style={{ backgroundColor: "black" }}
          ></FontAwesomeIcon>
        )}
        {transitAlerts.length !== 0 && (
          <div
            className="Weather-Alert Transit"
            style={{ borderColor: "black" }}
          >
            <FontAwesomeIcon icon={faSubway} style={{ color: "black" }} />
          </div>
        )}
      </div>
      <div className="Weather-Details" style={{ height: "100px" }}>
        {weatherData[index]}
      </div>
    </div>
  );
};
