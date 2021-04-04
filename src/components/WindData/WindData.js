import React from "react";
import { speedConvert } from "../../scripts/conversions.js";
import "./WindData.css";

export const WindData = ({ data, unit }) => {
  return (
    <span className="Weather-TempDisplay">
      <span>
        <div className="Weather-Display-SmallText">
          Wind: {speedConvert(data.wind_speed, unit)}
        </div>
      </span>
    </span>
  );
};
