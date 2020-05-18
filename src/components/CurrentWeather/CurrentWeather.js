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
  faSubway
} from "@fortawesome/free-solid-svg-icons";
import "./CurrentWeather.css"

//component for current weather + associated data
export const CurrentWeather = ({
  current,
  alert,
  day,
  bgColor,
  location,
  unit
}) => {
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
    <WindData data={current} unit={unit} />,
    <DescriptionText
      text={`Humidity: ${Math.round(current.humidity * 100)}%`}
    />
  ];

  if (transitAlerts.length !== 0) {
    const multiLine = (
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>TTC alert:</li>
        {transitAlerts.map(alert => (
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
    // console.log(alert.uri);
    const output = <a href={alert.uri}>{alert.title}</a>;
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
            style={{ borderColor: bgColor }}
          >
            <FontAwesomeIcon icon={faSubway} style={{ color: bgColor }} />
          </div>
        )}
      </div>
      <div className="Weather-Details" style={{ height: "100px" }}>
        {weatherData[index]}
      </div>
    </div>
  );
};
