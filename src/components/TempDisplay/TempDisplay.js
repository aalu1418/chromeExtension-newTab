import React from "react";
import "./TempDisplay.css";

//component for temperature data
export const TempDisplay = ({ text, textClass, children }) => {
  return (
    <span className="Weather-TempDisplay">
      <div className={textClass}>{text}</div>
      <div className="Weather-Temperature">{children}</div>
    </span>
  );
};
