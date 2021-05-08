var param = (arg: string) => {
    const search = new URLSearchParams(window.location.search);
    return search.has(arg) ? search.get(arg) : 'not found';
}

const a_color = () => ['#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177'][Math.floor(Math.random() * 5)];


const NUM_ROWS: number = 20;
$('#title').html('<a href="index.html">Cities</a> › ' + param('city_id'));

function add_route(route: number, perc: number, day: number) {

    const type = perc == 100 ? 'class="complete"' : '';
    const new_path = `days.html?route_id=${route}&city_id=${param('city_id')}`;
    $('tbody').append(
        `<tr onclick="document.location = '${new_path}';" ${type}><td><row>
        <div  id="A">#${route}</div>
        <span id="B">${perc}%</span>
        <div  id="C"></div>
        <span id="D">Mar ${day}</span>
        </row></td></tr>`
    );


}

for (let i = 0; i < NUM_ROWS; i++) {
    const day: number = Math.random() * 31 | 1;
    const route: number = Math.random() * 9999 | 1000;
    const perc: number = parseInt((Math.random() * 100).toFixed(0));
    add_route(route, perc, day);
}


// * init mapkit
mapkit.init({
    authorizationCallback: done => {
        done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IllVNEE2Mk02N0YifQ.eyJpc3MiOiI1VkdLUDJRVjZIIiwiaWF0IjoxNjIwMTA3Njc4LCJleHAiOjE2MjM3MTUyMDB9.evUExBAjsE2UfPn7y697fCsMlntcpexMATG55fi29-pktwUqn8sn21l_i6SdVcs4KmhyO4JDbnIF_sFbbAzn_w');
    }
});

var map = new mapkit.Map("map", {
    isRotationEnabled: false
});


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

        if (geoJSON.properties.NAME === 'Bay Ho') {

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
                fillColor: '#fcc5c0'
            });

            all_overlays.push(overlay as mapkit.Overlay);
            return overlay;
        }

        return null;
    },

    // When all the data has been imported, we can show the results.
    geoJSONDidComplete: function (overlays) {

        map.addItems(overlays);
        map.showItems(overlays);
        towns.sort().map(add_row);
    }
});
