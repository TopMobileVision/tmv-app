
const generate_row = (json_entry) => {
    return json_entry[0] == 'Yesterday' ? `<tr class="selected"><td><b>${json_entry[0]}</b><br>${json_entry[1]} bins</td></tr>` : `<tr><td>${json_entry[0]}<br>${json_entry[1]} bins</td></tr>` 
};

$.getJSON('./assets/json/lifts_list.json', json => {
    
    const rows = Object.entries(json.lifts).map(generate_row);
    // $('#list-table tbody').empty();
    $('#list-table tbody').append(rows);
});

/*function addPin(address) {

    var map = new google.maps.Map(document.getElementById('map'), { 
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        zoom: 6
    });

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
        'address': address
    }, 
    function(results, status) {
        if(status == google.maps.GeocoderStatus.OK) {
            const infowindow = new google.maps.InfoWindow({
                content: "My description of the bin.",
                maxWidth: 200,
            });
            new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                title: "Bin!"
            });
            marker.addListener("click", () => {
                infowindow.open(map, marker);
            });
            map.setCenter(results[0].geometry.location);
        }
    });
}*/

// addPin('235 W Philly Ave, Las Vegas, NV')