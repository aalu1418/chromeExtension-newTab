import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { TwitterPicker } from "react-color";
import "./IconsAndButtons.css";
import darkSkyWhite from "../images/darkskylogo-white.png";
import darkSkyBlack from "../images/darkskylogo-black.png";
import locationIQ from "../images/locationiq-logo.png";
import catGif from "../images/pusheen.gif";

const IconsAndButtons = ({ color, setColor, fontColor }) => {
  const [openSettings, setOpenSettings] = React.useState(false);
  const style = openSettings
    ? { border: "2px solid", backgroundColor: "inherit", height: "13rem" }
    : {};

  return (
    <div className="IconsAndButtons" style={style} tabIndex="0">
      <Settings
        state={openSettings}
        onClick={() => setOpenSettings(!openSettings)}
      />
      {openSettings && <Logos state={openSettings} fontColor={fontColor} />}
      {openSettings && (
        <TwitterPicker
          triangle="hide"
          color={color}
          onChange={(color, event) => {
            localStorage.setItem("color", color.hex);
            setColor(color.hex);
          }}
        />
      )}
      {openSettings && <CatGif state={openSettings} />}
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
          src={fontColor === "black" ? darkSkyBlack : darkSkyWhite}
          alt="dark sky logo"
        />
      </a>
      <a href="https://locationiq.com/">
        <img
          className="Logos-Icon"
          style={{ filter: "grayscale(100%)" }}
          src={locationIQ}
          alt="locationIQ logo"
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
