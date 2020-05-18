import React from "react";
import { speedConvert } from "../../scripts/conversions.js";
import { weatherIcons } from "../../scripts/icons.js";
import "./WindData.css";

export const WindData = ({ data, unit }) => {
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
          <div className="Weather-Display-SmallText">
            {speedConvert(data.windSpeed, unit)}
          </div>
          <div className="Weather-Display-SmallText">{`${speedConvert(
            data.windGust,
            unit
          )} (gusts)`}</div>
        </span>
      )}
    </span>
  );
};
