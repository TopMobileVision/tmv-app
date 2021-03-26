"use strict";

const generate_history = (history) => {
    return `<tr><td><a>${history[0]}</a></td></tr>`
}

const generate_card = (card) => {
    return `<div class="info-card"><span>${card}</div>`
}

const generate_video = (url) => {
    return `<source src=".${url}" type="video/mp4"></source>`
}

$.getJSON('./assets/json/lift.json', json => {
    
    // extract lifts from JSON
    const vid_url= json.vid_url;
    const address= json.address;
    let   cards  = json.cards;
    const history= json.previous_lifts;
    
    // Set adddress title
    $('#title').text(address.toUpperCase());
    
    // Populate Previous Lifts table
    const rows = Object.entries(history).map(generate_history);
    $('#history tbody').empty();
    $('#history tbody').append(rows);

    // Generate info cards
    cards = Object.values(cards).map(generate_card);
    $('.grid-details').empty();
    $('.grid-details').append(cards);

    // Set the video player's url
    $('#vid_player').html(generate_video(vid_url));
});