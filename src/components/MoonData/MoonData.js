import React from "react";
import "./MoonData.css";
import "../../../node_modules/weather-icons/css/weather-icons.css";

export const MoonData = ({ data }) => {
  data.moonPhase = data.moonPhase % 1; //eliminates edge case of 1
  let icon = [];

  console.log(data.moonPhase);
  switch (data.moonPhase) {
    case 0:
      icon.push("New");
      break;
    case 0.25:
      icon.push(..."First-Quarter".split("-"));
      break;
    case 0.5:
      icon.push("Full");
      break;
    case 0.75:
      icon.push(..."3rd-Quarter".split("-"));
      break;
    default:
      if (data.moonPhase < 0.5) {
        icon.push("Waxing");
      } else {
        icon.push("Waning");
      }

      if (data.moonPhase > 0.25 && data.moonPhase < 0.75) {
        icon.push("Gibbous");
      } else if (data.moonPhase < 0.25) {
        //handles a spelling error in package
        icon.push("Cresent");
      } else {
        icon.push("Crescent");
      }

      icon.push(Math.ceil((data.moonPhase % 0.25) / 0.04));
  }

  return (
    <span className="Weather-TempDisplay">
      <i className={`wi wi-moon-${icon.join("-").toLowerCase()}`} />
      {data.moonPhase !== undefined && (
        <span>
          <div className="Weather-Display-SmallText">
            {icon.length === 1 ? `${icon[0]} Moon` : icon.slice(0, 2).join(" ")}
          </div>
        </span>
      )}
    </span>
  );
};
