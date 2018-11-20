require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'
  ],
  function(_, $, mvc) {

        /*******************General code end********************* */

//   var service = mvc.createService({ owner: "nobody" });
    var service = mvc.createService({ owner: "nobody" });
    console.log(service);
    var ajaxData = {
        
    };
   
    // console.log(service);
    service.get('data/ui/nav', ajaxData, function (err, response) {
        //console.log(response);
        if(response.data.entry[0].content["eai:data"]!=undefined)
        {
            $("#txtnav").val(response.data.entry[0].content["eai:data"]);
             //console.log(response.data.entry[0].content["eai:data"]);
        }
    });


    $("#btnSubmit").on("click", function() {
        var data = $("#txtnav").val();
        var record = {
            'eai:data': data
        };

            var res= service.request(
                    "data/ui/nav",
                    "POST",
                    null,
                    null,
                    record, 
                    null,
                    null);
                   
                console.log(res);
            });           
});



  // service.get('data/ui/nav/default','Content-Type: application/xml' , '"eai:data"='+ data, function (err, response) {
        //     console.log(response);
        // });

        // service.post('data/ui/nav/default', '"eai:data"='+ data, function (err, response) {
        //     console.log(response);
        // });