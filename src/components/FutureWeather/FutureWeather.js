import React from "react";
import { TempDisplay } from "../TempDisplay/TempDisplay";
import moment from "moment";
import { tempConvert } from "../../scripts/conversions.js";
import { DescriptionText } from "../DescriptionText/DescriptionText";
import { weatherIconPicker } from "../../scripts/icons.js";
import { PrecipChance } from "../PrecipChance/PrecipChance";
import { WindData } from "../WindData/WindData";
import "./FutureWeather.css";

//component for single day future weather
export const FutureWeather = ({ day, unit }) => {
  const [index, setIndex] = React.useState(0);

  const weatherData = [
    <TempDisplay text={moment.unix(day.dt).format("dddd")}>
      <span>{tempConvert(day.temp.day, unit)}</span>
      <span className="Weather-LowTemp">
        {tempConvert(day.temp.night, unit)}
      </span>
    </TempDisplay>,
    <DescriptionText text={day.weather[0].description[0].toUpperCase()+day.weather[0].description.slice(1)} />,
    <PrecipChance data={day} />,
    <WindData data={day} unit={unit} />,
    <DescriptionText text={`Humidity: ${Math.round(day.humidity)}%`} />
  ];

  return (
    <div
      className="FutureWeather"
      onMouseLeave={() => setIndex(0)}
      onClick={() => setIndex((index + 1) % weatherData.length)}
    >
      <div className="Weather-Icon Future">
        <img
          src={weatherIconPicker(day.weather[0].icon)}
          alt={"icon-"+day.weather[0].icon}
        />
      </div>
      <div style={{ height: "60px" }}>{weatherData[index]}</div>
    </div>
  );
};
