import cheerio from "cheerio";
import moment from "moment";

const corsProxy = "http://api.allorigins.win/raw?url=";

export const ttcAlerts = async () => {
  console.log("checking TTC alerts");
  const alerts = await getAlerts();
  const filteredAlerts = filterAlerts(alerts);

  return filteredAlerts;
};

const getAlerts = async () => {
  const searchUrl =
    "http://www.ttc.ca/Service_Advisories/all_service_alerts.jsp";
  const response = await fetch(corsProxy + searchUrl); // fetch page

  const htmlString = await response.text();

  // console.log(htmlString);
  const $ = cheerio.load(htmlString);
  return $("div.alert-content")
    .map((i, elem) => $(elem).text())
    .get();
};

const filterAlerts = alerts => {
  //filter out general alerts
  alerts = alerts.slice(0, -1).filter(alert => alert.split(": ").length >= 2); //handles if there are multiple ": " in text

  //split alerts into transit, alert, and time
  alerts = alerts.map(alert => {
    const main_components = alert.split(": ");
    const secondary_components = main_components
      .slice(1)
      .join(": ")
      .split("Last updated "); //handles if there are multiple ": " in text
    return {
      transit: main_components[0],
      alert: secondary_components[0],
      time: moment(secondary_components[1], ["MMM DD, H:mm A", "H:mm A"]).format("X")
    };
  });

  alerts = alerts.filter(alert => !alert.alert.includes("Elevator")); //filter out elevator alerts
  const streetcarAlerts = alerts
    .filter(
      alert =>
        alert.transit[0] === "5" &&
        (alert.transit.split(" ")[0].length === 3 ||
          alert.transit.split(" ")[0].length === 4) &&
        Number(alert.transit.split(" ")[0].slice(0, 3))
    )
    .filter(alert => !alert.alert.includes("Regular"));
  const subwayAlerts = alerts
    .filter(
      alert =>
        alert.transit.split(" ")[0] === "Line" &&
        alert.transit.split(" ").length >= 2
    )
    .filter(alert => !alert.alert.includes("Regular"));
  const extraAlerts = alerts
    .filter(alert => alert.transit.includes("Attention Customers"))
    .filter(
      alert =>
        alert.alert.includes("Line") ||
        (alert.transit[0] === "5" &&
          (alert.transit.split(" ")[0].length === 3 ||
            alert.transit.split(" ")[0].length === 4) &&
          Number(alert.transit.split(" ")[0].slice(0, 3)))
    )
    .filter(alert => !alert.alert.includes("Regular"));

  const filteredAlerts = [...streetcarAlerts, ...subwayAlerts, ...extraAlerts];

  // remove alerts that are older than 2 days
  const timeFiltered = filteredAlerts.filter(obj => moment().diff(moment.unix(obj.time), 'days') < 2)

  //https://codeburst.io/javascript-array-distinct-5edc93501dc4
  //use distinct values in array
  const outputAlerts = [...new Set(timeFiltered.map(alert => alert.transit))];

  return { alerts, filteredAlerts, timeFiltered, outputAlerts };
};
