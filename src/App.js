import React from "react";
import Color from "color";
import Clock from "./components/Clock";
import Weather from "./components/Weather";
import IconsAndButtons from "./components/IconsAndButtons";
import "./App.css";
import { readLocalStorage } from "./components/updateLocalStorage"

const App = () => {
  const [backgroundColor, setBackgroundColor] = React.useState(readLocalStorage('color') || "black");
  const color = Color(backgroundColor).isDark() ? "white" : "black";
  const [screen, setScreen] = React.useState(false)
  const screenState = {screen, setScreen}

  return (
    <div className="App">
      <div className="App-Content" style={{ backgroundColor, color }}>
        <Clock screenState={screenState}/>
        {!screen && <Weather />}
        {!screen && <IconsAndButtons
          color={backgroundColor}
          setColor={setBackgroundColor}
          fontColor={color}
        />}
      </div>
    </div>
  );
};

export default App;
