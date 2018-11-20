require([
		'underscore',
		'jquery',
		'splunkjs/mvc',
		'splunkjs/mvc/simplexml/ready!'
	],
	function (_, $, mvc) {
		
	// XML validator initilizations
	var xt = "", h3OK = 1;
	
	// Splunk service initilizations
	var service = mvc.createService({ owner: "nobody" });
	var ajaxData = {};
	console.log(service);
	console.log(service.request);

	// Validate XML content
	function validateNavigation(navFileText) {
		if ($.trim(navFileText) == "") {
			errorMessage('Encountered the error while trying to update: Navigation can not left empty');
			return false;
		}

		// code for IE
		if (window.ActiveXObject) {
			var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = false;
			xmlDoc.loadXML(navFileText);
			if (xmlDoc.parseError.errorCode != 0) {
				let error = "Error Code: " + xmlDoc.parseError.errorCode + "\n";
				error += "Error Reason: " + xmlDoc.parseError.reason;
				error += "Error Line: " + xmlDoc.parseError.line;
				errorMessage('Encountered the error while trying to update: Error parsing XML ' + error);
			} else {
				return true;
			}
		}
		// code for Mozilla, Firefox, Opera, chrome, etc.
		else if (document.implementation.createDocument) {
			var parser = new DOMParser();
			var xmlDoc;
			
			try {
				xmlDoc = parser.parseFromString(navFileText, "application/xml");
			} catch (err) {
				errorMessage(err.message);
			}

			if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
				checkErrorXML(xmlDoc.getElementsByTagName("parsererror")[0]);
				errorMessage('Encountered the error while trying to update: Error parsing XML ' + xt);
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
		return true;
	}
	
	function checkErrorXML(x) {
		xt = "";
		h3OK = 1;
		checkXML(x);
	}

	function checkXML(n) {
		var l, i, nodeName;
		nodeName = n.nodeName;
		if (nodeName === "h3") {
			if (h3OK === 0) {
				return;
			}
			h3OK = 0;
		}
		if (nodeName === "#text") {
			xt += n.nodeValue + "\n"
		}
		l = n.childNodes.length;
		for (i = 0; i < l; i++) {
			checkXML(n.childNodes[i])
		}
	}

	function errorMessage(text) {
		$(".navErrorMessage").html("<div class='alert'><span style='color: #FF0000;'>" + text + '</span></div>');
	}

	function sucessMessage(text) {
		$(".navErrorMessage").html("<div class='alert'></i><span style='color: #00b050;'>" + text + '</span></div>');
	}

	function apiRequest(url, method, data, callback) {
		var response = service.request( url, method, null, null, data, null, function(err,response){
			callback(err,response);
		});
	}

	function getNavigation() {
		apiRequest('data/ui/nav', 'GET', ajaxData, function (err, responseData) {
			console.log(responseData);
			$(".txtnav").val("");
			if(err) {
				errorMessage("Unable to load navigation file. Contact administrator.");
			} else if (responseData.data.entry[0].content["eai:data"] != undefined) {
				$(".txtnav").val(responseData.data.entry[0].content["eai:data"]);
			}
		});
	}
	// Reload navigation
	function reloadNav() {
		var res = service.request("data/ui/nav/_reload", "GET", null, null, null, null, function(err,responseData){
			if(err) {
					errorMessage("Unable to refresh navigation file. Contact administrator.");
			} else {
				sucessMessage('Navigation file save & refreshed sucessfully. <a class="reload_page"> click</a> to reload page.');
				$(".reload_page").on("click", function () {
					window.location.reload();
				});
			}
		});
	}

	
	// on Save navigation
	$(".btn-primary").on("click", function () {
		var navFileText = $(".txtnav").val();
		if (validateNavigation(navFileText)) {
			var record = {
				'eai:data': navFileText
			};
			apiRequest('data/ui/nav/default', 'POST', record, function (err,responseData) {
				if(err) {
					errorMessage("Unable to save navigation file. Contact administrator.");
				} else {
					reloadNav();
				}
			});
		}
	});

	// on cancel navigation
	$(".edit-cancel").on("click", function () {
		getNavigation();
		sucessMessage('Navigation file loaded sucessfully.');
	});
	
	getNavigation();
});
