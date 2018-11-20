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
            preview: true,
            cache: false,
            earliest_time: "-1h@h", 
            latest_time: "now",
            search: "index=_internal sourcetype=splunkd | stats sparkline count by source |  rangemap field=count low=0-100 elevated=101-1000 default=severe" 
        },{tokens: true, tokenNamespace: "submitted"});

	    var mytable= new TableView({
            id: "example-table",
            managerid: "sourcetype-search",
            pageSize: "5",
          
            el: $("#mytableview"),
            // Format the sparkline cell
            format: {
                "sparkline": [ // This field name is required
                    {
                        "type": "sparkline", // This property must be "sparkline"

                        // Sparkline options
                        "options": 
                        {
                            "type": "bar",
                            "height": "40px", 
                            "barWidth": "5px",
                            "colorMap": 
                            {
                                "100:": "#0033CC", 
                                ":99": "#00FF00"
                            }
                        }
                    }
                ]
            }
        }).render();

         // Define icons for the custom table cell
         var ICONS = {
            severe: "alert-circle",
            elevated: "alert",
            low: "check-circle"
        };

        // Use the BaseCellRenderer class to create a custom table cell renderer
        var CustomCellRenderer = TableView.BaseCellRenderer.extend({ 
            canRender: function(cellData) {
                // This method returns "true" for the "range" field
                return cellData.field === "range";
            },

            // This render function only works when canRender returns "true"
            render: function($td, cellData) {
                console.log("cellData: ", cellData);

                var icon = "question";
                if(ICONS.hasOwnProperty(cellData.value)) {
                    icon = ICONS[cellData.value];
                }
                $td.addClass("icon").html(_.template('<i class="icon-<%-icon%> <%- range %>" title="<%- range %>"></i>', {
                    icon: icon,
                    range: cellData.value
                }));
            }
        });

            // Create an instance of the custom cell renderer,
            // add it to the table, and render the table
            var myCellRenderer = new CustomCellRenderer(); 
            mytable.addCellRenderer(myCellRenderer);  
            mycustomcelltable.render();

    });