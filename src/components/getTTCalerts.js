// attempt at using the twitter api (but apparently the ttc protects their tweets)
// https://developer.twitter.com/en/docs/basics/authentication/oauth-2-0/application-only
// https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline
// 1. get bearer token
// 2. use bearer token to get user timeline
// const corsProxy = "https://cors-anywhere.herokuapp.com/";
//
// export const getBearerToken = () =>
//   new Promise(async resolve => {
//     const encoded = window.btoa(
//       window.encodeURIComponent(process.env.REACT_APP_TWITTER_KEY) +
//         ":" +
//         window.encodeURIComponent(process.env.REACT_APP_TWITTER_SECRET)
//     );
//
//     const response = await fetch(
//       corsProxy + "https://api.twitter.com/oauth2/token",
//       {
//         method: "POST", // *GET, POST, PUT, DELETE, etc.
//         headers: {
//           // 'Content-Type': 'application/json'
//           Authorization: "Basic " + encoded,
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
//         },
//         body: "grant_type=client_credentials"
//       }
//     );
//     const tokenInfo = await response.json();
//
//     resolve(tokenInfo.access_token);
//   });
//
// export const getUserTimeline = async () => {
//   const bearerToken = await getBearerToken();
//   const response = await fetch(
//     corsProxy +
//       "https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=TTCnotices&count=2",
//       // "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=twitterapi&count=2",
//       // "https://api.twitter.com/1.1/statuses/home_timeline.json?count=2",
//     {
//       headers: {
//         Authorization: "Bearer " + bearerToken,
//       }
//     }
//   );
//   const tweetData = await response.json();
//   console.log(tweetData);
// };

import cheerio from "cheerio";
import moment from "moment";

const corsProxy = "https://cors-anywhere.herokuapp.com/";

export const ttcAlerts = async () => {
  console.log("checking TTC alerts");
  const alerts = await getAlerts();
  const filteredAlerts = filterAlerts(alerts);

  return filteredAlerts;
};

const getAlerts = async () => {
  const searchUrl =
    "https://www.ttc.ca/Service_Advisories/all_service_alerts.jsp";
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
        alert.transit.split(" ").length > 2
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
