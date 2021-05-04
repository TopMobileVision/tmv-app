var param = (arg: string) => {
    const search = new URLSearchParams(window.location.search);
    return search.has(arg) ? search.get(arg) : 'not found';
}

// $('#title').text('Route #' + param('route_id') + ': ' + param('day'));

$('#title').html(`<a href="index.html">Cities</a> › <a href="index.html">${param('city_id')}</a> ›  <a href="days.html?route_id=${param('route_id')}&city_id=${param('city_id')}">R#${param('route_id')}</a> › ${param('day')}`);
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const rand_street = () => ['Elm St', 'Alcala Park', 'Point Loma Bl', 'Wilshire Bl', 'Santa Monica Bl'][Math.floor(Math.random() * 5)];

function add_lift() {
    const address = rand(25, 3000) + ' ' + rand_street();
    const btyp = ['🏪', '🏠'][Math.floor(Math.random() * 2)];
    $('tbody').append(
        `<tr onclick="document.location = 'lift.html?lift_id=${1}&address=${address}';"><td><row class="city">
    <div  id="A">${address}</div>
    <span id="B">12:39PM</span>
    </row></td></tr>`
    );
};

for (let i = 0; i < 20; i++) add_lift()

// * init mapkit
mapkit.init({
    authorizationCallback: done => {
        done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IllVNEE2Mk02N0YifQ.eyJpc3MiOiI1VkdLUDJRVjZIIiwiaWF0IjoxNjIwMTA3Njc4LCJleHAiOjE2MjM3MTUyMDB9.evUExBAjsE2UfPn7y697fCsMlntcpexMATG55fi29-pktwUqn8sn21l_i6SdVcs4KmhyO4JDbnIF_sFbbAzn_w');
    }
});

const map = new mapkit.Map("map", { colorScheme: 'dark' });

const CALLOUT_OFFSET = new DOMPoint(-148, -78);
const landmarkAnnotationCallout = {
    calloutElementForAnnotation: function (annotation) {
        return calloutForLandmarkAnnotation(annotation);
    },

    calloutAnchorOffsetForAnnotation: function (annotation, element) {
        return CALLOUT_OFFSET;
    },

    calloutAppearanceAnimationForAnnotation: function (annotation) {
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
    const logs = response[dvr_id];

    const style = new mapkit.Style({ lineWidth: 2, lineJoin: 'round', strokeColor: '#FFF' });
    const date = logs.shift();
    const lat = logs[logs.length - 2];
    const lon = logs[logs.length - 1];



    const annotation = (lat: number, lon: number) => {
        const landmark = {
            coordinate: new mapkit.Coordinate(lat, lon),
            title: dvr_id,
            phone: 'Bin was lifted at ' + date,
            url: '/lift.html?lift_id='
        };

        const anno = new mapkit.MarkerAnnotation(landmark.coordinate, {
            callout: landmarkAnnotationCallout,
            color: ['#03DAC6', '#19B5FE', '#BDC3C7'][Math.floor(Math.random() * 3)]
        });
        anno.landmark = landmark;
        anno.glyphText = '🗑️';

        return anno;
    }

    const len = logs.length;
    const random_indecies = [...Array(50)].map(e => Math.random() * len | 0);
    var annotations = [];

    for (var coo = [], i = 0; i < len - 1; i += 2) {
        const lat: number = logs[i], lon: number = logs[i + 1];
        if (random_indecies.includes(i)) {
            annotations.push(annotation(lat, lon))


        }
        coo.push(new mapkit.Coordinate(lat, lon));
    }

    const line = new mapkit.PolylineOverlay(coo, { style: style });
    map.showItems(annotations);
    map.addOverlays([line]);
    map.showItems([line]);

});