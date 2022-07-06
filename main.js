const cacheName = "aalu1418/chromeExtension";

$(document).ready(async () => {
  $(".weather").hide();

  let weather;
  let refresh = true;
  let cache = localStorage.getItem(cacheName);
  if (cache != null) {
    console.debug("cache is present");
    const temp = JSON.parse(cache);
    weather = temp.data;
    refresh = Date.now() - temp.timestamp > 1000 * 60 * 15; // wait for 15 minute timeout
  } else {
    console.debug("cache is empty");
  }

  try {
    if (refresh) {
      console.log("refreshing data");
      let res = await checkInternet();
      console.debug(res);
      weather = await fetchWeather(res.longitude, res.latitude);
    }
  } catch (err) {
    console.error("internet/location/weather not available", err);
    return;
  }

  $(".weather").show();
  $("#unavailable").hide();

  console.debug(weather);
  localStorage.setItem(
    cacheName,
    JSON.stringify({
      timestamp: Date.now(),
      data: weather,
    })
  );

  // set tab data
  $("title").text(`${weather[0].temperature}\xB0 | New Tab`);

  // add current weather
  $("#current-weather").html(currentWeather(weather[0]));

  // add hourly weather
  let hourlyHtml = "";
  for (let i = 0; i < 5; i++) {
    hourlyHtml += hourlyWeather(weather[i + 1]);
  }
  $("#hourly-weather").html(hourlyHtml);
});

// check if internet connection is available + get longitude/latitude
const checkInternet = async () => {
  return new Promise(async (res, rej) => {
    try {
      let data = await $.get("https://ipapi.co/json");
      res(data);
    } catch (e) {
      rej(e);
    }
  });
};

// fetch weather information
const fetchWeather = (long, lat) => {
  return new Promise(async (res, rej) => {
    try {
      // get station URL
      let initdata = await $.get(
        `https://api.weather.gov/points/${lat},${long}`
      );
      console.debug(initdata);

      // get hourly forecast
      let data = await $.get(initdata.properties.forecastHourly);
      console.debug(data);
      let hourly = data.properties.periods;

      // get detailed forecast
      let detaildata = await $.get(initdata.properties.forecastGridData);
      console.debug(detaildata);

      // post process data
      const time = Date.now();
      let parsed = hourly.filter((v) => Date.parse(v.startTime) > time); // get data for after current time
      const current = hourly
        .filter((v) => Date.parse(v.startTime) <= time)
        .reverse()[0]; // get data for nearest hourly just before timestamp

      // parse data for current conditions
      current.feelsLike = CtoF(
        detaildata.properties.apparentTemperature.values.filter(
          (v) => Date.parse(v.validTime.split("/")[0]) >= time
        )[0].value
      );
      current.humidity = detaildata.properties.relativeHumidity.values.filter(
        (v) => Date.parse(v.validTime.split("/")[0]) >= time
      )[0].value;
      current.precip =
        detaildata.properties.probabilityOfPrecipitation.values.filter(
          (v) => Date.parse(v.validTime.split("/")[0]) >= time
        )[0].value;

      let output = [
        current,
        parsed[0],
        parsed[2],
        parsed[4],
        parsed[6],
        parsed[8],
      ];
      res(output);
    } catch (e) {
      rej(e);
    }
  });
};

const CtoF = (celsius) => {
  return (9 / 5) * celsius + 32;
};

// build hourly weather component
const hourlyWeather = (w) => {
  const d = new Date(w.startTime);
  let h = d.getHours() % 12;
  h = h ? h : 12;
  let suffix = d.getHours() >= 12 ? "PM" : "AM";

  return `<div class="hourly">
    <div class="hourly-time">${h} ${suffix}</div>
    <img class="hourly-img" src="${icon(w.isDaytime, w.icon)}" title="${w.shortForecast}"/>
    <div class="hourly-temp">${w.temperature}&deg;</div>
    </div>`;
};

// build current weather component
const currentWeather = (w) => {
  return `<img class="current-img" src="${icon(w.isDaytime, w.icon)}" title="${w.shortForecast}"/>
    <div class="current">
      <div class="current-temp">${w.temperature}&deg;</div>
      <div class="current-details">
        ${keyValue("Feels like", `${w.feelsLike}&deg;`)}
        ${keyValue("Precip %", `${w.precip}%`)}
        ${keyValue("Humidity", `${w.humidity}%`)}
        ${keyValue("Wind", `${w.windSpeed} ${w.windDirection}`)}
      </div>
    </div>`;
};

// build key/value pair component
const keyValue = (key, value) => {
  return `<div class="current-detail">
    <div class="current-detail-key">${key}</div>
    <div class="current-detail-value">${value}</div>
  </div>`;
};

const iconMap = {
  skc: ["day-sunny", "night-clear"],
  few: ["day-sunny-overcast", "night-alt-partly-cloudy"],
  sct: ["day-cloudy-high", "night-alt-cloudy-high"],
  bkn: ["day-cloudy", "night-alt-cloudy"],
  ovc: ["cloudy"],
  wind_skc: ["day-windy", "windy"],
  wind_few: ["day-cloudy-gusts", "night-alt-cloudy-gusts"],
  wind_sct: ["day-cloudy-gusts", "night-alt-cloudy-gusts"],
  wind_bkn: ["day-cloudy-gusts", "night-alt-cloudy-gusts"],
  wind_ovc: "cloudy-gusts",
  snow: ["day-snow", "night-alt-snow"],
  rain_snow: ["day-rain-mix", "night-alt-rain-mix"],
  rain_sleet: ["day-rain-mix", "night-alt-rain-mix"],
  snow_sleet: ["day-rain-mix", "night-alt-rain-mix"],
  fzra: ["day-rain-mix", "night-alt-rain-mix"],
  rain_fzra: ["day-rain-mix", "night-alt-rain-mix"],
  snow_fzra: ["day-rain-mix", "night-alt-rain-mix"],
  sleet: ["day-sleet", "night-alt-sleet"],
  rain: ["day-rain", "night-alt-rain"],
  rain_showers: ["day-showers", "night-alt-showers"],
  rain_showers_hi: ["day-showers", "night-alt-showers"],
  tsra: ["day-thunderstorm", "night-alt-thunderstorm"],
  tsra_sct: ["day-thunderstorm", "night-alt-thunderstorm"],
  tsra_hi: ["day-thunderstorm", "night-alt-thunderstorm"],
  tornado: ["tornado"],
  hurricane: ["hurricane"],
  tropical_storm: ["storm-showers"],
  dust: ["dust"],
  smoke: ["smoke"],
  haze: ["day-haze"],
  hot: ["hot"],
  cold: ["snowflake-cold"],
  blizzard: ["day-snow-wind", "night-alt-snow-wind"],
  fog: ["day-fog", "night-fog"],
};

const icon = (isDaytime, url) => {
  const key = Object.keys(iconMap).reduce((previous, current) => {
    return previous + (url.includes(current) ? current : "")
  }, "")

  let index = isDaytime ? 0 : 1
  index = iconMap[key].length == 2 ? index : 0

  console.debug(key, iconMap[key][index])  
  return `https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-${iconMap[key][index]}.svg`;
};
