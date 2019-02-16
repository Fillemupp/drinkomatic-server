
/*

drinkOmatic server by Jimmy Eiterjord

Run with:
sudo node drinkomatic-server

Will connect to:
drinkomatic-fw at serial port /dev/ttyUSB0
Mongo database at 127.0.0.1

Opens http port at 80 for web browser user interface

*/

var motorconfig = "motor_default";
var serialpath1 = "/dev/ttyUSB0";
var serialpath2 = "/dev/ttyUSB1";
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
console.log("Opening serial port 1");
var sport1 = new SerialPort(serialpath1, { baudRate: 115200 });
console.log("Opening serial port 2");
var sport2 = new SerialPort(serialpath2, { baudRate: 115200 });

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
      </script>
    </head><body><center>
      <h1>drinkOmatic</h1>`;

    // Select collection from database
    var db = req.db;
    var collection = db.get('drinkomatic');

    // Get all drinks from database
    var query = { type: "drink" };
    collection.find({query},{},function(error,drinks){
      if (error) {
        return res.status(400).send({ "message": error });
      }

      // Loop through all available drinks
      for(var i=0;i<drinks.length;i++){
        var dname = drinks[i].name;
        var dsysname = drinks[i].sysname;
        var did = drinks[i]._id;;
        console.log("id=" + did + " name=" + dname);
        page += "<input type='image' ";
        page += "src=\"img/" + dsysname + ".jpg\" width=\"500\" height=\"500\" "
        page += "onclick='mixdrink(\"" + did + "\")' value='" + dname + "'/><br>"
        page += "<h2>" + dname +"</h2>";
        page += "<br/><br/>";
      }
      page += `
          <br>
          <br>
          Firmware status: <div id='status'>Ready</div>
        </center></body></html>`;
      res.send(page);
      console.log("");
    });
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

            // Send command to firmware and mix drinks
            sport1.write(command, function(err) {
              if (err) {
                res.send([{"status":"error",
                           "message":"Error on write to sport1: " + err.message}]);
                console.log("Error on write: " + err.message);
                return;
              }
		
	      sport2.write(command, function(err) {
	        if (err) {
                  res.send([{"status":"error",
                             "message":"Error on write to sport2: " + err.message}]);
                  console.log("Error on write: " + err.message);
                  return;
                }
		
                console.log("Command sent to firmware");
                res.send([{"status":"ok"}]);
                console.log("");
              });
            });

          });
    });
});

app.listen(80, function() {
    console.log("Starting drinkomatic node server on standard HTTP port 80...\n");
});

//}
