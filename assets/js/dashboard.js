
const generate_day = (day, len) => {
    return day == 'Yesterday' ? `<tr class="selected"><td><b>${day}</b><br>${len} bins</td></tr>` : `<tr><td>${day}<br>${len} bins</td></tr>` 
};

$.getJSON('./assets/json/recent_lifts.json', days => {
    // $('#list-table tbody').empty();
    for (const day in days) {
        $('#list-table tbody').append(generate_day(day, Object.keys(days[day]).length));
    }


    // const rows = days.map(days);
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
                content: address + "10:37AM",
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

function addPin(lon, lat) {
    mapkit.init({
        authorizationCallback: function(done) {
            done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjgzQ1dGWjhQNjIifQ.eyJpc3MiOiI1VkdLUDJRVjZIIiwiaWF0IjoxNjE2OTA0NzYzLCJleHAiOjE2MTk1ODMxNjN9.nME9bxXIl3eE1-43BVKu7XmZAyRGfAZGhOOhiIL-mnuyJu2gLq_9vxQQ-Jjly-KUtWAArs0DnHTa9Z4-_F2gYQ');
        },
        language: "en"
    });
    
    // Landmarks data
    var sanFranciscoLandmarks = [
        { coordinate: new mapkit.Coordinate(37.7951315, -122.402986), title: "Transamerica Pyramid", phone: "+1-415-983-5420", url: "http://www.transamericapyramidcenter.com/" },
        { coordinate: new mapkit.Coordinate(37.7954201, -122.39352), title: "Ferry Building", phone: "+1 (415) 983-8030", url: "http://www.ferrybuildingmarketplace.com" },
        { coordinate: new mapkit.Coordinate(37.8083396, -122.415727), title: "Fisherman's Wharf", phone: "+1 (415) 673-3530", url: "http://visitfishermanswharf.com" },
        { coordinate: new mapkit.Coordinate(37.8023553, -122.405742), title: "Coit Tower", phone: "+1 (415) 249-0995", url: "http://sfrecpark.org/destination/telegraph-hill-pioneer-park/coit-tower/" },
        { coordinate: new mapkit.Coordinate(37.7552305, -122.452624), title: "Sutro Tower", phone: "+1 (415) 681-8850", url: "http://www.sutrotower.com" },
        { coordinate: new mapkit.Coordinate(37.779267, -122.419269), title: "City Hall", phone: "+1 (415) 701-2311", url: "http://sfgsa.org/index.aspx?page=1085" },
        { coordinate: new mapkit.Coordinate(37.8184493, -122.478409), title: "Golden Gate Bridge", phone: "+1 (415) 921-5858", url: "http://www.goldengatebridge.org" },
        { coordinate: new mapkit.Coordinate(37.7785538, -122.514035), title: "Cliff House", phone: "+1 (415) 386-3330", url: "http://www.cliffhouse.com/" }
    ];
    
    // Landmark annotation callout delegate
    var CALLOUT_OFFSET = new DOMPoint(-148, -78);
    var landmarkAnnotationCallout = {
        calloutElementForAnnotation: function(annotation) {
            return calloutForLandmarkAnnotation(annotation);
        },
    
        calloutAnchorOffsetForAnnotation: function(annotation, element) {
            return CALLOUT_OFFSET;
        },
    
        calloutAppearanceAnimationForAnnotation: function(annotation) {
            return ".4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein";
        }
    };
    
    // Landmarks annotations
    var annotations = sanFranciscoLandmarks.map(function(landmark) {
        var annotation = new mapkit.MarkerAnnotation(landmark.coordinate, {
            callout: landmarkAnnotationCallout,
            color: "#c969e0"
        });
        annotation.landmark = landmark;
        return annotation;
    });
    
    var map = new mapkit.Map("map");
    map.showItems(annotations);
    
    // Landmark annotation custom callout
    function calloutForLandmarkAnnotation(annotation) {
        var div = document.createElement("div");
        div.className = "landmark";
    
        var title = div.appendChild(document.createElement("h1"));
        title.textContent = annotation.landmark.title;
    
        var section = div.appendChild(document.createElement("section"));
    
        var phone = section.appendChild(document.createElement("p"));
        phone.className = "phone";
        phone.textContent = annotation.landmark.phone;
    
        var link = section.appendChild(document.createElement("p"));
        link.className = "homepage";
        var a = link.appendChild(document.createElement("a"));
        a.href = annotation.landmark.url;
        a.textContent = "website";
    
        return div;
    }
}

addPin(1,2);