var table_items = [];


const generate_row = (obj) => {
    return `<tr><td>${obj.address}</td><td>Some Info</td></tr>`
}

$('button.tab').click( () => {
    set_table_rows([]);
});

/*
Note this does NOT run synchronously
*/
$('#btn_comers').click( () => {
    $('#btn_comers').addClass('selected');
    $('#btn_trucks').removeClass('selected');

    $.getJSON('./assets/test_data.json', json => {

        const {customers, trucks} = json;
        const rows = customers.map(generate_row);
        set_table_rows(rows);

        // Global variable
        table_items = customers;
    });
});

$('#btn_trucks').click( () => {
    $('#btn_trucks').addClass('selected');
    $('#btn_comers').removeClass('selected');

    $.getJSON('./assets/test_data.json', json => {
        
        const trucks = json.trucks;
        const rows   = trucks.map(generate_row);
        set_table_rows(rows);

        // Global variable
        table_items  = trucks;
    });
});

$('#search-bar').keyup( () => {

    const input   = $('#search-bar').val().toUpperCase();

    const results = table_items.filter(item => item.address.toUpperCase().includes(input) || item.name.toUpperCase().includes(input));

    const rows    = results.map(generate_row);

    set_table_rows(rows);

    $('#h-title').html(input.length > 0 ? `${results.length} results for "${input}"` : "Address");
});

function set_table_rows(rows) {
    if (rows.length == 0) {
        $('.table-small tbody').html('<tr><td colspan="2">NOTHING FOUND.</td></tr>');
    } else {
        $('.table-small tbody').empty();
        $('.table-small tbody').append(rows);
    }
}