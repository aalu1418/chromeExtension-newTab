import React from "react";
import "./MoonData.css";

export const MoonData = ({ data }) => {
  const specialPhaseCheck = [0, 0.25, 0.5, 0.75].includes(data.moonPhase);
  let icon = [];

  if (specialPhaseCheck) {
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
    }
  } else {
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

  //handles spelling error in package
  let iconString = icon;
  if (iconString.includes("Cresent")) {
    iconString[1] = "Crescent";
  }

  const description =
    iconString.length === 1
      ? `${iconString[0]} Moon`
      : iconString.slice(0, 2).join(" ");

  return (
    <span className="Weather-TempDisplay">
      <i className={`wi wi-moon-${icon.join("-").toLowerCase()}`} />
      {data.moonPhase && (
        <span>
          <div className="Weather-Display-SmallText">{description}</div>
        </span>
      )}
    </span>
  );
};
