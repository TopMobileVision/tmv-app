"use strict";

const generate_history = (history: string[]) => {
    return `<tr onclick="document.location = 'lift.html?lift_id=${lift_id}';"><td><row class="city">
    <span  id="A">${history[0]}</span>
    <span id="B">TEXT</span>
    </row></td></tr>`
}

const generate_video = (url: string) => {
    return `<source src=".${url}" type="video/mp4"></source>`
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

const url_api = 'http://35.227.154.149:8000/lifts/?lift_id=' + lift_id;

$.get(url_api, lift => {

    // Set adddress title
    $('#title').text('Cities › Balboa Park › R#3563 › Mar 27');//.text(address.toUpperCase());

    // Populate Previous Lifts table
    const history = Object.entries(lift.previous_lifts);
    const rows = history.map(generate_history);
    $('tbody').html(rows);

    // Generate info cards
    $('.grid-details').html(generate_subtitle(lift.timestamp));

    // Set the video player's url
    $('#vid_player').html(generate_video(lift.vid_url));
});