
if(typeof martynbiz === "undefined") martynbiz = {};

/**
 * Ajax caller with built in caching (something jquery doesn't offer)
 * Dependencies: cache, utils
 */
martynbiz.ajax = function() {

	/**
	 * prepare the data depending on what dataType is (e.g. JSON)
	 * @param mixed data The data to convert to another type (e.g json)
	 * @param string dataType e.g. "json"
	 * @return mixed Prepared data
	 */
	var _prepareData = function (data, dataType) {
		switch(dataType.toUpperCase()) {
		  case "JSON":
		    data = JSON.parse(data);
		    break;
		}
		return data;
	};

	/**
	 * Fetch data from the server
	 */
	var _fetch = function(options) {

 		// default options
 		options = martynbiz.utils.extend({
 			success: function() {},
 			cache: false,
 			method: "GET",
 			dataType: "text",
 			data: null
 		}, options);

 		// check cache
 		if(options.cache && _Cache.get(options.url)) {
 			options.success(_prepareData(_Cache.get(options.url), options.dataType), options.dataType);
 			return true;
 		}

 		// make ajax call
 		var xmlhttp;
 		if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
 		  xmlhttp = new XMLHttpRequest();
 		} else {// code for IE6, IE5
 		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
 	  }
 		xmlhttp.onreadystatechange = function() {
 			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
 				_Cache.insert(options.url, xmlhttp.responseText, options.dataType);
 				options.success(_prepareData(xmlhttp.responseText, options.dataType));
 			}
 		}
 		xmlhttp.open(options.method.toUpperCase(), options.url, true);
 		if(options.method.toUpperCase() === 'POST') {
 			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
 			var data = function(data) {
 				var pairs = [];
 				for(var name in data) {
 					pairs.push(name+"="+data[name]);
 				}
 				return pairs.join("&");
 			}(options.data);
 			xmlhttp.send(data);
 		} else {
 			xmlhttp.send();
 		}

 	};

	// return public properties and
	return _this = {
		options: {},
		fetch: _fetch,
	}

}();
