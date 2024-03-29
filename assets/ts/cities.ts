const add_row = (city: string) => {
    $('tbody').append(`<tr onclick="document.location = 'routes.html?city_id=${city}';"><td><row class="city">
    <span onmouseover="hoverHandler(this)" onmouseout="unhoverHandler(this)" id="A">${city}</span>
    <span id="B">${rand(2, 90) + ' routes'}</span>
    </row></td></tr>`);
};

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const rand_color = () => ['#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177'][Math.floor(Math.random() * 5)];
var LINE_WIDTH_DEFAULT = 0.5;
var LINE_WIDTH_SELECTED = 3;

// Initialize mapkit and create a new map.

mapkit.init({
    authorizationCallback: done => {
        done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IllVNEE2Mk02N0YifQ.eyJpc3MiOiI1VkdLUDJRVjZIIiwiaWF0IjoxNjIwMTA3Njc4LCJleHAiOjE2MjM3MTUyMDB9.evUExBAjsE2UfPn7y697fCsMlntcpexMATG55fi29-pktwUqn8sn21l_i6SdVcs4KmhyO4JDbnIF_sFbbAzn_w');
    }
});

var map = new mapkit.Map("map", {
    isRotationEnabled: false
});

// Setup the UI to show a popup when a state is selected.
var infoPopup = document.getElementById("infoPopup");
var infoCountry = infoPopup.querySelector(".info-country");
var infoPopulation = infoPopup.querySelector(".info-population");
var mapLegend = document.querySelector(".map-legend");

function showInfo(data) {
    infoCountry?.innerText = data.city;
    infoPopulation?.innerText = data.town;
    // infoPopulation?..setAttribute("onclick","ocation.href='routes.html?city_id=" + data.town + "'");
    infoPopup?.style.display = "block";
}

function closeInfo() {
    infoPopup.style.display = "none";
}


var towns: string[] = [];
var all_overlays: mapkit.Overlay[] = [];

// Import GeoJSON data with the shape of the states and their population.
mapkit.importGeoJSON("assets/data/Neighborhoods-CA.geojson", {

    // Some states are represented as MultiPolygons; we transform them into
    // a single PolygonOverlay by concatenating the lists of lists of points.
    itemForMultiPolygon: function (collection, _) {
        var overlays = collection.getFlattenedItemList();
        var points = overlays.reduce(function (points, overlay) {
            return points.concat(overlay.points);
        }, []);
        return new mapkit.PolygonOverlay(points);
    },

    // After an overlay has been created for a feature (either directly or through
    // itemForMultiPolygon above), the properties of the feature are used to add data
    // and set the style (especially the fill color) based on population count.
    itemForFeature: function (overlay, geoJSON) {


        // Add data to the overlay to be shown when it is selected.
        overlay.data = {
            city: geoJSON.properties.CITY,
            town: geoJSON.properties.NAME
        };
        // add_row(overlay.data.town);
        towns.push(overlay?.data.town);

        // Find the right color for the population and the set the style.
        overlay.style = new mapkit.Style({
            fillOpacity: 0.7,
            lineWidth: LINE_WIDTH_DEFAULT,
            fillColor: rand_color()
        });

        all_overlays.push(overlay as mapkit.Overlay);
        return overlay;
    },

    // When all the data has been imported, we can show the results.
    geoJSONDidComplete: function (overlays) {

        map.addItems(overlays);
        map.showItems(overlays);
        towns.sort().map(add_row);
    }
});

// Show info about the selected state.
map.addEventListener("select", function (event) {
    if (event.overlay && event.overlay.data) {
        event.overlay.style.lineWidth = LINE_WIDTH_SELECTED;
        showInfo(event.overlay.data);
    }
});

// Hide info when a state is deselected.
map.addEventListener("deselect", function (event) {
    if (event.overlay) {
        event.overlay.style.lineWidth = LINE_WIDTH_DEFAULT;
        closeInfo();
    }
});

const hoverHandler = (event: any) => {
    const overlay = find_overlay(event.innerHTML);
    overlay.style.lineWidth = LINE_WIDTH_SELECTED;
    showInfo(overlay.data);
}

const unhoverHandler = (event: any) => {
    const overlay = find_overlay(event.innerHTML);
    overlay.style.lineWidth = LINE_WIDTH_DEFAULT;
    closeInfo();
}

const find_overlay = (keyword: string) => {
    const result = all_overlays.filter(overlay => overlay.data.town === keyword)[0];

    return result;
}
// setTimeout(() => { find_overlay('Bay Park') }, 1000);
