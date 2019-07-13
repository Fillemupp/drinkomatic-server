
function mixdrink(drink) {
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4) {
            if(ajaxRequest.status == 200) {
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
		document.getElementById("status").innerHTML = ajaxRequest.responseText;
            }
        }
    }
    ajaxRequest.open('GET', '/stopmotors');
    ajaxRequest.send();
}

function getstatus() {
    var alcometerToPromilleOffset = 120;
    var alcometerToPromilleFactor = 0.001;    
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4) {
            if(ajaxRequest.status == 200) {
		document.getElementById("status").innerHTML = ajaxRequest.responseText;
		var ajaxData = JSON.parse(ajaxRequest.responseText);
		alcometer = ajaxData[0].alcometer;
		if (alcometer > alcometerToPromilleOffset) {
		    alcometerPromille = Math.floor((alcometer - alcometerToPromilleOffset) * alcometerToPromilleFactor * 1000) / 1000;
		} else {
		    alcometerPromille = 0;
		}
		document.getElementById("alcometer").innerHTML = alcometerPromille;
		document.getElementById("rfid").innerHTML = ajaxData[0].rfid;
		document.getElementById("progress").innerHTML = ajaxData[0].progress;	      
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
		document.getElementById("status").innerHTML = ajaxRequest.responseText;		
            }
        }
    }
    ajaxRequest.open('GET', '/runmotor/' + motor + '/' + steps);
    ajaxRequest.send();
}
    
