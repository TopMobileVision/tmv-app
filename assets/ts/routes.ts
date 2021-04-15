var param= (arg: string) => {
    const search = new URLSearchParams(window.location.search);
    return search.has(arg) ? search.get(arg) : 'not found';
}
const NUM_ROWS: number = 20;
$('#title').text(param('city_id'));

function add_route(route: number, perc: number, day: number) {

    const type = perc == 100 ? 'class="complete"' : '';
    $('tbody').append(
        `<tr onclick="document.location = 'days.html?route_id=${route}';" ${type}><td><row>
        <div  id="A">#${route}</div>
        <span id="B">${perc}%</span>
        <div  id="C">${1}</div>
        <span id="D">Mar ${day}</span>
        </row></td></tr>`
    );
}

for (let i=0; i<NUM_ROWS; i++) {
    const day: number   = Math.random()*31|1;
    const route: number = Math.random()*9999|1000;
    const perc: number  = parseInt((Math.random()*100).toFixed(0));
    add_route(route, perc, day);
}


// * init mapkit
mapkit.init({
    authorizationCallback: done => {
        done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjgzQ1dGWjhQNjIifQ.eyJpc3MiOiI1VkdLUDJRVjZIIiwiaWF0IjoxNjE2OTA0NzYzLCJleHAiOjE2MTk1ODMxNjN9.nME9bxXIl3eE1-43BVKu7XmZAyRGfAZGhOOhiIL-mnuyJu2gLq_9vxQQ-Jjly-KUtWAArs0DnHTa9Z4-_F2gYQ');
    }
});

var map = new mapkit.Map("map", {
    isRotationEnabled: false
});