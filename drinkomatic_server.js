
/*

drinkOmatic server by Jimmy Eiterjord

Run with:
sudo node drinkomatic_server

Will connect to all serial ports /dev/ttyUSB*
where it will communicate with drinkomatic_fw

Mongo database at 127.0.0.1

Opens http port at 80 for web browser user interface

*/

var motorconfig = "motor_default";
var mongoUrl = "mongodb://127.0.0.1";

var Finder = require('fs-finder');
var files = Finder.from("/dev").findFiles("ttyUSB0");
for (var file in files) {
  console.log("File:" + file);
}

var monk = require('monk');
var db = monk('localhost:27017/drinkomatic');
var collection = db.get('drinkomatic');

var fs = require("fs");
var BodyParser = require("body-parser");
var Cors = require("cors");
var Express = require("express");
var app = Express();

var query = { type: "motorconfig" };
collection.find({query},{},function(err,result){
  if (err) throw err;
  console.log("Available motor configs:");
  for(var i=0;i<result.length;i++){
    console.log(result[i]._id + " " + result[i].name);
  }
  console.log("");
});

var query = { type: "drink" };
collection.find({query},{},function(err,result){
  if (err) throw err;
  console.log("Available drinks:");
  for(var i=0;i<result.length;i++){
    console.log(result[i]._id + " " + result[i].name);
  }
  console.log("");
});

app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use(BodyParser.json());
app.use(Cors())

// Serve static pages from public directory
app.use(Express.static('public'))

var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')
var sports = [];
// List all serial ports and open those with the name ttyUSB
SerialPort.list(function(err, ports) {
  ports.forEach(function(port) {
    portName = port['comName'];
    // If port name includes ttyUSB then open it
    if (portName.includes('ttyUSB')) {
      console.log("Opening serial port " + portName);
      // Open the port
      sport = new SerialPort(portName, { baudRate: 115200 });
      // Add line parser to port
      sport.pipe(new Readline({ delimiter: '\n' })).on('data', parseRecData);
      // Add port to list of ports
      sports.push(sport);
    }
  });

});

function parseRecData(data) {
    console.log("IN: " + data);
    
    // Forward progress output as command to all serial controllers
    // FIX: This will also send back the command to its originating controller
    if (data[0] == 'P') {
	command = data + '\n';
	sports.forEach(function(sport) {
            sport.write(command, function(err) {
                if (err) {
                    res.send([{"status":"error",
                               "message":"Error on write to port: " + err.message}]);
                    console.log("Error on write: " + err.message);
                    return;
                }
                console.log("Command sent to firmware");
            })
        })
    }

}

console.log("");

app.get("/", function(req, res) {
    console.log("Get main page");

    var page = `
    <html><head>
      <meta name="viewport" content="width=500, initial-scale=0.7, maximum-scale=0.7, minimum-scale=0.7">
      <script>
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
      </script>
    </head><body><center>
	<h1>
	<input type='image' src='img/emergencystop.jpg' onclick='stopmotors()' width='100' height='100'/>
        drinkOmatic
    	<input type='image' src='img/emergencystop.jpg' onclick='stopmotors()' width='100' height='100'/>
	</h1>
	`;
    // Select collection from database
    var db = req.db;
    var collection = db.get('drinkomatic');

    // Get all drinks from database
    var query = { type: "drink" };
    collection.find({query},{},function(error,drinks){
	if (error) {
            return res.status(400).send({ "message": error });
	}

	cols = 0;
	page += "<table><tr>";
	// Loop through all available drinks
	
	for(var i=0;i<drinks.length;i++){
            var dname = drinks[i].name;
            var dsysname = drinks[i].sysname;
            var did = drinks[i]._id;;
            console.log("id=" + did + " name=" + dname);
            page += "<td><input type='image' ";
            page += "src=\"img/" + dsysname + ".jpg\" width=\"500\" height=\"500\" "
            page += "onclick='mixdrink(\"" + did + "\")' value='" + dname + "'/><br>"
            page += "<center><h2>" + dname +"</h2></center>";
            page += "</td>";
	    if (cols++ == 2) {
		page += "</tr><tr>";
		cols = 0;
	    }	    
	}
	
	page += `
            </table>
	    <br>
            <br>
            Firmware status: <div id='status'>Ready</div>
	    <a href="mixers">Mixers</a>
            </center></body></html>`;
	res.send(page);
	console.log("");
    });
});

