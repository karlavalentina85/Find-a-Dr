$(document).ready(function() {
    var search=$('#searchBtn');
    var citySearch=$('#city-search');
    var chosenCity="";
    search.on('click', function() {
        event.preventDefault();
        chosenCity=citySearch.val();
    });
});