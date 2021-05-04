var param = (arg: string) => {
    const search = new URLSearchParams(window.location.search);
    return search.has(arg) ? search.get(arg) : 'not found';
}
const NUM_ROWS: number = 20;
$('#title').html('<a href="index.html">Cities</a> › ' + param('city_id'));

function add_route(route: number, perc: number, day: number) {

    const type = perc == 100 ? 'class="complete"' : '';
    const new_path = `days.html?route_id=${route}&city_id=${param('city_id')}`;
    $('tbody').append(
        `<tr onclick="document.location = '${new_path}';" ${type}><td><row>
        <div  id="A">#${route}</div>
        <span id="B">${perc}%</span>
        <div  id="C">${1}</div>
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