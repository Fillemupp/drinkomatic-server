

/*

drinkOmatic database init script by Jimmy Eiterjord

WARNING!!! This will clear the database

Run with:
sudo node database_init clear

Mongo database at 127.0.0.1

*/

var ObjectId = require('mongodb').ObjectID;
var data = [
    { "_id" : ObjectId("5bcb8db9313670bd53953d7c"),
      "type" : "motorconfig",
      "name" : "Drink setup 1",
      "motors" : [ { "motor" : "0", "mixer" : "gin", "stepspercl" : "3579" },
		   { "motor" : "1", "mixer" : "tonic", "stepspercl" : "3579" },
		   { "motor" : "2", "mixer" : "rom", "stepspercl" : "3579" },
		   { "motor" : "3", "mixer" : "cola", "stepspercl" : "3579" },
		   { "motor" : "4", "mixer" : "cranberry", "stepspercl" : "3579" },
		   { "motor" : "5", "mixer" : "aperol", "stepspercl" : "3579" },
		   { "motor" : "6", "mixer" : "baileys", "stepspercl" : "3579" },
		   { "motor" : "7", "mixer" : "lime", "stepspercl" : "3579" },
		   { "motor" : "8", "mixer" : "lemon", "stepspercl" : "3579" },
		   { "motor" : "9", "mixer" : "pisangambon", "stepspercl" : "3579" },
		   { "motor" : "10", "mixer" : "tequila", "stepspercl" : "3579" },
		   { "motor" : "11", "mixer" : "prosecco", "stepspercl" : "3579" },
		   { "motor" : "12", "mixer" : "sugar", "stepspercl" : "3579" },
		   { "motor" : "13", "mixer" : "martini", "stepspercl" : "3579" },
		   { "motor" : "14", "mixer" : "soda", "stepspercl" : "3579" },
		   { "motor" : "15", "mixer" : "roseslime", "stepspercl" : "3579" },
		   { "motor" : "16", "mixer" : "vodka", "stepspercl" : "3579" },
		   { "motor" : "17", "mixer" : "cointreau", "stepspercl" : "3579" },
		   { "motor" : "18", "mixer" : "whiskey", "stepspercl" : "3579" },
		   { "motor" : "19", "mixer" : "sprite", "stepspercl" : "3579" },
		   { "motor" : "20", "mixer" : "redbull", "stepspercl" : "3579" },
		   { "motor" : "21", "mixer" : "fanta", "stepspercl" : "3579" },
		   { "motor" : "22", "mixer" : "orange", "stepspercl" : "3579" },
		   { "motor" : "23", "mixer" : "grenadine", "stepspercl" : "3579" } ] },

    { "_id" : ObjectId("5bcb8e5c313670bd53953d7f"),
      "type" : "drink",
      "name" : "Rom & Cola", "sysname" : "romcola",
      "mixers" : [ { "mixer" : "rom", "amount" : "4" },
		   { "mixer" : "cola", "amount" : "16" } ] },

    { "_id" : ObjectId("5bcb8e6c313670bd53953d80"),
      "type" : "drink",
      "name" : "Gin & Tonic", "sysname" : "gintonic",
      "mixers" : [ { "mixer" : "gin", "amount" : "4" },
		   { "mixer" : "tonic", "amount" : "16" } ] },
    
    { "_id" : ObjectId("5d0488cb86784f34f7bb9faa"),
      "type" : "drink",
      "name" : "Vodka & Redbull", "sysname" : "vodkaredbull",
      "mixers" : [ { "mixer" : "vodka", "amount" : "4" },
		   { "mixer" : "redbull", "amount" : "16" } ] },
    
    { "_id" : ObjectId("5d0488cb86784f34f7bb9fda"),
      "type" : "drink",
      "name" : "Screwdriver", "sysname" : "screwdriver",
      "mixers" : [ { "mixer" : "vodka", "amount" : "6" },
		   { "mixer" : "orange", "amount" : "14" } ] },
    
    { "_id" : ObjectId("5d048c3d86784f34f7bb9fac"),
      "type" : "drink",
      "name" : "Dry martini", "sysname" : "drymartini",
      "mixers" : [ { "mixer" : "gin", "amount" : "6" },
		   { "mixer" : "martini", "amount" : "4" } ] },

    { "_id" : ObjectId("5d065c3d86784f34f7bb9fac"),
      "type" : "drink",
      "name" : "Shit on the grass", "sysname" : "shitonthegrass",
      "mixers" : [ { "mixer" : "baileys", "amount" : "4" },
		   { "mixer" : "pisangambon", "amount" : "4" } ] },
    
    { "_id" : ObjectId("5d048e0f86784f34f7bb9fae"),
      "type" : "drink",
      "name" : "Cuba libre", "sysname" : "cubalibre",
      "mixers" : [ { "mixer" : "rom", "amount" : "4" },
		   { "mixer" : "cola", "amount" : "10" },
		   { "mixer" : "lime", "amount" : "2" } ] },
    
    { "_id" : ObjectId("5d04a54486784f34f7bb9faf"),
      "type" : "drink",
      "name" : "Grenade", "sysname" : "grenade",
      "mixers" : [ { "mixer" : "lime", "amount" : "2" },
		   { "mixer" : "vodka", "amount" : "4" },
		   { "mixer" : "sprite", "amount" : "12" },
		   { "mixer" : "grenadine", "amount" : "2" } ] },

    { "_id" : ObjectId("5d04a54486784f34f7aa5faf"),
      "type" : "drink",
      "name" : "Cosmopolitan", "sysname" : "cosmopolitan",
      "mixers" : [ { "mixer" : "cranberry", "amount" : "4" },
		   { "mixer" : "lime", "amount" : "2" },
		   { "mixer" : "vodka", "amount" : "4" },
		   { "mixer" : "cointreau", "amount" : "2" } ] },

    { "_id" : ObjectId("5d04b17986784f34f7bb9fb7"),
      "type" : "drink",
      "name" : "Long island iced tea", "sysname" : "longisland",
      "alcomin" : "1.0", "alcomax" : "10.0",
      "mixers" : [ { "mixer" : "gin", "amount" : "3" },
		   { "mixer" : "rom", "amount" : "3" },
		   { "mixer" : "cola", "amount" : "9" },
		   { "mixer" : "lemon", "amount" : "3" },
		   { "mixer" : "tequila", "amount" : "3" },
		   { "mixer" : "vodka", "amount" : "3" },
		   { "mixer" : "cointreau", "amount" : "2" } ] },
    
    { "_id" : ObjectId("5d04b17986784f34f7bb9fa6"),
      "type" : "drink",
      "name" : "Hisingen island iced tea", "sysname" : "hisingenisland",
      "alcomin" : "1.0", "alcomax" : "10.0",
      "mixers" : [ { "mixer" : "gin", "amount" : "2" },
		   { "mixer" : "rom", "amount" : "2" },
		   { "mixer" : "lemon", "amount" : "2" },
		   { "mixer" : "tequila", "amount" : "1" },
		   { "mixer" : "vodka", "amount" : "2" },
		   { "mixer" : "cointreau", "amount" : "2" },
		   { "mixer" : "fanta", "amount" : "10" },
		   { "mixer" : "orange", "amount" : "5" } ] },
    
    { "_id" : ObjectId("5d04a99186784f34f7bb9fb2"),
      "type" : "drink",
      "name" : "Dirty Lee", "sysname" : "dirtylee",
      "mixers" : [ { "mixer" : "whiskey", "amount" : "4" },
		   { "mixer" : "redbull", "amount" : "16" } ] },

    { "_id" : ObjectId("5d04b45586784f34f7bb9fb9"),
      "type" : "drink",
      "name" : "Gimlet", "sysname" : "gimlet",
      "mixers" : [ { "mixer" : "gin", "amount" : "4" },
		   { "mixer" : "sugar", "amount" : "1" },
		   { "mixer" : "roseslime", "amount" : "4" } ] },

    { "_id" : ObjectId("5d04b4ce86784f34f7bb9fba"),
      "type" : "drink",
      "name" : "Caipirinha", "sysname" : "caipirinha",
      "mixers" : [ { "mixer" : "rom", "amount" : "6" },
		   { "mixer" : "lime", "amount" : "2" },
		   { "mixer" : "sugar", "amount" : "3" } ] },
    
    { "_id" : ObjectId("5d04adbd86784f34f7bb9fb6"),
      "type" : "drink",
      "name" : "Gin rickey", "sysname" : "ginrickey",
      "mixers" : [ { "mixer" : "gin", "amount" : "6" },
		   { "mixer" : "lime", "amount" : "3" },
		   { "mixer" : "soda", "amount" : "11" } ] },

    { "_id" : ObjectId("5d04ad4f86784f34f7bb9fb5"),
      "type" : "drink",
      "name" : "Aperol spritz", "sysname" : "aperolspritz",
      "mixers" : [ { "mixer" : "aperol", "amount" : "4" },
		   { "mixer" : "prosecco", "amount" : "6" },
		   { "mixer" : "soda", "amount" : "2" } ] },
    
    { "_id" : ObjectId("5d04aa9886784f34f7bb9fb3"),
      "type" : "drink",
      "name" : "Margarita", "sysname" : "margarita",
      "mixers" : [ { "mixer" : "lime", "amount" : "3" },
		   { "mixer" : "tequila", "amount" : "4" },
		   { "mixer" : "cointreau", "amount" : "2" } ] },

    { "_id" : ObjectId("5d04aa9886784f34f7aa9fb3"),
      "type" : "drink",
      "name" : "Tequila Sunrise", "sysname" : "tequilasunrise",
      "mixers" : [ { "mixer" : "tequila", "amount" : "6" },
		   { "mixer" : "orange", "amount" : "12" },
		   { "mixer" : "grenadine", "amount" : "2" } ] },

    { "_id" : ObjectId("5d04aa9886784f34f7aa43b3"),
      "type" : "drink",
      "name" : "Arizona Sunrise", "sysname" : "arizonasunrise",
      "mixers" : [ { "mixer" : "tequila", "amount" : "6" },
		   { "mixer" : "lime", "amount" : "3" },
		   { "mixer" : "grenadine", "amount" : "2" } ] },

    { "_id" : ObjectId("5d04aa9886784f34f7aa33b3"),
      "type" : "drink",
      "name" : "Tom Collins", "sysname" : "tomcollins",
      "mixers" : [ { "mixer" : "gin", "amount" : "6" },
		   { "mixer" : "lemon", "amount" : "3" },
		   { "mixer" : "sugar", "amount" : "1" },
		   { "mixer" : "soda", "amount" : "11" } ] }

];

if (process.argv[2] != 'clear') {
    console.log();
    console.log("WARNING!!!! This will clear the database");
    console.log();
    console.log("Please confirm to clear database by running again with clear as parameter");
    console.log();
    process.exit();
}

console.log("Database init");
	
var monk = require('monk');
monk('localhost:27017/drinkomatic').then((db) => {
    const start = async() => {
	var collection = db.get('drinkomatic');   
	
	console.log("Clearing...");
	await db._db.dropDatabase();
    
	console.log("Inserting new elements");
	for(var i=0; i<data.length; i++) {
	    item = data[i];
	    await collection.insert(item)
		.then(function(item) {
		    console.log("Insert OK: " + item.type + " " + item.name);
		},function(error) {
		    console.log("Insert FAILED ");
		});
	}
	console.log("Done!");
	process.exit();
    }
    
    start();
});



