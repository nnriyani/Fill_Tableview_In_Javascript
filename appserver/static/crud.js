require([
  'underscore',
  'jquery',
  'splunkjs/mvc',
  'splunkjs/mvc/searchmanager',
  'splunkjs/mvc/tableview',
  'splunkjs/mvc/utils',
  'splunkjs/mvc/simplexml/ready!'
],
function(_, $, mvc, SearchManager, TableView,utils) {


    // table draw events
//   var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
//     canRender : function (cell) {
//             return true;
//         //return _(['Needs Attention']).contains(cell.field);
//     },
//     render : function ($td, cell) {
//         //console.log(cell.value);
//         if (cell.value == "Add Marks") {
//             $td.html("<a href='http://10.0.1.79:8000/en-US/app/SplunkHandsOn_Day1/studentmarks'>" + cell.value + "</a>");
//         } else {
//             $td.html("<div>" + cell.value + "</div>");
//         }
//     }
// });

  /************************GENERAL code for search******************************** */
  var searchFilter = "";
  var kvSearchManager = new SearchManager({
      id: "kvcollection-search",
      preview: true,
      cache: false,
      search: "|inputlookup student_lookup | eval keyid = _key | eval AddMarks = \"Add Marks\" |table keyid, grn, fname, AddMarks " 
  }, {
      tokens: true
  });
  var mytable = new TableView({
      id: "kvcollection-table",
      managerid: "kvcollection-search",
      pageSize: "10",
      wrap: true,
      drilldown: "cell",
      el: $("#dvstudentkv")
  });

  function fillData() {
        //mytable.table.addCellRenderer(new CustomRangeRenderer());
        mytable.render();
  }

  fillData();


  


 
  /*******************General code end********************* */
  var service = mvc.createService({
      owner: "nobody"
  });
  
  
  /*************************Click Events********************************* */

mytable.on("click", function(e) {

   
    e.preventDefault();
    console.log("data is: " , e.data);
    console.log("name is: " , e.data['row.fname']);
    var keyid = e.data['row.keyid'];
    var grn = e.data['row.grn'];
    var fname = e.data['row.fname'];

  //debugger;
  
    if(e.data['click.name2'] == "AddMarks")
    {
        var url = "http://10.0.1.79:8000/en-US/app/SplunkHandsOn_Day1/studentmarks?form.tknkey=" + keyid;
        utils.redirect(url, false)
        return false;
    }
    
      
    var tokens = mvc.Components.get("default");
    tokens.set("form.tkngrn", grn);
    tokens.set("form.tknkey", keyid);
    tokens.set("form.tknfname", fname);
    var tokenFname = tokens.get("tknfname");
    var tokenkey = tokens.get("tknkey");

    // ONE WAY TO SET PARAMETER< BUT IT WOULD REFRESH WHOLE URL
    // var url = "http://10.0.1.79:8000/en-US/app/SplunkHandsOn_Day1/day2_handson?form.tkngrn=" + grn +"&form.tknfname="+fname+"&form.tknkey="+keyid;
    // utils.redirect(url, false)

});

  $("#btnsubmit").on("click", function() {
     
      var tokens = mvc.Components.get("default");
      var tokenGRN = tokens.get("tkngrn");
      var tokenFname = tokens.get("tknfname");
      var tokenkey = tokens.get("tknkey");
      var url = "storage/collections/data/studentcollection/";
      //alert(tokenkey);
      
      if(tokenkey != '') // in case of update operation
      {
        url +=  tokenkey + "/";
      }
     
      //"_key": encodeURIComponent(tokenkey),
      var record = {
          "grn": tokenGRN,
          "fname": tokenFname
      };
      console.log(JSON.stringify(record)); 
      var result = mandatoryCheck(record)
      //alert(result);
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
                var tokens = mvc.Components.getInstance("default");
                tokens.unset("form.tkngrn");
                tokens.unset("form.tknfname");
                tokens.unset("form.tknkey");
            kvSearchManager.startSearch();
            fillData();
        }
  });

  $("#btndelete").on("click", function() {

      var tokens = mvc.Components.get("default");
      var tokenkey = tokens.get("tknkey");

      // Delete the record that corresponds to the key ID using
      service.del("storage/collections/data/studentcollection/" + encodeURIComponent(tokenkey))
          .done(function() {
              kvSearchManager.startSearch();
              fillData();
              console.log("it works");
              var tokens = mvc.Components.getInstance("default");
              tokens.unset("form.tknkey");
              return;
          });
      return false;
  });

  $("#btnreset").on("click", function(){
        var tokens = mvc.Components.getInstance("default");
        tokens.unset("form.tknkey");
        tokens.unset("form.tkngrn");
        tokens.unset("form.tknfname");
        return;
  });


  $("#btnsearch").on("click", function() {

        var tokens = mvc.Components.get("default");
        var tokenopt = tokens.get("tknoptcritearea");
        var tokenvalue = tokens.get("tknvalue");
        
        
        if(tokenopt == "fname")
        {
            searchFilter = " | Where " + tokenopt + "=\"" + tokenvalue + "\"";
        }
        else if(tokenopt == "grn")
        {
            searchFilter = " | Where " + tokenopt + "=" + tokenvalue ;
        }
        else
        {
            searchFilter = "";
        }
        
        //alert("|inputlookup student_lookup | eval keyid = _key | table keyid, grn, fname " + searchFilter);
        kvSearchManager.settings.set("search", "|inputlookup student_lookup | eval keyid = _key | table keyid, grn, fname " + searchFilter);
        kvSearchManager.startSearch();
        fillData();
   
});



});