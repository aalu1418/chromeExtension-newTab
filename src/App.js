import React from "react";
import Clock from "./components/Clock"
import Weather from "./components/Weather"
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <div className="App-Content">
        <Clock />
        <Weather />
      </div>
    </div>
  );
};

export default App;
