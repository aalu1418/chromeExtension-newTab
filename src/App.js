import React from "react";
import Clock from "./containers/Clock/Clock";
import Weather from "./containers/Weather/Weather";
import IconsAndButtons from "./containers/IconsAndButtons/IconsAndButtons";
import "./App.css";
import { readLocalStorage } from "./scripts/updateLocalStorage";

const App = () => {
  const [screen, setScreen] = React.useState(false);
  const screenState = { screen, setScreen };
  const [unit, setUnit] = React.useState(readLocalStorage("unit") || "si");
  const unitState = { unit, setUnit };

  return (
    <div className="App">
      <div className="App-Content" >
        <Clock screenState={screenState} />
        {!screen && <Weather unit={unit} />}
        {!screen && (
          <IconsAndButtons
            unit={unitState}
          />
        )}
      </div>
    </div>
  );
};

export default App;
