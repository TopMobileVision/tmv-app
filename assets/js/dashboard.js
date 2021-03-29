
const generate_day = (day, len) => {
    return day == 'Yesterday' ? `<tr class="selected"><td><b>${day}</b><br>${len} bins</td></tr>` : `<tr><td>${day}<br>${len} bins</td></tr>` 
};

const timestamp_to_time = (timestamp) => {
    const date = new Date(timestamp*1000);
    const [hour, minute, second] = date.toLocaleTimeString("en-US").split(/:| /);
    return `${hour}:${minute}`
}

const timestamp_to_date = (timestamp) => {
    const date = new Date(timestamp*1000);
    const [month, day, _] = date.toLocaleDateString("en-US").split("/");
    const month_day = month + '/' + day;
    return month_day
}

const fnid_unique_days = (lifts) => {
    const dates = lifts.map(lift => timestamp_to_date(lift.timestamp));
    const unique_days = [...new Set(dates)];

    var unique = {};
    unique_days.forEach(day => { unique[day] = [] });
    lifts.forEach(lift => {
        const day = timestamp_to_date(lift.timestamp);
        unique[day].push(lift);
    })
    return unique;
}

$.getJSON('./assets/json/recent_lifts.json', json => {
    // $('#list-table tbody').empty();

    const lifts = json.recent_lifts;

    const unique_days = fnid_unique_days(lifts);

    // console.log(unique_days);

    Object.entries(unique_days).forEach(([day, lifts]) => {
        $('#list-table tbody').append(generate_day(day, Object.keys(lifts).length));
    })
    // console.log(lifts); 

    // Object.entries(days).forEach(([day, lift]) => {
    //     $('#list-table tbody').append(generate_day(day, Object.keys(lift).length));
    // });

    mapkit.init({
        authorizationCallback: done => {
            done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjgzQ1dGWjhQNjIifQ.eyJpc3MiOiI1VkdLUDJRVjZIIiwiaWF0IjoxNjE2OTA0NzYzLCJleHAiOjE2MTk1ODMxNjN9.nME9bxXIl3eE1-43BVKu7XmZAyRGfAZGhOOhiIL-mnuyJu2gLq_9vxQQ-Jjly-KUtWAArs0DnHTa9Z4-_F2gYQ');
        }
    });

    const geocoder = new mapkit.Geocoder({ getsUserLocation: false });

    const map = new mapkit.Map("map");

    var annotations = [];

    lifts.forEach(lift => {

        geocoder.lookup(lift.address, (err, data) => {
            
            const landmark = {
                coordinate: new mapkit.Coordinate(data.results[0].coordinate.latitude, data.results[0].coordinate.longitude),
                title: lift.address.split(',')[0],
                phone: 'Lifted at ' + timestamp_to_time(lift.timestamp),
                url: '/lift.html?lift_id=' + lift.lift_id
            };

            const annotation = new mapkit.MarkerAnnotation(landmark.coordinate, {
                callout: landmarkAnnotationCallout,
                color: "#c969e0"
            });
            annotation.landmark = landmark;

            annotations.push(annotation);

            map.showItems(annotations);
        });
    });
    
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
        a.textContent = "more info";
    
        return div;
    }
});