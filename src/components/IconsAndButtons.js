import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import "./IconsAndButtons.css";
import darkSky from "../images/darkskylogo.png";
import locationIQ from "../images/locationiq-logo.png";
import catGif from "../images/pusheen.gif";

const IconsAndButtons = () => {
  const [openSettings, setOpenSettings] = React.useState(false);
  const style = openSettings
    ? { border: "2px solid", backgroundColor: "inherit", height: "13rem" }
    : {};

  return (
    <div
      className="IconsAndButtons"
      style={style}
      onMouseLeave={() => setOpenSettings(false)}
    >
      <Settings
        state={openSettings}
        onClick={() => setOpenSettings(!openSettings)}
      />
      {openSettings && <Logos state={openSettings} />}
      {openSettings && <CatGif state={openSettings} />}
    </div>
  );
};

export default IconsAndButtons;

const Settings = ({ onClick }) => {
  return (
    <div className="Settings">
      <FontAwesomeIcon
        className="Settings-Icon"
        icon={faCog}
        onClick={onClick}
      />
    </div>
  );
};

const Logos = () => {
  return (
    <div className="Logos">
      <a href="https://github.com/aalu1418/chromeExtension-newTab">
        <FontAwesomeIcon className="Logos-Icon" icon={faGithub} />
      </a>
      <a href="https://darksky.net/poweredby/">
        <img className="Logos-Icon" src={darkSky} alt="dark sky logo" />
      </a>
      <a href="https://locationiq.com/">
        <img className="Logos-Icon" src={locationIQ} alt="locationIQ logo" />
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
