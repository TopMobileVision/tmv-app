"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var table_items = [];

var TableData =
/*#__PURE__*/
function () {
  function TableData(id) {
    _classCallCheck(this, TableData);

    this.id = id;
  }

  _createClass(TableData, [{
    key: "set_table_rows",
    value: function set_table_rows(rows) {
      if (rows.length == 0) {
        $('.table-small tbody').html('<tr><td colspan="2">NOTHING FOUND.</td></tr>');
      } else {
        $('.table-small tbody').empty();
        $('.table-small tbody').append(rows);
      }
    }
  }, {
    key: "generate_row",
    value: function generate_row(obj) {
      return "<tr><td>".concat(obj.address, "</td><td>Some Info</td></tr>");
    }
  }, {
    key: "search",
    value: function search(input) {
      var results = this._items.filter(function (item) {
        return item.address.toUpperCase().includes(input) || item.name.toUpperCase().includes(input);
      });

      this._items = results;
      $('#h-title').html(input.length > 0 ? "".concat(results.length, " results for \"").concat(input, "\"") : "Address");
    }
  }, {
    key: "items",
    set: function set(newValue) {
      this._items = newValue;
      this.set_table_rows(this.items);
    },
    get: function get() {
      return this._items.map(this.generate_row);
    }
  }]);

  return TableData;
}();

table = new TableData('.table-small');
$('button.tab').click(function () {
  table.set_table_rows([]);
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
    table.items = customers;
  });
});
$('#btn_trucks').click(function () {
  $('#btn_trucks').addClass('selected');
  $('#btn_comers').removeClass('selected');
  $.getJSON('./assets/test_data.json', function (json) {
    var trucks = json.trucks;
    table.items = trucks;
  });
});
$('#search-bar').keyup(function () {
  var input = $('#search-bar').val().toUpperCase();
  table.search(input);
});