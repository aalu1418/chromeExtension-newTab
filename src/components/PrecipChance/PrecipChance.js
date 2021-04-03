import React from "react";
import { weatherIconPicker } from "../../scripts/icons.js";
import "./PrecipChance.css";

//component for precipitation chance data
export const PrecipChance = ({ data }) => {
  let precipType = (data.rain || 0) > (data.snow || 0) ? "rain" : "snow";

  const icon = data.precipType
    ? weatherIconPicker(data.precipType, null, "", "")
    : "wi-cloud";
  return (
    <span className="Weather-TempDisplay">
      <i className={`wi ${icon}`} />
      {(data.rain > 0 || data.snow > 0) && (
        <div className="Weather-Display-SmallText">
          {Math.round(Number(data.pop) * 100) + "% of " + precipType}
        </div>
      )}
      {(!data.rain && !data.snow) && (
        <div className="Weather-Display-SmallText">{"0% of precipation"}</div>
      )}
    </span>
  );
};
