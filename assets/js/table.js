const get_cust_row = (comer) => {
    return `<tr><td>${comer.address}</td><td>Some Info</td></tr>`
}

const get_truc_row = (truck) => {
    return `<tr><td>${truck.id}</td><td>Some Info</td></tr>`
}

$('button.tab:not(.selected)').click( () => {
    $('.table-small tbody').html('<tr><td colspan="2">NOTHING FOUND.</td></tr>');
    
});

/*
Note this does NOT run synchronously
*/

$('#btn_comers').click( () => {
    $('#btn_comers').addClass('selected');
    $('#btn_trucks').removeClass('selected');

    $.getJSON('./assets/test_data.json', json => {
        $('.table-small tbody').empty();
        const {customers, trucks} = json;
        const rows = customers.map(get_cust_row);
        $('.table-small tbody').append(rows);
    });
});

$('#btn_trucks').click( () => {
    $('#btn_trucks').addClass('selected');
    $('#btn_comers').removeClass('selected');

    $.getJSON('./assets/test_data.json', json => {
        $('.table-small tbody').empty();
        const trucks = json.trucks;
        const rows = trucks.map(get_truc_row);
        $('.table-small tbody').append(rows);
    });
});


