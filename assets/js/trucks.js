mapkit.init({
    authorizationCallback: done => {
        done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjgzQ1dGWjhQNjIifQ.eyJpc3MiOiI1VkdLUDJRVjZIIiwiaWF0IjoxNjE2OTA0NzYzLCJleHAiOjE2MTk1ODMxNjN9.nME9bxXIl3eE1-43BVKu7XmZAyRGfAZGhOOhiIL-mnuyJu2gLq_9vxQQ-Jjly-KUtWAArs0DnHTa9Z4-_F2gYQ');
    }
});
const map = new mapkit.Map("map");

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

$.getJSON('http://35.227.154.149:8000/trucks/online_only/', response => {

    var   annos = [];
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

        annos.push(annotation);
        map.showItems(annos);

        var coo = [];
        for (var i=0; i<logs.length-1; i+=2) {
            coo.push(new mapkit.Coordinate(logs[i], logs[i+1]));
        }

        return new mapkit.PolylineOverlay(coo, { style: style });
    });
    map.addOverlays(lines);
    map.showItems(lines);
    
});