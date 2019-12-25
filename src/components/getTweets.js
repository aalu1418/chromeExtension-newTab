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
