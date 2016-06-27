function drag(e) {
	e.dataTransfer.setData("tz", e.target.id);
}

function allowdrop(e) {
	e.preventDefault();
}

function drop(e) {
	e.preventDefault();
	var data = e.dataTransfer.getData("tz");
	var el = document.getElementById(data);
	e.target.appendChild(el);
}

var spanToDrag = document.getElementById("o");
var divlist = document.getElementsByTagName("div");

spanToDrag.addEventListener("dragstart", drag);
for (var i = 0; i < divlist.length; i++) {
	var div = divlist[i];
	div.addEventListener("dragover", allowdrop);
	div.addEventListener("drop", drop);
}