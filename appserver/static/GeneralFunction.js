require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'],
  function(_, $, mvc) {

        var clearAllTokens = function ()
        {
            var tokens = mvc.Components.getInstance("default");
            tokens.unset("form.tknkey");
            tokens.unset("form.tkngrn");
            tokens.unset("form.tknfname");
        }

 });