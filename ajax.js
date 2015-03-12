// ajax.js

var request = new XMLHttpRequest();
request.onreadystatechange = function() {
	if(request.readystate === 4) {
		document.getElementById('divGrid').innerHTML = request.responseText;
	}
};

request.open('GET', 'index.html');
request.send();