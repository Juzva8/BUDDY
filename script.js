let lat, lon = "";
let weatherAPIKey = "8375474e12a3c07e327029469afe5cd7";
let youtubeAPIKey = "AIzaSyAT2zEb0Dq2h6mvWjv2FwkhThxQ6oGewG0";


function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      
    } else{
        console.log("geolocation not supported")
    }
  }
  function showPosition(position) {
    // Grab coordinates from the given object
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log("Your coordinates are Latitude: " + lat + " Longitude " + lon);
  }

function weather(){
    let queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=daily,minutely,hourly,alerts&cnt=6&appid="+ weatherAPIKey + "&units=imperial";
    $.ajax({
      url: queryURL,
      method: "GET"
  }).then(function(response) {
    let desc = response.current.weather[0].description;
    if(desc === "clear sky" || desc === "few clouds" || desc === "scattered clouds"){
        youtube("happy music");
    } else{
        youtube("sad");
    }
  })
  }

  getLocation();

  function youtube(input){
      let queryURL  = "https://www.googleapis.com/youtube/v3/search";
      $.ajax({
        url: queryURL,
        method: "GET",
        data: {
            key: youtubeAPIKey,
            q: input,
            part: "snippet",
            maxResults: 50,
            type: "video",
            videoEmbeddable: true,
        },
    }).then(function(response) {
      console.log(response);
      let i = Math.floor(Math.random() * 50);
      console.log(i);
      $(".videoContainer").html("");
      $(".videoContainer").append(`<iframe width="560" height="315"
      src="https://www.youtube.com/embed/${response.items[i].id.videoId}?&autoplay=1"frameborder="0" 
      allowfullscreen></iframe>`);
      })}