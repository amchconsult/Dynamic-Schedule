
Vue.config.devtools = true;

Object.defineProperty(Vue.prototype, '$flatpickr', { value: flatpickr });
dayjs.extend(dayjs_plugin_isBetween);

var vm = new Vue({
    el: '#app',
    data: {
        rows: [
            //initial demo data
            {employee: "John", datebegin: "2019-05-09", dateend: "2019-05-12", type: "FULL DAY"},
            {employee: "John", datebegin: "2019-05-17", dateend: "2019-05-18", type: "FULL DAY"},
            {employee: "Alex", datebegin: "2019-05-09", dateend: "2019-05-13", type: "HALF DAY"},
            {employee: "Alex", datebegin: "2019-05-15", dateend: "2019-05-15", type: "HALF DAY"},
            {employee: "John", datebegin: "2019-05-15", dateend: "2019-05-15", type: "HALF DAY"},
            {employee: "Charlie", datebegin: "2019-05-02", dateend: "2019-05-05", type: "FULL DAY"},
            {employee: "Charlie", datebegin: "2019-05-06", dateend: "2019-05-07", type: "HOLIDAY"}
        ],
        datefrom: "2019-05-01",
        dateto: "2019-05-31"
    },
    mounted() {
        document.onreadystatechange = () => { 
            if (document.readyState == "complete") { 
                // run code here
                this.$flatpickr("#datebegin", { dateFormat: "Y-m-d", minDate: "today" });
                this.$flatpickr("#dateend", { dateFormat: "Y-m-d", minDate: "today" });
                this.$flatpickr("#datebegint", { dateFormat: "Y-m-d", minDate: this.datefrom, maxDate: this.dateto });
                this.$flatpickr("#dateendt", { dateFormat: "Y-m-d", minDate: this.datefrom, maxDate: this.dateto });
                this.generateSchedule(this.rows, this.datefrom, this.dateto);
            } 
        }
    }
    methods: {
        
        generateSchedule: function (data, dateBegin, dateEnd) {
            // d3.js Grouping
            var groupdata = d3.nest()
              .key(function(d) { return d.employee; })
              .entries(data);
            
            $("#myTable td").remove();
            $("#myTable tr").remove();
            
            var obj = groupdata;
            var thead = document.getElementById('thead');
            var th;
            var foot;
            var tbody = document.getElementById('tbody');
            var tfoot = document.getElementById('tfoot');
            var total = 0;
            
            var datebegin = moment(dateBegin,'YYYY-MM-DD');
            var dateend = moment(dateEnd,'YYYY-MM-DD');
            var totaldays = dateend.diff(datebegin, 'day')+1;
            var datepass = datebegin;
        
        
            th ="<tr>";
            th +="<th class='sticky-col first-col'>Employee</th>";
            for (var i = 0; i < totaldays; i++){
                th +="<th>" + dayjs(datepass).format('MMM/DD') + "</th>";
                datepass = dayjs(datepass).add(1, 'day').format('YYYY-MM-DD');
            }
            th +="</tr>";
            thead.innerHTML = th;
        
            for (var i = 0; i < obj.length; i++) {
                var tr = "<tr>";
                var datepasst = datebegin;
                tr += "<td class='sticky-col first-col' style='width: 15%'>" + obj[i].key + "</td>";
                for (var a = 0; a < totaldays; a++){
                    var marca = false;
                    var statuscolor;
                    for (var b = 0; b < obj[i].values.length; b++){
                        if(dayjs(datepasst).isBetween(obj[i].values[b].datebegin, obj[i].values[b].dateend, null, '[(')) {
                            marca = true
                            statuscolor = obj[i].values[b].type;
                        }
                    }
                    if(marca) {
                        if( statuscolor === "HALF DAY" ) {
                            tr +="<td bgcolor='purple'>" + "" + "</td>";
                        } else if( statuscolor === "DAY OFF" ) {
                            tr +="<td bgcolor='green'>" + "" + "</td>";
                        } else if( statuscolor === "VACATION" ) {
                            tr +="<td bgcolor='orange'>" + "" + "</td>";
                        } else if( statuscolor === "HOLIDAY" ) {
                            tr +="<td bgcolor='blue'>" + "" + "</td>";
                        } else {
                            tr +="<td bgcolor='red'>" + "" + "</td>";
                        }
                    } else {
                        tr +="<td>" + "" + "</td>";
                    }
                    marca = false;
                    datepasst = dayjs(datepasst).add(1, 'day').format('YYYY-MM-DD');
                }
                
                tr += "</tr>";
        
                /* We add the table row to the table body */ 
                tbody.innerHTML += tr;
            }
        }
    }
});