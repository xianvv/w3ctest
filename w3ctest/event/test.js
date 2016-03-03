/**
 * Created by xianvv on 2016/3/3.
 */
var outerDiv = document.getElementsByClassName("outerDiv");
var middleTable = document.getElementsByClassName("middleTable");
var middleTd = document.getElementsByClassName("middleTd");
var innerBtn = document.getElementById("innerBtn");
var dldBtn = document.getElementById("dld");

dldBtn.addEventListener("click", function(e) {
	console.warn("捣乱的来了。");
});

innerBtn.addEventListener("click", function(e) {
	//	e.stopPropagation();
	console.log("innerBtn clicked.e:" + e.eventPhase + " event:" + event.eventPhase);
});
innerBtn.addEventListener("click", function(e) {
	//	e.stopPropagation();
	console.log("innerBtn clicked 2.e:" + e.eventPhase + " event:" + event.eventPhase);
});
innerBtn.onclick = function(e) {
	//	e.stopPropagation();
	console.info("innerBtn onclick trigger.e:" + e.eventPhase + " event:" + event.eventPhase);
};

outerDiv[0].addEventListener("click", function(e) {
	console.log("outerDiv clicked.e:" + e.eventPhase + " event:" + event.eventPhase);
});
middleTable[0].addEventListener("click", function(e) {
	console.log("middleTable clicked.e:" + e.eventPhase + " event:" + event.eventPhase);
});
middleTd[0].addEventListener("click", function(e) {
	console.log("middleTd clicked.e:" + e.eventPhase + " event:" + event.eventPhase);
}, true);