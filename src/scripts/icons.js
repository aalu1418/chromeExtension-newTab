//weather icons
import clear from "../images/icons/01d@2x.png";
import fewClouds from "../images/icons/02d@2x.png";
import scatClouds from "../images/icons/03d@2x.png";
import brokClouds from "../images/icons/04d@2x.png";
import showerRain from "../images/icons/09d@2x.png";
import rain from "../images/icons/10d@2x.png";
import thunderstorm from "../images/icons/11d@2x.png";
import snow from "../images/icons/13d@2x.png";
import mist from "../images/icons/50d@2x.png";

const mapping = {
  "01": clear,
  "02": fewClouds,
  "03": scatClouds,
  "04": brokClouds,
  "09": showerRain,
  "10": rain,
  "11": thunderstorm,
  "13": snow,
  "50": mist,
};

//return the proper image based on code
export const weatherIconPicker = id => {
  return mapping[id.slice(0,2)]
}
