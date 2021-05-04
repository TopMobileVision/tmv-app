var param = (arg: string) => {
    const search = new URLSearchParams(window.location.search);
    return search.has(arg) ? search.get(arg) : 'not found';
}

// $('#title').text('Route #' + param('route_id'))
$('#title').html(`<a href="index.html">Cities</a> › <a href="routes.html?city_id=${param('city_id')}">${param('city_id')}</a> ›  R#${param('route_id')}`);
var rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

function add_day(route: string, sum_bins: number, det_bins: number, day: number) {
    const perc = (det_bins / sum_bins * 100).toFixed(0);
    const btyp = ['🏪', '🏠'][Math.floor(Math.random() * 2)];
    const type = perc == '100' ? 'class="complete"' : '';
    $('tbody').append(`<tr onclick="document.location = 'lifts.html?city_id=${param('city_id')}&route_id=${route}&day=${'Mar ' + day}';" ${type}><td><row>
    <div  id="A">Mar ${day}</div>
    <span id="B">${perc}%</span>
    <div  id="C">${btyp} Truck ${rand(1000, 9999)}</div>
    <span id="D">missed ${sum_bins - det_bins}</span>
    </row></td></tr>`);
};

const days: number[] = [...Array(10)].map(e => Math.random() * 32 | 1).sort((a, b) => a - b).reverse();

for (const day of days) {
    const id = rand(1000, 9999);
    const num1 = rand(0, 500);
    const num2 = rand(num1 * 0.8, num1);

    add_day(`${id}`, num1, num2, day);
}

// * init mapkit
mapkit.init({
    authorizationCallback: done => {
        done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IllVNEE2Mk02N0YifQ.eyJpc3MiOiI1VkdLUDJRVjZIIiwiaWF0IjoxNjIwMTA3Njc4LCJleHAiOjE2MjM3MTUyMDB9.evUExBAjsE2UfPn7y697fCsMlntcpexMATG55fi29-pktwUqn8sn21l_i6SdVcs4KmhyO4JDbnIF_sFbbAzn_w');
    }
});

var map = new mapkit.Map("map", { colorScheme: 'dark' });

$.getJSON('http://35.227.154.149:8000/trucks/online_only/', response => {

    const dvr_id = Object.keys(response)[Math.floor(Math.random() * Object.keys(response).length)];
    const logs = response[dvr_id];

    const style = new mapkit.Style({ lineWidth: 2, lineJoin: 'round', strokeColor: '#FFF' });
    const date = logs.shift();

    const len = logs.length;

    for (var coo = [], i = 0; i < len - 1; i += 2) {
        const lat: number = logs[i], lon: number = logs[i + 1];
        coo.push(new mapkit.Coordinate(lat, lon));
    }

    const line = new mapkit.PolylineOverlay(coo, { style: style });
    // map.showItems(annotations);
    map.addOverlays([line]);
    map.showItems([line]);

});