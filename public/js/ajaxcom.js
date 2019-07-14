
var alcometerToPromilleOffset = 120;
var alcometerToPromilleFactor = 0.05;    
var alcometerPromille = 0.0;
var alcometerRaw = 0;
var oldstatus = '';

function mixdrink(drink) {
    // Check that this drink is enabled to be selected
    if (document.getElementById("drink" + drink).getAttribute("data-enabled") == "false") {
	return;
    }

    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4) {
            if(ajaxRequest.status == 200) {
		oldstatus = ajaxRequest.responseText;
		document.getElementById("status").innerHTML = ajaxRequest.responseText;
            }
        }
    }
    ajaxRequest.open('GET', '/mixdrink/' + drink);
    ajaxRequest.send();
}

function stopmotors() {
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4) {
            if(ajaxRequest.status == 200) {
		oldstatus = ajaxRequest.responseText;
		document.getElementById("status").innerHTML = ajaxRequest.responseText;
            }
        }
    }
    ajaxRequest.open('GET', '/stopmotors');
    ajaxRequest.send();
}

function updateAlcometer(alcometer) {
    alcometerRaw = alcometer;
    // Calculate new promille
    if (alcometerRaw > alcometerToPromilleOffset) {
	alcometerPromille = Math.floor((alcometerRaw - alcometerToPromilleOffset) * alcometerToPromilleFactor * 1000) / 1000;
    } else {
	alcometerPromille = 0;
    }

    // Update text field
    document.getElementById("alcometer").innerHTML = alcometerPromille + " (raw " + alcometerRaw + ")";

    // Loop through drinks and update elements 
    var drinks = document.getElementsByClassName("drink");
    for (i=0;i < drinks.length; i++) {
	var alcomin = drinks[i].getAttribute("data-alcomin");
	var alcomax = drinks[i].getAttribute("data-alcomax");
	var enabled = drinks[i].getAttribute("data-enabled");
	if (((alcomin != 'undefined') && (alcometerPromille < alcomin)) ||
	    ((alcomax != 'undefined') && (alcometerPromille > alcomax))) {
	    if (enabled != 'false') {		
		drinks[i].style.opacity = "0.1";
		drinks[i].setAttribute("data-enabled","false");
		console.log("Changing " + i + " to false");
	    }
	} else {
	    if (enabled != 'true') {		
		drinks[i].style.opacity = "1.0";
		drinks[i].setAttribute("data-enabled","true");
		console.log("Changing " + i + " to true");
	    }
	}
    }
    
}

function getstatus() {
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4) {
            if(ajaxRequest.status == 200) {
		if (ajaxRequest.responseText != oldstatus) {
		    oldstatus = ajaxRequest.responseText;
		    document.getElementById("status").innerHTML = ajaxRequest.responseText;		
		    var ajaxData = JSON.parse(ajaxRequest.responseText);
		    updateAlcometer(ajaxData[0].alcometer);
		    document.getElementById("rfid").innerHTML = ajaxData[0].rfid;
		    document.getElementById("progress").innerHTML = ajaxData[0].progress;	      
		}
	    }
        }
    }
    ajaxRequest.open('GET', '/getstatus');
    ajaxRequest.send();
}

window.onload = function(){
    var gsid = setInterval(getstatus,100);
}

function runmotor(motor,steps) {
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4) {
            if(ajaxRequest.status == 200) {
		oldstatus = ajaxRequest.responseText;
		document.getElementById("status").innerHTML = ajaxRequest.responseText;		
            }
        }
    }
    ajaxRequest.open('GET', '/runmotor/' + motor + '/' + steps);
    ajaxRequest.send();
}
    
