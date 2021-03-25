"use strict";

const generate_history = (history) => {
    return `<tr><td><a href="${history[1]}">${history[0]}</a></td></tr>`
}

const generate_card = (card) => {
    return `<div class="info-card"><span>${card}</div>`
}

$.getJSON('./assets/json/lift.json', json => {
    
    // extract lifts from JSON
    const address= json.address;
    let   cards  = json.cards;
    const history= json.previous_lifts;
    $('#title').text(address);
    
    const rows = Object.entries(history).map(generate_history);
    $('#history tbody').empty();
    $('#history tbody').append(rows);

    cards = Object.values(cards).map(generate_card);
    $('.grid-details').empty();
    $('.grid-details').append(cards);
});