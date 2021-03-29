"use strict";

const generate_history = (history) => {
    return `<tr><td><a>${history[0]}</a></td></tr>`
}

const generate_video = (url) => {
    return `<source src=".${url}" type="video/mp4"></source>`
}

const generate_subtitle = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.toLocaleDateString("en-US", {year: 'numeric', month: 'short', day: 'numeric'});
    const time = date.toLocaleTimeString("en-US", {hour: 'numeric', minute:'numeric'})
    return `<p style="color: var(--color3);">${day} • ${time} • BIN ID QRCODE1</p>`
}

const url_api = () => {
    const params  = new URLSearchParams(window.location.search);
    const lift_id = params.get('lift_id') || '';
    return 'http://35.227.154.149:8000/lifts/?lift_id=' + lift_id
};

$.get(url_api(), lift => {
    
    // Set adddress title
    $('#title').text(lift.address.toUpperCase());
    
    // Populate Previous Lifts table
    const history = Object.entries(lift.previous_lifts);
    const rows = history.map(generate_history);
    $('#history tbody').html(rows);

    // Generate info cards
    $('.grid-details').html(generate_subtitle(lift.timestamp));

    // Set the video player's url
    $('#vid_player').html(generate_video(lift.vid_url));
});