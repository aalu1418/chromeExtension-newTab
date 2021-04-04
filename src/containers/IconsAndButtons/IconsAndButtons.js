import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import "./IconsAndButtons.css";
import owm from "../../images/owm.png";
import { updateLocalStorage } from "../../scripts/updateLocalStorage";

const IconsAndButtons = ({ unit }) => {
  const [openSettings, setOpenSettings] = React.useState(false);
  const menuStyle = openSettings
    ? { border: "2px solid", backgroundColor: "black" }
    : {};

  const unitOnClick = (event) => {
    unit.setUnit(event.target.id);
    updateLocalStorage({ unit: event.target.id });
  };

  return (
    <div
      id="Frame"
      className={openSettings ? "Frame" : ""}
      onClick={(event) => {
        if (event.target.id === "Frame") {
          setOpenSettings(false);
        }
      }}
    >
      <div className="IconsAndButtons" style={menuStyle}>
        <Settings
          state={openSettings}
          onClick={() => setOpenSettings(!openSettings)}
        />
        {openSettings && <Logos state={openSettings} />}
        {openSettings && (
          <div className="IconsAndButtons-UnitToggle">
            <button
              className={`UnitToggle-Button ${
                unit.unit === "si" ? "Selected" : ""
              }`}
              id="si"
              onClick={unitOnClick}
            >
              Metric
            </button>
            <button
              className={`UnitToggle-Button ${
                unit.unit === "us" ? "Selected" : ""
              }`}
              id="us"
              onClick={unitOnClick}
            >
              Imperial
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IconsAndButtons;

const Settings = ({ state, onClick }) => {
  return (
    <div className="Settings">
      <FontAwesomeIcon
        className="Settings-Icon"
        icon={state ? faTimes : faCog}
        onClick={onClick}
      />
    </div>
  );
};

const Logos = () => {
  return (
    <div className="Logos">
      <a href="https://github.com/aalu1418/chromeExtension-newTab">
        <FontAwesomeIcon
          className="Logos-Icon"
          style={{ color: "white" }}
          icon={faGithub}
        />
      </a>
      <a href="https://openweathermap.org">
        <img className="Logos-Icon" src={owm} alt="owm logo" />
      </a>
      <a href="https://www.openstreetmap.org/copyright">
        © OpenStreetMap contributors
      </a>
    </div>
  );
};
