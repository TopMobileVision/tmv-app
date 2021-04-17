function add_bin(address: string, tmv_id: string, type: string, is_commercial: boolean) {
    switch (type) {
        case 'RC': var type_str = 'recycle'; break;
        case 'GR': var type_str = 'green'; break;
        default:   var type_str = 'trash'; break;
    }
    $('tbody').append(
        `<tr onclick="document.location = 'days.html?route_id=';" ${type}><td><row class="city">
        <div  id="A">${is_commercial ? '🏪':'🏠'} ${address}</div>
        <span id="B">${type_str}</span>
        </row></td></tr>`
    );
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

const annotation = (tmv_id: string, type: string, content: string, address: string, lat: number, lon: number) => {

    add_bin(address, tmv_id, type, content=='C');
    var color = '#BDC3C7'; // TR
    if (type == 'GR') { color = '#03DAC6'; }
    if (type == 'RC') { color = '#19B5FE'; }
    
    const coordinate = new mapkit.Coordinate(lat, lon);

    const anno = new mapkit.MarkerAnnotation(coordinate, {
        callout: landmarkAnnotationCallout,
        color:   color
    });
    anno.landmark = {
        coordinate: coordinate,
        title: address,
        phone: tmv_id,
        url: '/lift.html?lift_id='
    };
    anno.glyphText= '🗑️';

    return anno;
}

const company_id = parseInt((new URLSearchParams(window.location.search)).get('company_id') || '244722');

$.getJSON(`http://35.227.154.149:8000/${company_id}/bins/`, response => {
    const bins = Object.values(response['bins']);
    console.log(bins);
    const annotations = bins.map(bin => {
        return annotation(bin[0], bin[1], bin[2], bin[3].split(',')[0], bin[4], bin[5])
    }) 

    map.showItems(annotations);

});