app.get("/mixers", function(req, res) {
    console.log("Get mixers page");

    var page = `
      <html><head>
      <meta name="viewport" content="width=500, initial-scale=0.7, maximum-scale=0.7, minimum-scale=0.7">
      <script>
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
      </script>
    </head><body><center>
	<h1>
	<input type='image' src='img/emergencystop.jpg' onclick='stopmotors()' width='100' height='100'/>
        drinkOmatic - mixers
    	<input type='image' src='img/emergencystop.jpg' onclick='stopmotors()' width='100' height='100'/>
	</h1>
	<table>
	<tr><th>#</th><th>Mixer</th><th>steps/cl</th><th>Control</th></tr>
	`;

    // Select motors from database
    var db = req.db;
    var collection = db.get('drinkomatic');
    var query = { type: "motorconfig" };
    collection.find({query},{},function(err,motorspecs){
	if (err) throw err;
	console.log("Available motors:");
        for(key in motorspecs[0].motors){
            var motor = motorspecs[0].motors[key].motor;
            var mixer = motorspecs[0].motors[key].mixer;
            var stepspercl = motorspecs[0].motors[key].stepspercl;
            console.log("motor=" + motor +
			" mixer=" + mixer +
			" stepspercl=" + stepspercl);
	    page += "<tr><td>"
		+ motor + "</td><td>"
		+ mixer + "</td><td>"
		+ stepspercl + "</td><td>"
		+ "<input type='image' src='img/buttonbackward.png' onclick='runmotor("
		+ motor + ",-" + stepspercl + ")' width='50' height='50'>"
		+ "&nbsp;&nbsp;&nbsp"
		+ "<input type='image' src='img/buttonforward.png' onclick='runmotor("
		+ motor + "," + stepspercl + ")' width='50' height='50'>"
		+ "&nbsp;&nbsp;&nbsp"
		+ "<input type='image' src='img/buttonforward.png' onclick='runmotor("
		+ motor + "," + stepspercl*10 + ")' width='50' height='50'>"
		+ "</td></tr>";	    
        }
	page += `
  	   </table>
	    <br>
            <br>
            Firmware status: <div id='status'>Ready</div>
            </center></body></html>`;
	res.send(page);
	console.log("");
    });
});

app.get("/runmotor/:motor/:steps", function(req, res) {
    console.log("Get /runmotor motor=" + req.params.motor + " steps=" + req.params.steps);

    var motor = req.params.motor;
    var steps = req.params.steps;

    // Combine motor config with drink config
    var command = "M";
    var statusok = true;
    if (steps > 0) {	
        command += motor + ":" + steps + ":800";
    } else {
        command += motor + ":" + -steps + ":-800";
    }
    command += "\n";
    console.log("Firmware command: " + command );

    // Send command to firmware on all serial ports to mix drinks
    sports.forEach(function(sport) {
        sport.write(command, function(err) {
            if (err) {
                res.send([{"status":"error",
                           "message":"Error on write to port: " + err.message}]);
                console.log("Error on write: " + err.message);
                return;
            }
            console.log("Command sent to firmware");
        })
    })
    res.send([{"status":"ok"}]);
});

app.get("/mixdrink/:id", function(req, res) {
    console.log("Get /mixdrink id=" + req.params.id);
    // Select collection from database
    var db = req.db;
    var collection = db.get('drinkomatic');

    // Get requested drink from database
    var query = { _id: req.params.id };
    collection.find({query},{},function(error,drinkspecs){
        if (error) {
          return res.status(400).send({ "message": error });
        }
        var dname = drinkspecs[0].name;
        var dmixers = drinkspecs[0].mixers;
        console.log("Mixing drink: " + dname);

        // Get first motorconfig from database
        var query = { type: "motorconfig" };
        collection.find({query},{},function(error,motorspecs){
            if (error) {
              return res.status(400).send({ "message": error });
            }
            console.log("Reading motor config: ");

            // Prepare motor config
            var mixermotors = {};
            for(key in motorspecs[0].motors){
              var motor = motorspecs[0].motors[key].motor;
              var mixer = motorspecs[0].motors[key].mixer;
              var stepspercl = motorspecs[0].motors[key].stepspercl;
              mixermotors[mixer] = {motor,stepspercl};
              console.log("motor=" + motor +
                   " mixer=" + mixer +
                   " stepspercl=" + stepspercl);
            }

            // Combine motor config with drink config
            var command = "M";
            var statusok = true;
            console.log("Selecting motors: ");
            for(key in dmixers) {
              if (command.length > 1) {
                command += "&";
              }
              var mixer = dmixers[key].mixer;
              var amount = dmixers[key].amount;
              if (!mixermotors[mixer]) {
                console.log("Mixer missing in motor config: " + mixer);
                res.send([{"status":"error",
                           "message":"Mixer missing in motor config: " + mixer}]);
                return;
              }
              var {motor,stepspercl} = mixermotors[mixer];
              console.log("mixer=" + mixer + " motor=" + motor + " amount=" + amount);
              command += motor + ":" + amount * stepspercl + ":500";
            }
            command += "\n";
            console.log("Firmware command: " + command );

            // Send command to firmware on all serial ports to mix drinks
            sports.forEach(function(sport) {
              sport.write(command, function(err) {
                if (err) {
                  res.send([{"status":"error",
                            "message":"Error on write to port: " + err.message}]);
                            console.log("Error on write: " + err.message);
                            return;
                }
                console.log("Command sent to firmware");
              })
            })
            res.send([{"status":"ok"}]);
          });
    });
});

app.get("/stopmotors", function(req, res) {
    console.log("Get /stopmotors");

    // Combine motor config with drink config
    var command = "S\n";
    console.log("Firmware command: " + command );
    
    // Send command to firmware on all serial ports to mix drinks
    sports.forEach(function(sport) {
        sport.write(command, function(err) {
            if (err) {
                res.send([{"status":"error",
                           "message":"Error on write to port: " + err.message}]);
                console.log("Error on write: " + err.message);
                return;
            }
            console.log("Command sent to firmware");
        })
    })
    res.send([{"status":"ok"}]);
});

app.listen(80, function() {
    console.log("Starting drinkomatic node server on standard HTTP port 80...\n");
});

//}
