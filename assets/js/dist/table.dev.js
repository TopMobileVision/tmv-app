"use strict";

var table_items = [];

var generate_row = function generate_row(obj) {
  return "<tr><td>".concat(obj.address, "</td><td>Some Info</td></tr>");
};

$('button.tab').click(function () {
  set_table_rows([]);
});
/*
Note this does NOT run synchronously
*/

$('#btn_comers').click(function () {
  $('#btn_comers').addClass('selected');
  $('#btn_trucks').removeClass('selected');
  $.getJSON('./assets/test_data.json', function (json) {
    var customers = json.customers,
        trucks = json.trucks;
    var rows = customers.map(generate_row);
    set_table_rows(rows); // Global variable

    table_items = customers;
  });
});
$('#btn_trucks').click(function () {
  $('#btn_trucks').addClass('selected');
  $('#btn_comers').removeClass('selected');
  $.getJSON('./assets/test_data.json', function (json) {
    var trucks = json.trucks;
    var rows = trucks.map(generate_row);
    set_table_rows(rows); // Global variable

    table_items = trucks;
  });
});
$('#search-bar').keyup(function () {
  var input = $('#search-bar').val().toUpperCase();
  var results = table_items.filter(function (item) {
    return item.address.toUpperCase().includes(input) || item.name.toUpperCase().includes(input);
  });
  var rows = results.map(generate_row);
  set_table_rows(rows);
  $('#h-title').html(input.length > 0 ? "".concat(results.length, " results for \"").concat(input, "\"") : "Address");
});

function set_table_rows(rows) {
  if (rows.length == 0) {
    $('.table-small tbody').html('<tr><td colspan="2">NOTHING FOUND.</td></tr>');
  } else {
    $('.table-small tbody').empty();
    $('.table-small tbody').append(rows);
  }
}