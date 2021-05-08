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
    $('tbody').append(`<tr onclick="document.location = 'lifts.html?city_id=${param('city_id')}&route_id=${route}&day=${'Sep ' + day}';" ${type}><td><row>
    <div  id="A">Sep ${day}</div>
    <span id="B">${perc}%</span>
    <div  id="C">${btyp} Truck ${rand(1000, 9999)}</div>
    <span id="D">missed ${sum_bins - det_bins}</span>
    </row></td></tr>`);
};

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
const days: number[] = [...Array(10)].map(_ => rand(8, 31)).sort((a, b) => a - b).reverse()
// const days: number[] = [...Array(10)].map(e => Math.random() * 32 | 1).sort((a, b) => a - b).reverse();

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

$.getJSON('assets/data/map.geojson', response => {
    const style = new mapkit.Style({ lineWidth: 2, lineJoin: 'round', strokeColor: '#FFF' });

    const coo = response.geometry.coordinates;

    const Coo = coo.map(entry => {
        return new mapkit.Coordinate(entry[1], entry[0]);
    })

    const line = new mapkit.PolylineOverlay(Coo, { style: style });

    map.addOverlays([line]);
    map.showItems([line]);
})