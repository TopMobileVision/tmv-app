const add_row = (city: string) => {
    $('tbody').append(`<tr onclick="document.location = 'routes.html?city_id=${city}';"><td><row class="city">
    <span  id="A">${city}</span>
    <span id="B">${rand(2,90) + ' routes'}</span>
    </row></td></tr>`); 
};

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const rand_color = () => ['#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177'][Math.floor(Math.random()*5)];
var LINE_WIDTH_DEFAULT = 0.5;
var LINE_WIDTH_SELECTED = 3;

// Initialize mapkit and create a new map.

mapkit.init({
    authorizationCallback: done => {
        done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjgzQ1dGWjhQNjIifQ.eyJpc3MiOiI1VkdLUDJRVjZIIiwiaWF0IjoxNjE2OTA0NzYzLCJleHAiOjE2MTk1ODMxNjN9.nME9bxXIl3eE1-43BVKu7XmZAyRGfAZGhOOhiIL-mnuyJu2gLq_9vxQQ-Jjly-KUtWAArs0DnHTa9Z4-_F2gYQ');
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
        add_row(overlay.data.town);

        // Find the right color for the population and the set the style.
        overlay.style = new mapkit.Style({
            fillOpacity: 0.7,
            lineWidth: LINE_WIDTH_DEFAULT,
            fillColor: rand_color()
        });
        return overlay;
    },

    // When all the data has been imported, we can show the results.
    geoJSONDidComplete: function (overlays) {
        map.addItems(overlays);
        map.showItems(overlays);
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
