$(document).ready(function() {
    var search=$('#searchBtn');
    var citySearch=$('#city-search');
    var chosenCity="";
    search.on('click', function() {
        event.preventDefault();
        chosenCity=citySearch.val();
    });
});

$(function (){
    
    var $information = $('#information');
       
    $.ajax({
        type: 'GET',
        url: "https://data.medicare.gov/resource/yv7e-xc69.json",
        success: function(information) {
            $.each(information, function(i, selectedinfo) {
                $information.append('<li>Hospital: ' + selectedinfo.hospital_name, 'Address ' + selectedinfo.city,' ' + selectedinfo.state, ' ' + selectedinfo.address, '</li>');
            });
        }
    });
   });    