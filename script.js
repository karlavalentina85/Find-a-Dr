$(document).ready(function() {
 
    //method that hides the weather div
    $("#weather").hide();

    //method that hides the ER address div
    $("#addr").hide();

    //method that empties the city search text box
    $("#city-search").empty();

    //represents search button, city text box, and states drop down list
    var search=$('#searchBtn');
    var citySearch=$('#city-search');
    var states=$('#states');

    //global variables to represent what user enters for city and chooses for state
    var chosenState="";
    var chosenCity="";

    //global variables that represent latitude and longitude
    var longitude;
    var latitude;
    
    //when user clicks search button, this happens
    search.on('click', function() {
        event.preventDefault();

        //Stores the city they entered in the variable chosenCity
        chosenCity=citySearch.val();
        //Stores the state they selected in the variable chosenState
        chosenState=states.val();

        //Calls the function that get the latitude and longitude for the city and state they selected
        getLatLon(chosenCity,chosenState);

        //methods that show the weather and ER address divs
        $("#weather").show();
        $("#addr").show();

    });

//Gets all weather relate info for a city based on lat and longitude
var searchAllApi = function(lat,lon,city) {
    //API that gets the current day's weather info
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=3d2eba2899ca96d0744357d56d76b302";

    $.ajax({
            url: queryURL,
            method: "GET"
    }).then(function(response) {
     
            //represents current day weather info in json format
            var day1obj=response.daily[0];

            //represents the image icon for that particular
            var day1icon = day1obj.weather[0].icon + ".png";
           
            //Build URL to images of weather
            var day1iconurl = "http://openweathermap.org/img/wn/" + day1icon;

            //Using goodDate function I created, Changes unix time into human readable dates
            var day1Date=goodDate(day1obj.dt).substring(0,9);
           
            //Using kelvinToFahrenheit function I created, turns kelvin temp into fahrenheit
            var day1temp=kelvinToFahrenheit(day1obj.temp.max);

            //represents humidity
            var day1humidity=day1obj.humidity;
           
            //Empty weather details div everytime this is run to avoid repitition of weather details
            $("#weather-details").empty();

            //Append current date
            $("#weather-details").append(day1Date);
           
            //Then append image of weather
            $("#weather-details").append("<br><img src='" + day1iconurl + "'>");
           
            //Then current temp
            $("#weather-details").append("<br>" + day1temp + " F");
           
            //Then humidity
            $("#weather-details").append("<br>" + day1humidity + "% humidity");
           
    });
};

//Function that returns fahrenheit from kelvin
function kelvinToFahrenheit(kel) {
    var fahr = 1.8 * (kel - 273) + 32;
    return fahr.toFixed(1);
}

//Function that turns unixtime into human readable format
function goodDate(dt) {
    var unixTimeStamp = dt;
    var timestampInMilliSeconds = unixTimeStamp*1000;
    var date = new Date(timestampInMilliSeconds);
    var formattedDate = date.toLocaleString();

    return (formattedDate);
}

//This function gets the latitude and longitude of the city, state the user enters
//Lat and Lon are needed to get weather and ERs nearby
var getLatLon = function(city,state) {

    //Geocode Google API call
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=+" + city + ",+" + state + "&key=AIzaSyCq8CpXSjioQzaWSpOfQLlvHJMwv7Kh-Ko";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        //global variables used to store latitude and longitude in these variables   
         longitude=response.results[0].geometry.location.lng;
         latitude=response.results[0].geometry.location.lat;
        
         //Calls function that gets weather info and prints it out to page
         searchAllApi(latitude,longitude,city);

         //Calls function that gets ERs nearby and prints it out to page
         erSearch(latitude,longitude,city);
        });
    };
    
//Function that returns ERs nearby
var erSearch = function(lat,lon) {
    $("#addresses").empty();
    //API for Places Nearby from Google
    //Had to use proxy server because Browsers can't call directly places API from google (I don't understand this that well, but it works)
    var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lon + "&radius=50000&keyword=emergency%20room&key=AIzaSyCq8CpXSjioQzaWSpOfQLlvHJMwv7Kh-Ko";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {   
        //Appends the results for the API search for Emergency rooms nearby a latitude and longitude
        $("#addresses").append("<h5>ERs in " + chosenCity + ", " + chosenState + "</h5>");

        //This loop goes through ER results and prints them out 1 by 1
        for (var i = 0; i < response.results.length; i++) {
            $("#addresses").append("<li>" + response.results[i].name + "," + response.results[i].vicinity + "</li>");
        }
    });
  };


});

