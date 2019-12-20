import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { TwitterPicker } from "react-color";
import "./IconsAndButtons.css";
import darkSky from "../images/darkskylogo.png";
import locationIQ from "../images/locationiq-logo.png";
import catGif from "../images/pusheen.gif";
import { updateLocalStorage } from "./updateLocalStorage";

const IconsAndButtons = ({ color, setColor, fontColor }) => {
  const [openSettings, setOpenSettings] = React.useState(false);
  const menuStyle = openSettings
    ? { border: "2px solid", backgroundColor: color, height: "13rem" }
    : {};

  return (
    <div id="Frame" className={openSettings ? "Frame" : ""} onClick={event => {
        if (event.target.id === "Frame") {
          setOpenSettings(false)
        }
      }}>
      <div className="IconsAndButtons" style={menuStyle}>
        <Settings
          state={openSettings}
          onClick={() => setOpenSettings(!openSettings)}
        />
        {openSettings && <Logos state={openSettings} fontColor={fontColor} />}
        {openSettings && (
          <div className="IconsAndButtons-ColorPicker">
            <TwitterPicker
              triangle="hide"
              color={color}
              onChange={(color, event) => {
                updateLocalStorage({ color: color.hex });
                setColor(color.hex);
              }}
            />
          </div>
        )}
        {openSettings && <CatGif state={openSettings} />}
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

const Logos = ({ fontColor }) => {
  return (
    <div className="Logos">
      <a href="https://github.com/aalu1418/chromeExtension-newTab">
        <FontAwesomeIcon
          className="Logos-Icon"
          style={{ color: fontColor }}
          icon={faGithub}
        />
      </a>
      <a href="https://darksky.net/poweredby/">
        <img
          className="Logos-Icon"
          src={darkSky}
          alt="dark sky logo"
          style={{
            filter: `saturate(0) contrast(100) invert(${
              fontColor === "black" ? "0" : "100"
            })`
          }}
        />
      </a>
      <a href="https://locationiq.com/">
        <img
          className="Logos-Icon LocationIQ"
          src={locationIQ}
          alt="locationIQ logo"
          style={{
            filter: `saturate(0) contrast(100) invert(${
              fontColor === "black" ? "0" : "100"
            })`
          }}
        />
      </a>
    </div>
  );
};

const CatGif = () => {
  return (
    <div className="CatGif">
      <img src={catGif} alt="cat-gif" />
    </div>
  );
};
