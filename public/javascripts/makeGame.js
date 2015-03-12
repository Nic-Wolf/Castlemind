var xhr = new XMLHttpRequest();
xhr.onload = function() {
	var data = JSON.parse(xhr.responseText);

	console.log(data.path);

};
xhr.open('get', '/api/game');
xhr.send();