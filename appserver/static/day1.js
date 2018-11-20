require([
'underscore',
'jquery',
'splunkjs/mvc',
'splunkjs/mvc/searchmanager',
'splunkjs/mvc/tableview',
'splunkjs/mvc/simplexml/ready!'], 
function (_, $, mvc,SearchManager,TableView) {
	
        // Create managers
     var newSearchManager=   new SearchManager({
            id: "example-search",
            earliest_time: "$earliest$",
            latest_time: "now",
            preview: true,
            cache: false,
            search: "index=_internal | stats count by sourcetype" 
        });

  	var mytable= new TableView({
            id: "example-table",
            managerid: "example-search",
            pageSize: "5",
            el: $("#mytableview")
        }).render();

});
