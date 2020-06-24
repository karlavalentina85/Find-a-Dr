$(document).ready(function() {
    $("#weather").hide();
    $("#addresses").hide();
    var search=$('#searchBtn');
    var citySearch=$('#city-search');
    var chosenCity="";
    var $information = $('#information');
    var stateDropdown = $('#states')
    var state = '';

    search.on('click', function() {
        event.preventDefault();
        chosenCity=citySearch.val();
        state=stateDropdown.val();
        searchCityCurrent(chosenCity);
        $("#weather").show();
        $("#addresses").show();
        $.ajax({
            type: 'GET',
            url: "https://data.medicare.gov/resource/yv7e-xc69.json?state=" + state + '&city=' + chosenCity.toUpperCase() + '&condition=Emergency%20Department' ,
            success: function(information) {
                $.each(information, function(i, selectedinfo) {
                    $information.append('<li>Hospital: ' + selectedinfo.hospital_name, 'Address ' + selectedinfo.city,' ' + selectedinfo.state, ' ' + selectedinfo.address, '</li>' );
                });
            }
        });
       }); 


    });

//Gets all weather relate info for a city based on lat and longitude
var searchAllApi = function(lat,lon,city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=3d2eba2899ca96d0744357d56d76b302";

    $.ajax({
            url: queryURL,
            method: "GET"
    }).then(function(response) {

            
            var day1obj=response.daily[0];

            var day1icon = day1obj.weather[0].icon + ".png";
            
            //Build URL to images of weather
            var day1iconurl = "http://openweathermap.org/img/wn/" + day1icon;
            
            //Changes unix time into human readable dates
            var day1Date=goodDate(day1obj.dt).substring(0,9);
            
            //Turns kelvin temp into fahrenheit
            var day1temp=kelvinToFahrenheit(day1obj.temp.max);
            
            var day1humidity=day1obj.humidity;
            
            //Beginning of building the 5 day forecast section
            $("#weather-details").empty();

            //Date first
            $("#weather-details").append(day1Date);
            
            //Then icon
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

//This function calls one api which returns the lat and long of a city which 
//is the input for the all api function
var searchCityCurrent = function(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=3d2eba2899ca96d0744357d56d76b302";
    $.ajax({
      url: queryURL,
      method: "GET",
      async: "false"
    }).then(function(response) {

            //Stores lat and long to be used to find weather info
            var lon=response.coord.lon;
            var lat=response.coord.lat;

            //Call function that creates all weather related parts of the page
            searchAllApi(lat,lon,city);    
                        
    });
};
    

   