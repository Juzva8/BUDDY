if(localStorage.getItem("weather") !== null){
  let cords = JSON.parse(localStorage.getItem("weather"));
  let lat = cords[0];
  let lon = cords[1];
} else{
  let lat, lon = "";
}
let weatherAPIKey = "8375474e12a3c07e327029469afe5cd7";
// let youtubeAPIKey = "AIzaSyAT2zEb0Dq2h6mvWjv2FwkhThxQ6oGewG0";
// let youtubeAPIKey = "AIzaSyB5YPkFZ4pig1XlwG-Wipon_eK2IGNIIH8";
let youtubeAPIKey = "AIzaSyC5_FFRE6UH2JrtDt6KPpr8qKVZ_f2VSjo";
let name = "Joe";
var width = $(window).width();
var height = width/560 * 315;
let i = 0;
let forecast, timezone;

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
    localStorage.setItem("weather", JSON.stringify([lat,lon]));
    weather();  
  }

function weather(){
    let queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&cnt=6&appid="+ weatherAPIKey + "&units=imperial";
    $.ajax({
      url: queryURL,
      method: "GET"
  }).then(function(response) {
    let desc = response.current.weather[0].description;
    $(".weather").append(`<img src="https://openweathermap.org/img/w/${response.current.weather[0].icon}.png" alt="weather">`)
    if(desc === "clear sky" || desc === "few clouds" || desc === "scattered clouds"){      
      $("#currentWeather").append(`<p>Hey ${name}! I noticed the weather in your local area was
      ${desc}.</p><p>That sounds nice! Lets keep those good vibes up with nice sounds!<p>
      <p>CLICK THE VIDEO BELOW! </p>`)
       youtube("bird sounds");
    } else{      
      $("#currentWeather").append(`<p>Hey ${name}! I noticed the weather in your local area was ${desc}. </p><p>It might be unpleasant! 
      So let’s take a trip to the Bahamas where it’s nice & warm!<p>`)
      youtube("bahamas");
    }    
    forecast = response.daily;
    timezone = response.timezone;
    i = 0;
    weatherWidget();
    setInterval(weatherWidget, 10000);    
  })
  }

  function weatherWidget(){
    {
      let day = moment.unix(forecast[i].dt).format("dd");
      let date = moment.unix(forecast[i].dt).format("MM/DD.YY | hA")
      let temp = forecast[i].temp.max;       
      console.log(day, date, temp);
      $(".weatherWidget").html("");
      $(".weatherWidget").append(`${day} <img src="https://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png" width="20px" heigh="20px"> ${timezone}, ${temp}°F
        ${date}`);
      if(i < forecast.length - 1){
        i++;
      } else{
        i = 0;
      }        
    }
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
            videoLicense: "creativeCommon"
        },
    }).then(function(response) {
      let i = Math.floor(Math.random() * 50);
      $(".videoContainer").html("");      
      $(".videoContainer").append(`<iframe width="${width}" height="${height}"
      src="https://www.youtube-nocookie.com/embed/${response.items[i].id.videoId}?controls=0&autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
      })}

