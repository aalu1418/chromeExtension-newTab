import React from "react";
import Color from "color";
import Clock from "./containers/Clock/Clock";
import Weather from "./containers/Weather/Weather";
import IconsAndButtons from "./containers/IconsAndButtons/IconsAndButtons";
import "./App.css";
import { readLocalStorage } from "./scripts/updateLocalStorage";

const App = () => {
  const [backgroundColor, setBackgroundColor] = React.useState();
  const color = Color(backgroundColor).isDark() ? "white" : "black";
  const [screen, setScreen] = React.useState(false);
  const screenState = { screen, setScreen };
  const [unit, setUnit] = React.useState(readLocalStorage("unit") || "si");
  const unitState = { unit, setUnit };

  React.useEffect(() => {
    setBackgroundColor(readLocalStorage("color") || "black");
  }, [])

  return (
    <div className="App">
      <div className="App-Content" style={{ backgroundColor, color }}>
        <Clock screenState={screenState} />
        {!screen && <Weather bgColor={backgroundColor} unit={unit} />}
        {!screen && (
          <IconsAndButtons
            color={backgroundColor}
            setColor={setBackgroundColor}
            fontColor={color}
            unit={unitState}
          />
        )}
      </div>
    </div>
  );
};

export default App;
