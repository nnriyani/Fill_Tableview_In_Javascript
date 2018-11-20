
 function mandatoryCheck(record)
 {
     var val = true;
   $.each(record, function( key, value ) {
       //alert( key + ": " + value );
       
       if(value == "")
        {
           alert(key + " can not left empty");
           val = false;
        }   
     });
     return val;
 }
