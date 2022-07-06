$(document).ready(async () => {
  $(".weather").hide();

  try {
    let res = await checkInternet();
    console.debug(res);
  } catch (err) {
    console.error("internet/location not available", err);
    return;
  }

  $(".weather").show();
  $("#unavailable").hide();

  // add current weather
  $("#current-weather").html(currentWeather());

  // add hourly weather
  let hourlyHtml = "";
  for (let i = 0; i < 5; i++) {
    hourlyHtml += hourlyWeather(i);
  }
  $("#hourly-weather").html(hourlyHtml);
});

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

const hourlyWeather = (i) => {
  return `<div class="hourly">
    <div class="hourly-time">${i} PM</div>
    <img class="hourly-img" src="https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-day-snow-thunderstorm.svg"/>
    <div class="hourly-temp">80&deg;</div>
    </div>`;
};

const currentWeather = () => {
  return `<img class="current-img" src="https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-day-snow-thunderstorm.svg"/>
    <div class="current">
      <div class="current-temp">80&deg;</div>
      <div class="current-details">
        ${keyValue("Feels like", "80&deg")}
        ${keyValue("Precip %", "10%")}
        ${keyValue("Humidity", "80%")}
      </div>
    </div>`;
};

const keyValue = (key, value) => {
  return `<div class="current-detail">
    <div class="current-detail-key">${key}</div>
    <div class="current-detail-value">${value}</div>
  </div>`;
};
