fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Belgium%2C%20Lierde?unitGroup=metric&include=current%2Cdays%2Chours%2Calerts%2Cevents&key=QPC4KTE9Q544W9S65UMYUN9R8&contentType=json", {
  "method": "GET",
  "headers": {
  }
  })
.then(response => {
  console.log(response);
})
.catch(err => {
  console.error(err);
});
