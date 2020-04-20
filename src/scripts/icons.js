//weather icons
export const weatherIcons = {
  "clear-day": "wi-day-sunny",
  "clear-night": "wi-night-clear",
  rain: "wi-rain",
  snow: "wi-snow",
  sleet: "wi-sleet",
  wind: "wi-strong-wind",
  fog: "wi-fog",
  cloudy: "wi-cloudy",
  "partly-cloudy-day": "wi-day-sunny-overcast",
  "partly-cloudy-night": "wi-night-alt-cloudy",
  hail: "wi-hail",
  thunderstorm: "wi-thunderstorm",
  tornado: "wi-tornado",
  windDirection: "wi-wind-default"
};

//algorithm to pick icons based on time & precipitation time
export const weatherIconPicker = (icon, time, sunrise, sunset) => {
  const modifiableWeather = [
    "rain",
    "snow",
    "sleet",
    "cloudy",
    "hail",
    "thunderstorm"
  ];
  if (!modifiableWeather.includes(icon) || !time) {
    return weatherIcons[icon];
  } else {
    const stringArray = weatherIcons[icon].split("-");
    const dayTime = time > sunrise && time < sunset;
    const timeModifier = dayTime ? "day" : "night-alt";
    stringArray.splice(1, 0, timeModifier);
    // console.log(dayTime, stringArray.join("-"));
    return stringArray.join("-");
  }
};
