// behold: My Api Keys
let weatherAPIKey = "8375474e12a3c07e327029469afe5cd7";
let youtubeAPIKey = "AIzaSyAT2zEb0Dq2h6mvWjv2FwkhThxQ6oGewG0";
// let youtubeAPIKey = "AIzaSyB5YPkFZ4pig1XlwG-Wipon_eK2IGNIIH8";
// let youtubeAPIKey = "AIzaSyC5_FFRE6UH2JrtDt6KPpr8qKVZ_f2VSjo";

//declaring empty global variables for use in too many functions 
let lat, lon, name, city, width, j, youtubeGet;

//declaring these globally because setInterval doesnt like it when you feed functions paramareters >:|
let forecast, timezone;
let i = 0;

//checks for browser width, if less than 780 sets youtube size to full width, otherwise tops out at 780
if($(window).width() < 780){
  width = $(window).width();
}else {
  width = 780;
}
//keeps the youtube height 16:9 to the width
let height = width/560 * 315;

//checks if user has localStorage, if so reassigns name and lat/lon values
if(localStorage.getItem("buddy.weather") !== null){
  let cords = JSON.parse(localStorage.getItem("buddy.weather"));
  name = JSON.parse(localStorage.getItem("buddy.name"));
  lat = cords[0];
  lon = cords[1];
  weather();
} else{
  getLocation();
  $('#starterModal').modal('show');
}

$(".settings").on("click", function(){  
  $('#starterModal').modal('show');
})


//checks if user entered a name and allowed location services
function checkStatus(){
  if($("#name").val() !== undefined){    
    name = $("#name").val();
  } else{
    name = "Friend";
  }
  localStorage.setItem("buddy.name", JSON.stringify(name));
  if(localStorage.getItem("buddy.weather") !== null){
    weather();
  }else{
    $('#backupModal').modal('show');
    }
}
//manual location entry and weather call
function saveLoc(){
  city = $("#city").val();
  weatherCity();
}

//starts location services
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
    localStorage.setItem("buddy.weather", JSON.stringify([lat,lon])); 
  }

//weather call with City Name, to get lat and lon, also format name
function weatherCity(){
  let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid="+ weatherAPIKey;
    $.ajax({
      url: queryURL,
      method: "GET"
  }).then(function(response) {
    city = response.name;
    lat = response.coord.lat;
    lon = response.coord.lon; 
    localStorage.setItem("buddy.weather", JSON.stringify([lat,lon])); 
    weather();
})}

//starts api call with scrapped lat and lon
function weather(){
    let queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&cnt=6&appid="+ weatherAPIKey + "&units=imperial";
    $.ajax({
      url: queryURL,
      method: "GET"
  }).then(function(response) {
    //defines description based on open weather's description system
    let desc = response.current.weather[0].description;
    $(".weather").html("");
    $(".weather").append(`<img src="https://openweathermap.org/img/w/${response.current.weather[0].icon}.png" alt="weather">`)
    //checking if its a nice day (right now entirely based on the description)
    $("#welcome").html("");
    if(desc === "clear sky" || desc === "few clouds" || desc === "scattered clouds"){      
      $("#welcome").append(`<p>Hey ${name}! I noticed the weather in your local area was
      ${desc}.</p><p>That sounds nice! Lets keep those good vibes up with nice sounds!<p>
      <p>CLICK THE VIDEO BELOW! </p>`)
      //feeds the youtube function with a search for bird sounds (can be changed to whatever, will discuss)
       youtube("bird sounds");
    } else{      
      $("#welcome").append(`<p>Hey ${name}! I noticed the weather in your local area was ${desc}. </p><p>It might be unpleasant! 
      So let’s take a trip to the Bahamas where it’s nice & warm!<p>`)
      youtube("bahamas");
    }
    //define city if undefined
    if(city === undefined){
      city = "lat: " + lat.toFixed(1) + ", lon:" + lon.toFixed(1);
      console.log(city);
    }    
    //defines forecast, timezone and i for use in weatherWidget()
    forecast = response.daily;
    console.log(forecast);
    timezone = response.timezone;    
    i = 0;
    //start forecast bug
    weatherWidget();
    //keep forecast bug going
    setInterval(weatherWidget, 10000);    
  })
  }

  function weatherWidget(){
    {
      //date formatting for forecast bug
      let day = moment.unix(forecast[i].dt).format("dd");
      let date = moment.unix(forecast[i].dt).format("MM/DD/YY | hA")
      let temp = forecast[i].temp.max;       
      console.log(day, date, temp);
      //clears then inserts new forecast bug info, then increments i or resets to 0 based on forecast array
      $(".weatherWidget").html("").hide().fadeIn(1000);
      $(".weatherWidget").append(`<span id="dayOfWeek">${day}</span> <img src="https://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png" width="24px" heigh="24px"> ${city}, ${temp}°F
        ${date}`);
      if(i < forecast.length - 1){
        i++;
      } else{
        i = 0;
      }        
    }
  }
  

  function youtube(input){
    //start of youtube API call with both videoEmbeddable and videoLicense set to avoid unembeddable videos, gets 50 videos as response based on search term (input)
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
      youtubeGet = response;
      //gens a random number 0-49
      j = Math.floor(Math.random() * 50);
      //clears then inserts video based on the random number in relation to its order in the results
      $(".videoContainer").html("");      
      $(".videoContainer").append(`<iframe id="video" width="${width}" height="${height}"
      src="https://www.youtube-nocookie.com/embed/${youtubeGet.items[j].id.videoId}?controls=0&enablejsapi=1&html5=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
      
      onYouTubePlayerAPIReady();
      })}




//the following was shamelessly stolen from https://codepen.io/AmrSubZero/pen/oLOYrA
    
// global variable for the player
let player;


// Inject YouTube API script
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
    // create the global player from the specific iframe (#video)
    player = new YT.Player('video', {
        events: {
            // call this function when player is ready to use
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {

    // bind events
    let playButton = document.getElementById("play-button");
    playButton.addEventListener("click", function() {
        player.playVideo();
    });

    let pauseButton = document.getElementById("pause-button");
    pauseButton.addEventListener("click", function() {
        player.pauseVideo();
    });

    let prevButton = document.getElementById("prev-button");
    prevButton.addEventListener("click", function() {
      console.log("this");
      if(j > 0){
        j--;
      } else{
        j = 49;
      }
        seriesOfTubes(j);
    });
  let nextButton = document.getElementById("next-button");
    nextButton.addEventListener("click", function() {
      if(j < 49){
        j++;
      } else{
        j = 0;
      }
        seriesOfTubes(j);
    });

}

function seriesOfTubes(j){
  $(".videoContainer").html("");      
      $(".videoContainer").append(`<iframe id="video" width="${width}" height="${height}"
      src="https://www.youtube-nocookie.com/embed/${youtubeGet.items[j].id.videoId}?controls=0&enablejsapi=1&html5=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
      
      onYouTubePlayerAPIReady();
}




