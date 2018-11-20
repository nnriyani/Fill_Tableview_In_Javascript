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


        var sourcetypeSearchManager=   new SearchManager({
            id: "sourcetype-search",
            earliest_time: "$timerange.earliest$",
            latest_time: "$timerange.latest$",
            preview: true,
            cache: false,
            search: "sourcetype=$src_type$ | table _raw, source | sort 5 _time" 
        },{tokens: true, tokenNamespace: "submitted"});


        sourcetypeSearchManager.on('search:failed', function(properties) {
            // Print the entire properties object
            console.log("FAILED:", properties);
        });

        sourcetypeSearchManager.on('search:progress', function(properties) {
            // Print just the event count from the search job
            console.log("IN PROGRESS.\nEvents so far:", properties.content.eventCount);
        });

        sourcetypeSearchManager.on('search:done', function(properties) {
            // Print the search job properties
            console.log("DONE!\nSearch job properties:", properties.content);
            if (properties.content.resultCount === 0) {
                alert("no results");
                }
        });

        sourcetypeSearchManager.on("change", function() {
           console.log("Query change event called");
        });


	// var mytable= new TableView({
    //         id: "example-table",
    //         managerid: "sourcetype-search",
    //         pageSize: "5",
    //         type: "raw",
    //         "raw.drilldown": "inner",
    //         el: $("#mytableview")
    //     }).render();


    //     mytable.on("click", function(e) {
    //         // Bypass the default behavior
    //         e.preventDefault();
    //         alert("Table row clicked", e.data);
    //         // Displays a data object in the console
    //         console.log("Clicked the table:", e.data);
    //     });


    // Cell click event
    var mytable= new TableView({
        id: "example-table",
        managerid: "sourcetype-search",
        pageSize: "5",
        drilldown: "cell",
        "raw.drilldown": "inner",
        el: $("#mytableview")
    }).render();


    mytable.on("click:cell", function(e) {
        // Bypass the default behavior
        e.preventDefault();
        alert("Table row clicked  " +  e.data);
        // Displays a data object in the console
        console.log("Clicked the table:", e.data);
    });


    });