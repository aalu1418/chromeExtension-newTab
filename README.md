# presto-tab
A google chrome extension with time/date, weather powered by Dark Sky, and ~~Presto card balance~~

---
How to build a chrome extension (new tab page):  
- https://medium.com/javascript-in-plain-english/https-medium-com-javascript-in-plain-english-how-to-build-a-simple-chrome-extension-in-vanilla-javascript-e52b2994aeeb
- https://medium.com/@gilfink/building-a-chrome-extension-using-react-c5bfe45aaf36
---
Things to include:  
- Time
	- [Moment JS](https://momentjs.com/)
- Weather
	- [Dark Sky API](https://darksky.net/dev/docs#forecast-request)
	- [geocoding](https://locationiq.com/)
- TTC Updates (twitter api?)
- ~~Presto Card Balance~~
	- ~~open a new window & scrape html from there:~~

	```Uncaught DOMException: Blocked a frame with origin "..." from accessing a cross-origin frame. at <anonymous>:1:23```

	- ~~[presto-card-js](https://github.com/bitbearstudio/presto-card-js)~~ - CORS errors
	- ~~[html scraping idea using requests](https://stackoverflow.com/questions/44269313/how-to-check-presto-card-balance-without-an-account-using-only-python-requests)~~ - too difficult to figure out their backend

---
Notes:
- [storing api keys](https://medium.com/better-programming/using-environment-variables-in-reactjs-9ad9c5322408)
- [cors-anywhere](https://cors-anywhere.herokuapp.com/) - [github](https://github.com/Rob--W/cors-anywhere)
