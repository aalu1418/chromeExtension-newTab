import React from "react";
import { TempDisplay } from "../TempDisplay/TempDisplay";
import moment from "moment";
import { tempConvert } from "../../scripts/conversions.js";
import { DescriptionText } from "../DescriptionText/DescriptionText";
import { weatherIconPicker } from "../../scripts/icons.js";
import { PrecipChance } from "../PrecipChance/PrecipChance";
import { WindData } from "../WindData/WindData";
import { MoonData } from "../MoonData/MoonData";
import "./FutureWeather.css";

//component for single day future weather
export const FutureWeather = ({ day, unit }) => {
  const [index, setIndex] = React.useState(0);

  const weatherData = [
    <TempDisplay text={moment.unix(day.time).format("dddd")}>
      <span>{tempConvert(day.temperatureHigh, unit)}</span>
      <span className="Weather-LowTemp">
        {tempConvert(day.temperatureLow, unit)}
      </span>
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
