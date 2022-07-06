# Chrome Extension: New Page + Time + Weather + TTC updates

A small personal project to create a Google Chrome extension for a new tab page with weather

## [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/designed-in-etch-a-sketch.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/uses-css.svg)](https://forthebadge.com)

### Powered by:

Weather: [NOAA](https://www.weather.gov/documentation/services-web-api)  
Location: [IPAPI](https://ipapi.co/)  
Icons: [@erikflowers/weather-icons](https://github.com/erikflowers/weather-icons)

---

### Application Views:

Check out the hosted link!

---

### Functionality:

Originally inspired by [Currently Chrome Extension](https://chrome.google.com/webstore/detail/currently/ojhmphdkpgbibohbnpbfiefkgieacjmh?hl=en)

But simpler, more stripped down and customizable.

- Weather (with hourly forecast)

Future improvements:

- Weather alerts
- manually configured location
- .crx file built in CI

---

### Building Extension

Note: The original purpose of this project was to customize a home screen - not for large scale deployment/distribution. Please use the various APIs according to policies specified. The purpose of this document is to simply relay how to deploy this extension on a personal platform.

Instructions:

1. `git clone https://github.com/aalu1418/chromeExtension-newTab`
1. In Google Chrome, go to `chrome://extensions` and enable `Developer mode`
1. Select `Pack extension` and browse to the `Extension root directory`
1. Select `Pack extension` and two files will be generated `build.crx` and `build.pem`

### Installing Extension

(note: make sure `Developer mode` is enabled)

1. From your file browser, click and drag `build.crx` onto the `chrome://extensions` page and install the extension
