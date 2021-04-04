import React from "react";
import moment from "moment";
import { CurrentWeather } from "../CurrentWeather/CurrentWeather";
import { FutureWeather } from "../FutureWeather/FutureWeather";
import "./WeatherDisplay.css";

//component for entire weather forecast
export const WeatherDisplay = ({
  current,
  future,
  alert,
  bgColor,
  location,
  unit
}) => {
  return (
    <div className="WeatherDisplay">
      {current && (
        <CurrentWeather
          current={current}
          alert={alert}
          day={future[0]}
          bgColor={bgColor}
          location={location}
          unit={unit}
        />
      )}
      {future &&
        future.map(day => (
          <FutureWeather
            key={moment.unix(day.dt).format("dddd")}
            day={day}
            unit={unit}
          />
        ))}
    </div>
  );
};

export default WeatherDisplay;
