
"use strict";

const generate_history = (day: number) => {
    return `<tr onclick="document.location = 'lift.html?lift_id=${lift_id}';"><td><row class="city">
    <span  id="A">Sep ${day}</span>
    <span id="B"></span>
    </row></td></tr>`
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
const days: number[] = [...Array(8)].map(_ => rand(8, 31)).sort((a, b) => a - b).reverse()

const generate_video = (url: string) => {
    return `<source src="./assets/media/lift.mp4#t=0,10.26" type="video/mp4"></source>`
}

const generate_subtitle = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    const time = date.toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric' })
    return `<p style="color: var(--color3);">${day} • ${time} • BIN ID QRCODE1</p>`
}

const params = new URLSearchParams(window.location.search);
const lift_id = params.get('lift_id') || '';
const address = params.get('address');
const city_id = params.get('city_id');
const route_id = params.get('route_id');

// Set adddress title
$('#title').html(`<a href="index.html">Cities</a> › <a href="index.html">${city_id}</a> ›  <a href="days.html?route_id=${route_id}&city_id=${city_id}">R#${route_id}</a> › Sep 8`);

$('#address').text(address)
const url_api = 'http://35.227.154.149:8000/lifts/?lift_id=' + lift_id;

$.get(url_api, lift => {


    // Populate Previous Lifts table
    const history = Object.entries(lift.previous_lifts);
    const rows = days.map(generate_history);
    $('tbody').html(rows);

    // Generate info cards
    $('.grid-details').html(generate_subtitle(lift.timestamp));

    // Set the video player's url
    $('#vid_player').html(generate_video(lift.vid_url));
});