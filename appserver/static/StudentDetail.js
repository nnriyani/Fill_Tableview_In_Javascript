require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/utils',
    'splunkjs/mvc/simplexml/ready!'],
  function(_, $, mvc, SearchManager, TableView,util) {

        function getFormToken() {
            var tokens = mvc.Components.getInstance('default', {create: true});
            var tokenkey = tokens.get("form.tknkey");
            //tokens.set("form.tknkey", tokenkey);
            $("#tknstudentkey").val(tokenkey);
        }

        var service = mvc.createService({
            owner: "nobody"
        });

        var searchFilter = "";
        var kvSearchManager = new SearchManager({
            id: "kvcollection-search",
            preview: true,
            cache: false,
            search: "|inputlookup studentmark_lookup | eval keyid = _key, Delete=\"Delete\" | table keyid, studentkey,grn, std, subject, obtainedmarks, totalmarks, Delete" 
        }, {
            tokens: true
        });

        var mytable = new TableView({
            id: "kvcollection-table",
            managerid: "kvcollection-search",
            pageSize: "10",
            wrap: true,
            drilldown: "cell",
            el: $("#dvstudentmarkkv")
        });
      
        function fillData() {
              //mytable.table.addCellRenderer(new CustomRangeRenderer());
              mytable.render();
        }
      
        fillData();

        getFormToken();

        $("#btnsubmit").on("click", function() {
            var tknkey = $("#tknkey").val();
            var tknstudentkey = $("#tknstudentkey").val();
            var tkngrn = $("#tkngrn").val();
            var tknstd = $("#tknstd").val();
            var tknsubject = $("#tknsubject").val();
            var tknobtainedmarks = $("#tknobtainedmarks").val();
            var tkntotalmarks = $("#tkntotalmarks").val();
            var url = "storage/collections/data/studentmarkcollection/";
            if(tknkey != '') // in case of update operation
            {
              url +=  tknkey + "/";
            }
           
            var record = {
                "studentkey": tknstudentkey,
                "grn": tkngrn,
                "std":tknstd,
                "subject":tknsubject,
                "obtainedmarks":tknobtainedmarks,
                "totalmarks":tkntotalmarks
            };
            console.log(record);
            var result = mandatoryCheck(record)
            if(result)
            {
                service.request(
                    url,
                    "POST",
                    null,
                    null,
                    JSON.stringify(record), {
                        "Content-Type": "application/json"
                    },
                    null);
                //     var tokens = mvc.Components.getInstance("default");
                //     tokens.unset("form.tkngrn");
                //     tokens.unset("form.tknfname");
                //     tokens.unset("form.tknkey");
                
                kvSearchManager.startSearch();
                fillData();
                $("#tknkey").val("");
                $("#tkngrn").val("");
                $("#tknstd").val("");
                $("#tknsubject").val("");
                $("#tknobtainedmarks").val("");
                $("#tkntotalmarks").val("");

            }
            
       });

    mytable.on("click", function(e){
        e.preventDefault();
        console.log("data is: " , e.data);
        var keyid = e.data["row.keyid"];
        if(e.data["click.name2"] == "Delete")
        {
            if(confirm("Are you sure you want to delete?"))
            {            
                service.del("storage/collections/data/studentmarkcollection/" + encodeURIComponent(keyid))
                .done(function() {
                    kvSearchManager.startSearch();
                    fillData();
                    return;
                });
            }
        return false;
        }
        else{
             $("#tknkey").val( e.data["row.keyid"]);
             $("#tknstudentkey").val( e.data["row.studentkey"]);
             $("#tkngrn").val( e.data["row.grn"]);
             $("#tknstd").val( e.data["row.std"]);
             $("#tknsubject").val( e.data["row.subject"]);
             $("#tknobtainedmarks").val( e.data["row.obtainedmarks"]);
             $("#tkntotalmarks").val( e.data["row.totalmarks"]);
        }
    
    });
 });