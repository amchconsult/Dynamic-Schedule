Vue.filter('currencyDisplay', {
    // model -> view
    read: function (val) {
        if (val > 0) {
            return accounting.formatMoney(val, "$", 2, ".", ",");
        }
    },
    // view -> model
    write: function (val, oldVal) {
        return accounting.unformat(val, ",");
    }
});


Vue.config.devtools = true;

var vm = new Vue({
    el: '#app',
    data: {
        rows: [
            //initial data
            {qty: 5, description: "Something", price: 55.20, tax: 10, subtotal:0},
            {qty: 2, description: "Something else", price: 1255.20, tax: 20, subtotal:0},
        ],
        // total: 0,
        grandtotal: 0,
        // taxtotal: 0,
        delivery: 40
    },
    computed: {
        total: function () {
            var t = 0;
            this.rows.forEach(function(item) {
                if(item.subtotal) {
                   t += (parseFloat(item.subtotal));
                }
            });
            return t;
        },
        taxtotal: function () {
            var tt = 0;
            // $.each(this.rows, function (i, e) {
            //     tt += accounting.unformat(e.tax_amount, ",");
            // });
            return tt;
        }
    },
    methods: {
        subtotal: function (row) {
            
            return row.subtotal = row.qty * row.price * row.tax / 100 + row.qty * row.price;
        },
        addRow: function (index) {
            try {
                this.rows.splice(index + 1, 0, {});
            } catch(e)
            {
                console.log(e);
            }
        },
        removeRow: function (index) {
            this.rows.splice(index, 1);
        },
        getData: function () {
            // $.ajax({
            //     context: this,
            //     type: "POST",
            //     data: {
            //         rows: this.rows,
            //         total: this.total,
            //         delivery: this.delivery,
            //         taxtotal: this.taxtotal,
            //         grandtotal: this.grandtotal,
            //     },
            //     url: "/api/data"
            // });
            console.log(this.rows);
        }
    }
});