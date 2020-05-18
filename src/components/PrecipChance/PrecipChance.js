import React from "react";
import { weatherIconPicker } from "../../scripts/icons.js";
import "./PrecipChance.css";

//component for precipitation chance data
export const PrecipChance = ({ data }) => {
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
