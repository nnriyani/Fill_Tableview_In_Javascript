require([
'underscore',
'jquery',
'splunkjs/mvc',
'splunkjs/mvc/searchmanager',
'splunkjs/mvc/tableview',
'splunkjs/mvc/chartview',
 'splunkjs/mvc/singleview',
'splunkjs/mvc/simplexml/ready!'], 
function (_, $, mvc,SearchManager,TableView, ChartView, SingleView) {

   // Create managers Top 5 record
   
     var sourcetypeSearchManager=   new SearchManager({
            id: "sourcetype-search",
            earliest_time: "$timerange.earliest$",
            latest_time: "$timerange.latest$",
            preview: true,
            cache: false,
            search: "sourcetype=$src_type$ | table _raw | sort 5 _time" 
        },{tokens: true, tokenNamespace: "submitted"});


	var mytable= new TableView({
            id: "example-table",
            managerid: "sourcetype-search",
            pageSize: "5",
            el: $("#mytableview")
        }).render();


     var top10SourcetypeSearchManager=   new SearchManager({
            id: "top10sourcetype-search",
           // earliest_time: "$timerange.earliest$",
            //latest_time: "$timerange.latest$",
            preview: true,
            cache: false,
            search: "index=main | stats count as TotalRecord by sourcetype | sort top 10 -TotalRecord" 
        });

    barchart = new ChartView({
            id: "bar-chart",
            managerid: "top10sourcetype-search",
            type: "bar",
            "charting.chart.stackMode": "sourcetype", // Place complex property names within quotes
            "charting.legend.placement": "TotalRecord",
            el: $("#mybarchartview")
        }).render();

     // Respond to a click event
        barchart.on("click:chart", function (e) {
            e.preventDefault(); // Prevent redirecting to the Search app
            console.log("Clicked chart: ", e); // Print event info to the console
        });

 var trendViewSearchManager=   new SearchManager({
            id: "trendViewsourcetype-search",
            preview: true,
            cache: false,
            search: "sourcetype=$src_type$ | timechart span=1d count(_raw) by sourcetype" 
        },{tokens: true, tokenNamespace: "submitted"});

 // Instantiate components
    var singleView =   new SingleView({
            id: "trendView1",
            managerid: "trendViewsourcetype-search",
            beforeLabel: "Trend by SourceType:",
            el: $("#trendviewbysourcetype")
        }).render();
});
