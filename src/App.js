import React from "react";
import Color from "color";
import Clock from "./components/Clock";
import Weather from "./components/Weather";
import IconsAndButtons from "./components/IconsAndButtons";
import "./App.css";

const App = () => {
  const [backgroundColor, setBackgroundColor] = React.useState(localStorage.getItem('color') || "black");
  const color = Color(backgroundColor).isDark() ? "white" : "black";

  return (
    <div className="App">
      <div className="App-Content" style={{ backgroundColor, color }}>
        <Clock />
        <Weather />
        <IconsAndButtons
          color={backgroundColor}
          setColor={setBackgroundColor}
          fontColor={color}
        />
      </div>
    </div>
  );
};

export default App;
