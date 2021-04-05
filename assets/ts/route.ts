const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const generate_route = (route: string, sum_bins: number, det_bins: number) => {
    const perc = (det_bins / sum_bins * 100).toFixed(0);
    const btyp = ['🏪', '🏠'][Math.floor(Math.random()*2];
    const type = perc == '100' ? 'class="complete"' : '';
    return `<tr onclick="document.location = 'route.html?route_id=${route}';" ${type}><td><mygrid>
    <div  id="A">Mar ${day}</div>
    <span id="B">${perc}%</span>
    <div  id="C">${btyp} Truck ${rand(1000,9999)}</div>
    <span id="D">missed ${sum_bins-det_bins}</span>
    </mygrid></td></tr>`; 
};

const days: number[] = [...Array(10)].map(e=>Math.random()*32|1).sort((a, b) => a - b).reverse();

for (const day of days) {
    const id   = rand(1000, 9999);
    const num1 = rand(0, 500);
    const num2 = rand(num1/2, num1);

    $('tbody').append(generate_route(`${id}`, num1, num2, day));
}

mapkit.init({
    authorizationCallback: done => {
        done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjgzQ1dGWjhQNjIifQ.eyJpc3MiOiI1VkdLUDJRVjZIIiwiaWF0IjoxNjE2OTA0NzYzLCJleHAiOjE2MTk1ODMxNjN9.nME9bxXIl3eE1-43BVKu7XmZAyRGfAZGhOOhiIL-mnuyJu2gLq_9vxQQ-Jjly-KUtWAArs0DnHTa9Z4-_F2gYQ');
    }
});
const map = new mapkit.Map("map", {colorScheme: 'dark'});

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

$.getJSON('http://35.227.154.149:8000/trucks/online_only/', response => {

    const dvr_id = Object.keys(response)[Math.floor(Math.random() * Object.keys(response).length)];
    const logs   = response[dvr_id];
    
    const style = new mapkit.Style({lineWidth: 2, lineJoin: 'round', strokeColor: '#FFF'});
    const date = logs.shift();
    const lat  = logs[logs.length - 2];
    const lon  = logs[logs.length - 1];

    
    
    const annotation = (lat: number, lon: number) => {
        const landmark = {
            coordinate: new mapkit.Coordinate(lat, lon),
            title: dvr_id,
            phone: 'Bin was lifted at ' + date,
            url: '/lift.html?lift_id='
        };
        
        const anno = new mapkit.MarkerAnnotation(landmark.coordinate, {
            callout: landmarkAnnotationCallout,
            color:   ['#03DAC6', '#19B5FE', '#BDC3C7'][Math.floor(Math.random()*3)]
        });
        anno.landmark = landmark;
        anno.glyphText= '🗑️';

        return anno;
    }

    const len = logs.length;
    const random_indecies = [...Array(50)].map(e=>Math.random()*len|0);
    var   annotations = [];
    
    for (var coo=[], i=0; i<len-1; i+=2) {
        const lat: number = logs[i], lon: number = logs[i+1];
        if (random_indecies.includes(i)) { annotations.push(annotation(lat, lon)) }
        coo.push(new mapkit.Coordinate(lat, lon));
    }
    
    const line = new mapkit.PolylineOverlay(coo, { style: style });
    map.showItems(annotations);
    map.addOverlays([line]);
    map.showItems([line]);
    
});