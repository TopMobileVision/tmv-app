mapkit.init({
    authorizationCallback: done => {
        done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjgzQ1dGWjhQNjIifQ.eyJpc3MiOiI1VkdLUDJRVjZIIiwiaWF0IjoxNjE2OTA0NzYzLCJleHAiOjE2MTk1ODMxNjN9.nME9bxXIl3eE1-43BVKu7XmZAyRGfAZGhOOhiIL-mnuyJu2gLq_9vxQQ-Jjly-KUtWAArs0DnHTa9Z4-_F2gYQ');
    }
});

const CALLOUT_OFFSET = new DOMPoint(-148, -78);
const landmarkAnnotationCallout = {
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

const map = new mapkit.Map("map");
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const rand_city = () => ['San Diego', 'La Mesa', 'La Jolla', 'El Cajon', 'San Marcos'][Math.floor(Math.random()*5)];

const generate_route = (route: string, sum_bins: number, det_bins: number, day: number) => {
    const perc = (det_bins / sum_bins * 100).toFixed(0);
    const type = perc == '100' ? 'class="complete"' : '';
    return `<tr onclick="document.location = 'route.html?route_id=${route}';" ${type}><td><mygrid>
    <div  id="A">#${route}</div>
    <span id="B">${perc}%</span>
    <div  id="C">${rand_city()}</div>
    <span id="D">Mar ${day}</span>
    </mygrid></td></tr>`; 
};

const days: number[] = [...Array(10)].map(e=>Math.random()*32|0).sort((a, b) => a - b).reverse();

for (const day of days) {
    const id   = rand(1000, 9999);
    const num1 = rand(0, 500);
    const num2 = rand(num1/2, num1);

    $('tbody').append(generate_route(`${id}`, num1, num2, day));
}

$('tbody').append(generate_route('0550', 350, 350, 1));

$.getJSON('http://35.227.154.149:8000/trucks/online_only/', response => {

    var   annos: mapkit.MarkerAnnotation[] = [];
    const lines = Object.entries(response).map(([dvr_id, logs]) => {
        
        const style = new mapkit.Style({lineWidth: 2, lineJoin: 'round', strokeColor: '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')});
        const date = logs.shift();
        const lat  = logs[logs.length - 2];
        const lon  = logs[logs.length - 1];

        const landmark = {
            coordinate: new mapkit.Coordinate(lat, lon),
            title: dvr_id,
            phone: 'Last update at ' + date,
            url: '/lift.html?lift_id='
        };

        const annotation = new mapkit.MarkerAnnotation(landmark.coordinate, {
            callout: landmarkAnnotationCallout,
            color:   style.strokeColor
        });

        annotation.landmark = landmark;
        annotation.glyphText= '🚛';

        annos.push(annotation);
        
        for (var coo=[], i=0; i<logs.length-1; i+=2) {
            coo.push(new mapkit.Coordinate(logs[i], logs[i+1]));
        }
        
        return new mapkit.PolylineOverlay(coo, { style: style });
    });
    map.addOverlays(lines);
    map.showItems(annos);
    map.showItems(lines);
    
});
/* 
$.getJSON('assets/json/routes.json', routes => {

    const lines = Object.entries(routes).map(([route, coordinates]): mapkit.PolygonOverlay => {
        // const coordinates = routes[route];
        const city = coordinates.shift();
        for (var coo = [], i=0; i<(coordinates as number[]).length; i+=2) {
            coo.push(new mapkit.Coordinate((coordinates as number[])[i], (coordinates as number[])[i+1]));
        }

        return new mapkit.PolylineOverlay(
            coo,
            {
                style: new mapkit.Style({
                lineWidth: 6,
                lineJoin: "round",
                strokeColor: "#" + ((16777215 * Math.random()) << 0).toString(16).padStart(6, "0")})
            }
        );
    });

    map.addOverlays(lines);
    map.showItems(lines);
}); */