"use strict";

const generate_history = (history) => {
    return `<tr><td><a>${history[0]}</a></td></tr>`
}

const generate_video = (url) => {
    return `<source src=".${url}" type="video/mp4"></source>`
}

const generate_subtitle = (date) => {
    const [month, day, year]    = date.toLocaleDateString("en-US").split("/")
    const [hour, minute, second] = date.toLocaleTimeString("en-US").split(/:| /)
    // TODO: PM/AM
    return `<p style="color: var(--color3);">${month}/${day} at ${hour}:${minute}PM • ID QRCODE1</p>`
}

const url_api = 'http://35.227.154.149:8000/lifts/?lift_id=1';

$.get(url_api, json => {
    
    // extract lift data from JSON
    const vid_url= json.vid_url;
    const address= json.address;
    const date   = new Date(json.timestamp);
    const history= json.previous_lifts;
    
    // Set adddress title
    $('#title').text(address.toUpperCase());
    
    // Populate Previous Lifts table
    const rows = Object.entries(history).map(generate_history);
    $('#history tbody').html(rows);

    // Generate info cards
    $('.grid-details').html(generate_subtitle(date));

    // Set the video player's url
    $('#vid_player').html(generate_video(vid_url));
});