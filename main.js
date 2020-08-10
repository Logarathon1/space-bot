//
//	Submission by Team 'certified bot moment' for the 2020 BAS Hackathon
//	Category: Facebook, supplemental Discord component included
//	All code and art written and created by Logan Fincham (Discord: Logarathon#6969)
//
//	This is Interstellar Bot 1973, a bot that simulates the voyage of an exploratory spaceship.
//	The bot runs in real-time, rolling the chance for an encounter to occur every minute, and
//	posting a report of what encounters have occurred to Facebook every hour.
//
//	Encounters will have various effects on each of the ship's systems and resources, and as time 
//	progresses the 'story' of the ship will too. While there is no scripted story that is followed, 
//	notable encounters are recorded and can be accessed via the supplemental Discord Bot, as can a
//	report on the status of the ship.
//
//	Additionally, crew member names can be submitted either via the comments section of a specific
//	Facebook post, or through moderated Discord submissions. Facebook entries are not moderated as
//	they are taken directly from the commenter's profile name.
//

const FB = require('fb')
const discord = require ('discord.js');
const fs = require("fs");
const cron = require("node-cron");
//const Jimp = require('jimp');
//const express = require('express');
const path = require('path')

//	comment this out if you want it to work
//	or supply your own tokens, i'm not your dad
const fbtoken = fs.readFileSync("./fbtoken.txt")
const disctoken = fs.readFileSync("./disctoken.txt")

const prefix = "io!";
var client = new discord.Client();
client.login (disctoken.toString());

//	this file contains all of the space events that can be encountered by the ship
//	some of the events have conditions that will either be met or not, with the outcome dependant on it
//	based on a scoring system, events require a certain amount of conditions to be met, if so a success
//	is given, and if not a failure is given, other events do not have conditions, and will have a fixed 
//	outcome that may or may not reward punish the ship and it's crew
var encounters = JSON.parse(fs.readFileSync("./encounters.json"));

var shipnames = JSON.parse(fs.readFileSync("./shipnames.json"));
var crewnames = JSON.parse(fs.readFileSync("./crewnames.json"));

FB.setAccessToken(fbtoken.toString());

FB.api("/101226241694587_102150188268859/comments", function (response) {
	if (response.error) {
		console.log(response);
	}
	else if (!response.data[0]) {
	}
	else if (response && !response.error) {
		for (i = 0; i < response.data.length; i++) {
			crewnames.push(response.data[i].from.name)
		}
	}
});

var encounterSel
var toPost = "";
var hourlyData = "";

var inputData;

var stdin = process.openStdin();

stdin.addListener ("data", function (d) {
	// allows encounters to be 'forced' by pressing enter in the console window a few times
	console.log("input = [" + d.toString().trim() + "]");
	inputData = d.toString().trim();
	run();
})

cron.schedule('0 * * * *', () => {
	console.log(getTimeStamp() + '] Post report to FB');
	FB.setAccessToken(fbtoken.toString());
	
	// load up crew member names
	
	crewnames = JSON.parse(fs.readFileSync("./crewnames.json"));

	FB.api("/101226241694587_102150188268859/comments", function (response) {
		if (response.error) {
			console.log(response);
		}
		else if (!response.data[0]) {
		}
		else if (response && !response.error) {
			for (i = 0; i < response.data.length; i++) {
				response.data[i].from.name
				crewnames.push(response.data[i].from.name)
			}
		}
	});
	
	// load post data
	
	toPost = fs.readFileSync("./to-post.txt").toString()
	
	// do all of the hourly stuff
	
	// life support tick
	
	if ((ship.lifeSupport / 100) < Math.random()) {
		ship.oxygen--;
		hourlyData += "\nShip oxygen levels have decreased due to damaged life support"
	}
	
	// oxygen tick
	
	if (ship.oxygen < 20) {
		//	kill someone
		//	anyone
		deadPerson = ship.crew.splice(Math.floor(Math.random() * crew.length), 1)
		hourlyData += "\n" + deadPerson.rank + " " + deadPerson.name + " has died due to insufficent oxygen levels"
	}
	
	// solar tick
	
	if ((ship.solarArray / 50) < Math.random()) {
		ship.power--;
		hourlyData += "\nShip power levels have decreased due to damaged solar array"
	}
	else if (ship.power < 100){
		ship.power++;
		hourlyData += "\nShip power levels have increased"
	}
	
	// fuel tick
	
	if (ship.fuel > 0) {
		ship.fuel--;
		ship.speed = Number(Number(ship.speed) + Number((Math.random() * 20 + 10).toFixed(2))).toFixed(2);
		hourlyData += "\nShip has accelerated, new speed: " + ship.speed + "km/s"
	}
	else {
		ship.sensors--;
		ship.lifeSupport--;
		ship.oxygenSensor--;
		ship.powerSensor--;
		ship.fuelSensor--;
		ship.scienceSensor--;
		ship.solarArray--;
		ship.scienceDatabase--;
		ship.shipComputer--;
		ship.speed = Number(Number(ship.speed) + Number((Math.random() * 20 + 10).toFixed(2))).toFixed(2);
		hourlyData += "\nShip has accelerated, necessary energy diverted from subsystems, new speed: " + ship.speed + "km/s"
	}
	
	// power tick
	
	if ((ship.power / 100) < Math.random()) {
		switch (Math.floor(Math.random() * 10)) {
			case 0:
			ship.sensors--;
			hourlyData += "\nGeneral sensors have been damaged due to insufficient power"
			break;
			
			case 1:
			ship.lifeSupport--;
			hourlyData += "\nLife support has been damaged due to insufficient power"
			break;
			
			case 2:
			ship.oxygenSensor--;
			hourlyData += "\nOxygen sensors have been damaged due to insufficient power"
			break;
			
			case 3:
			ship.powerSensor--;
			hourlyData += "\nPower sensors have been damaged due to insufficient power"
			break;
			
			case 4:
			ship.fuelSensor--;
			hourlyData += "\nFuel sensors have been damaged due to insufficient power"
			break;
			
			case 5:
			ship.scienceSensor--;
			hourlyData += "\nScientific sensors have been damaged due to insufficient power"
			break;
			
			case 6:
			ship.solarArray--;
			hourlyData += "\nSolar array has been damaged due to insufficient power"
			break;
			
			case 7:
			ship.scienceDatabase--;
			hourlyData += "\nScience database have been damaged due to insufficient power"
			break;
			
			case 8:
			ship.shipComputer--;
			hourlyData += "\nShip computer has been damaged due to insufficient power"
			break;
			
			case 9:
			ship.shipIntegrity--;
			hourlyData += "\nShip integrity has been damaged due to insufficient power"
			break;
		}
	}
	
	//	post toPost
	
	if (toPost) {
		toPost = "[Mission Report - " + ship.name + " - " + getDistanceStamp() + hourlyData + "\n\nNotable Events:" + toPost;
	}
	else {
		toPost = "[Mission Report - " + ship.name + " - " + getDistanceStamp() + hourlyData + "\n\nNotable Events:" + "\nNo recent events of note";
	}
	
	console.log(toPost);
	
	FB.api('me/photos', 'post', { source: fs.createReadStream('./icon.png'), caption: toPost }, function (res) {
		if(!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);
			return true;
		}
		console.log(getTimeStamp() + "Posted Successfully!");
		console.log(getTimeStamp() + 'Post Id: ' + res.id);
		FB.api(res.id + '/comments', 'post', { message: "[Operational Report]\n" + getShipInfo() }, function (comm) {
			if(!comm || comm.error) {
				console.log(!comm ? 'error occurred' : comm.error);
				return true;
			}
			console.log(getTimeStamp() + "Comment Posted Successfully!");
		});
	});
	
	fs.writeFileSync("./ship.json",JSON.stringify(ship))
	
	toPost = "";
	fs.writeFileSync("./to-post.txt",toPost)
});

cron.schedule('0 1-59 * * * *', () => {
	console.log(getTimeStamp() + '] Generate info for report');
	run();
});

client.on ("ready", () => {
	console.log ("Bot Online");
	client.user.setActivity ("the stars || io!help", {type: "WATCHING"});
});

client.on ("message", (message) => {
	
	if (message.author.bot) return;
	
	ship = JSON.parse(fs.readFileSync("./ship.json"));
	
	var newMessage = message.content

	if (newMessage.startsWith (prefix)) {
		newMessage = newMessage.split("!");
		switch (newMessage[1]) {
			case "status":
			var embed = new discord.MessageEmbed()
			.setTitle(getTimeStamp() + " - " + ship.name + " Operational Report]")
			.addField("[" + getDistanceStamp(),getShipInfo());
			message.channel.send({embed});
			break;
			
			case "report":
			toPost = fs.readFileSync("./to-post.txt").toString();
			if (toPost) {
				var embed = new discord.MessageEmbed()
				.setTitle(getTimeStamp() + " - " + ship.name + " Mission Report]")
				.addField("[Notable Events]",toPost);
			}
			else {
				var embed = new discord.MessageEmbed()
				.setTitle(getTimeStamp() + " - " + ship.name + " Mission Report]")
				.addField("[Notable Events]","No recent events of note");
			}
			message.channel.send({embed});
			break;
			
			case "crew":
			if (newMessage[2]) {
				if (newMessage[2] <= ship.crew.length && newMessage[2] > 0) {
					var embed = new discord.MessageEmbed()
					.setTitle(getTimeStamp() + " - " + ship.name + " Crew Member Report]")
					.addField("[" + ship.crew[newMessage[2] - 1].name + "]","Position: " + ship.crew[newMessage[2] - 1].rank + "\nAge: " + ship.crew[newMessage[2] - 1].age + "\nNotes: " + ship.crew[newMessage[2] - 1].notes);
				}
				else {
					var embed = new discord.MessageEmbed()
					.setTitle(getTimeStamp() + " - " + ship.name + " Crew Report]")
					.addField("[Total Crew Count: " + ship.crew.length + "]","Crew Peformance: " + getCrewPerformance() + "\nEntered number out of bounds: Enter a number between 1 and " + (ship.crew.length) + " inclusive to view a specific crew member");
				}
			}
			else {
				var embed = new discord.MessageEmbed()
				.setTitle(getTimeStamp() + " - " + ship.name + " Crew Report]")
				.addField("[Total Crew Count: " + ship.crew.length + "]","Crew Peformance: " + getCrewPerformance());
			}
			message.channel.send({embed});
			break;
			
			case "submit":
			
			if (newMessage[2]) {
				names = JSON.parse(fs.readFileSync("./crewnames-pending.json"))
				names.push(newMessage[2])
				fs.writeFileSync("./crewnames-pending.json",JSON.stringify(names))
				
				var embed = new discord.MessageEmbed()
				.setTitle("[Interstellar Mission Registration]")
				.addField("[Submission Received]","Pending moderation and approval");
			}
			else {
				var embed = new discord.MessageEmbed()
				.setTitle("[Interstellar Mission Registration]")
				.addField("[Submission Fail]","Empty Submission");
			}
				
			message.channel.send({embed});
			
			break;
			
			case "shipname":
			
			if (newMessage[2]) {
				names = JSON.parse(fs.readFileSync("./shipnames-pending.json"))
				names.push(newMessage[2])
				fs.writeFileSync("./shipnames-pending.json",JSON.stringify(names))
			
				var embed = new discord.MessageEmbed()
				.setTitle("[Ship Name Registry]")
				.addField("[Submission Received]","Pending moderation and approval");
			}
			else {
				var embed = new discord.MessageEmbed()
				.setTitle("[Ship Name Registry]")
				.addField("[Submission Failed]","Empty submission");
			}
			message.channel.send({embed});
			
			break;
			
			case "help":
			var embed = new discord.MessageEmbed()
			.setTitle("[Interstellar Observer]")
			.addField("Communications interface for vessel " + ship.name,"Available Commands:")
			.addField("io!status","Displays current operational status of vessel")
			.addField("io!report","Displays current mission report")
			.addField("io!crew","Displays current crew roster, input io!crew![#] for specific member information")
			.addField("io!submit!<name>","Enter a name into the crew member pool for future selection")
			.addField("io!shipname!<name>","Enter a name into the ship name pool for future selection")
			.addField("io!help","Displays this command directory");
			message.channel.send({embed});
			break;
		}
	}
	
});

function run () {
	
	// load post data
	
	toPost = fs.readFileSync("./to-post.txt").toString();
	
	if (JSON.parse(fs.readFileSync("./in-run.json")) == true) {
		ship = JSON.parse(fs.readFileSync("./ship.json"));
	}
	else {
		ship = new Ship()
		toPost += "\n" + getTimeStamp() + "] Launch successful, Interstellar Exploratory Vessel designation " + ship.name + " underway at speed " + ship.speed + "km/s\nTotal crew complement of " + ship.crew.length + ", captained by " + ship.crew[0].name
		
		fs.writeFileSync("./ship.json",JSON.stringify(ship))
		fs.writeFileSync("./runs/" + ship.name + ".txt","Ship Designation: " + ship.name + toPost)
		fs.writeFileSync("./in-run.json",JSON.stringify(true))
		
		fs.writeFileSync("./to-post.txt",toPost)
	}

	
	// check if the ship was destroyed by the last encounter
	
	if (checkDead() != 0) {
		
		toPost += "\n\n" + getTimeStamp() + "] ";
		
		switch (checkDead()) {
			case 1:
			toPost += "Irrepairable damage to ship sustained, multiple system failures, vessel " + ship.name + " has been destroyed"
			break;
			
			case 2:
			toPost += "All crew members have perished, vessel " + ship.name + " has been lost"
			break;
		}
		
		console.log(toPost);
		
		runInfo = fs.readFileSync("./runs/" + ship.name + ".txt")
		runInfo += toAdd;
		
		fs.writeFileSync("./runs/" + ship.name + ".txt",runInfo)
		fs.writeFileSync("./ship.json",JSON.stringify(ship))
		
		toPost = "[Mission Report - " + ship.name + " - " + getDistanceStamp() + toPost;
		console.log(toPost);
	
		FB.api('me/photos', 'post', { source: fs.createReadStream('./icon.png'), caption: toPost }, function (res) {
			if(!res || res.error) {
				console.log(!res ? 'error occurred' : res.error);
				return true;
			}
			console.log(getTimeStamp() + "Posted Successfully!");
			console.log(getTimeStamp() + 'Post Id: ' + res.id);
			FB.api(res.id + '/comments', 'post', { message: "[Operational Report]\n" + getShipInfo() }, function (comm) {
				if(!comm || comm.error) {
					console.log(!comm ? 'error occurred' : comm.error);
					return true;
				}
				console.log(getTimeStamp() + "Comment Posted Successfully!");
			});
		});
	
		toPost = "";
		
		ship = new Ship()
		toPost += "\n" + getTimeStamp() + "] Launch successful, Interstellar Exploratory Vessel designation " + ship.name + " underway at speed " + ship.speed + "km/s\nTotal crew complement of " + ship.crew.length + ", captained by " + ship.crew[0].name
		fs.writeFileSync("./runs/" + ship.name + ".txt","Ship Designation: " + ship.name + toPost)
		fs.writeFileSync("./in-run.json",JSON.stringify(true))
		
	}
	
	// roll chance for encounter
	// a 5% chance should work for now, can tweak later
	
	if (Math.random() < 0.05) {
		
		// if successful, wait between one and fifty five seconds for added randomness
		
		var delayTime = Math.floor(Math.random() * 55)
		console.log(getTimeStamp() + "] Encounter Successful, waiting " + delayTime + " seconds")
		setTimeout(function () {
			console.log(getTimeStamp() + "] Encounter would go at this time")
			
			// need to generate the encounter here
			
			encounterSel = encounters[Math.floor(Math.random() * encounters.length)];
			
			var toAdd = "\n\n" + getTimeStamp() + "] " + encounterSel.encounterText;
			
			// check if encounter has a success condition
			// i hope you like if statements
			
			if (encounterSel.condition) {
				
				// if so then check if enough conditions are met
				// resources (oxygen, fuel, power) award score if the required amount is present
				// systems (all sensors, life support, etc) will roll a chance based on their integrity
				// science can roll on either chance or quantity depending on the encounter
				// ship integrity will always roll on both methods
				
				var score = 0;
				
				// resources
				
				if (encounterSel.condition.reqOxygen && ship.oxygen > encounterSel.condition.reqOxygen) {
					score++;
				}
				if (encounterSel.condition.reqFuel && ship.fuel > encounterSel.condition.reqFuel) {
					score++;
				}
				if (encounterSel.condition.reqPower && ship.power > encounterSel.condition.reqPower) {
					score++;
				}
				if (encounterSel.condition.reqScience && ship.scienceDatabase > encounterSel.condition.reqScience) {
					score++;
				}
				if (encounterSel.condition.reqShipIntegrity && ship.shipIntegrity > encounterSel.condition.reqShipIntegrity) {
					score++;
				}
				
				// systems
				
				if (encounterSel.condition.reqLifeSupport && Math.random() < (ship.lifeSupport / 100)) {
					score++;
				}
				if (encounterSel.condition.reqSensors && Math.random() < (ship.sensors / 100)) {
					score++;
				}
				if (encounterSel.condition.reqOxygenSensor && Math.random() < (ship.oxygenSensor / 100)) {
					score++;
				}
				if (encounterSel.condition.reqFuelSensor && Math.random() < (ship.fuelSensor / 100)) {
					score++;
				}
				if (encounterSel.condition.reqPowerSensor && Math.random() < (ship.powerSensor / 100)) {
					score++;
				}
				if (encounterSel.condition.reqScienceSensor && Math.random() < (ship.scienceSensor / 100)) {
					score++;
				}
				if (encounterSel.condition.reqScienceDatabase && Math.random() < (ship.scienceDatabase / 100)) {
					score++;
				}
				if (encounterSel.condition.reqShipComputer && Math.random() < (ship.shipComputer / 100)) {
					score++;
				}
				if (encounterSel.condition.reqSolarArray && Math.random() < (ship.solarArray / 100)) {
					score++;
				}
				if (encounterSel.condition.reqShipIntegrity && Math.random() < (ship.shipIntegrity / 100)) {
					score++;
				}
				
				if (score >= encounterSel.score) {
					// success
					toAdd += encounterSel.success.successText;
					toPost += toAdd;
					console.log(toPost);
					// update resources and systems
					// i'm sure there's a more efficient way to do this
					
					if (encounterSel.success.oxygen) {
						ship.oxygen += encounterSel.success.oxygen
					}
					if (encounterSel.success.fuel) {
						ship.fuel += encounterSel.success.fuel
					}
					if (encounterSel.success.power) {
						ship.power += encounterSel.success.power
					}
					if (encounterSel.success.science) {
						ship.scienceDatabase += encounterSel.success.science
					}
					
					if (encounterSel.success.speed) {
						ship.speed = Number(Number(encounterSel.success.speed) + Number(ship.speed)).toFixed(2)
					}
					
					if (encounterSel.success.lifeSupport) {
						ship.lifeSupport += encounterSel.success.lifeSupport
					}
					if (encounterSel.success.sensors) {
						ship.sensors += encounterSel.success.sensors
					}
					if (encounterSel.success.oxygenSensor) {
						ship.oxygenSensor += encounterSel.success.oxygenSensor
					}
					if (encounterSel.success.fuelSensor) {
						ship.fuelSensor += encounterSel.success.fuelSensor
					}
					if (encounterSel.success.powerSensor) {
						ship.powerSensor += encounterSel.success.powerSensor
					}
					if (encounterSel.success.scienceSensor) {
						ship.scienceSensor += encounterSel.success.scienceSensor
					}
					if (encounterSel.success.shipComputer) {
						ship.shipComputer += encounterSel.success.shipComputer
					}
					if (encounterSel.success.shipIntegrity) {
						ship.shipIntegrity += encounterSel.success.shipIntegrity
					}
					if (encounterSel.success.solarArray) {
						ship.solarArray += encounterSel.success.solarArray
					}
					
					if (encounterSel.success.crew) {
						if (encounterSel.success.crew < 0) {
							for (i = 0; i > encounterSel.success.crew; i--) {
								deadPerson = ship.crew.splice(Math.floor(Math.random() * crew.length), 1)
								toAdd += "\n<" + deadPerson.rank + " " + deadPerson.name + " deceased>" 
							}
						}
					}
				}
				else {
					// fail
					toAdd += encounterSel.failure.failText;
					toPost += toAdd;
					console.log(toPost);
					// update resources and systems
					// yes, this is the same code as above
					
					if (encounterSel.failure.oxygen) {
						ship.oxygen += encounterSel.failure.oxygen
					}
					if (encounterSel.failure.fuel) {
						ship.fuel += encounterSel.failure.fuel
					}
					if (encounterSel.failure.power) {
						ship.power += encounterSel.failure.power
					}
					if (encounterSel.failure.science) {
						ship.scienceDatabase += encounterSel.failure.science
					}
					
					if (encounterSel.failure.speed) {
						ship.speed = Number(Number(encounterSel.failure.speed) + Number(ship.speed)).toFixed(2)
					}
					
					if (encounterSel.failure.lifeSupport) {
						ship.lifeSupport += encounterSel.failure.lifeSupport
					}
					if (encounterSel.failure.sensors) {
						ship.sensors += encounterSel.failure.sensors
					}
					if (encounterSel.failure.oxygenSensor) {
						ship.oxygenSensor += encounterSel.failure.oxygenSensor
					}
					if (encounterSel.failure.fuelSensor) {
						ship.fuelSensor += encounterSel.failure.fuelSensor
					}
					if (encounterSel.failure.powerSensor) {
						ship.powerSensor += encounterSel.failure.powerSensor
					}
					if (encounterSel.failure.scienceSensor) {
						ship.scienceSensor += encounterSel.failure.scienceSensor
					}
					if (encounterSel.failure.shipComputer) {
						ship.shipComputer += encounterSel.failure.shipComputer
					}
					if (encounterSel.failure.shipIntegrity) {
						ship.shipIntegrity += encounterSel.failure.shipIntegrity
					}
					if (encounterSel.failure.solarArray) {
						ship.solarArray += encounterSel.failure.solarArray
					}
					
					if (encounterSel.failure.crew) {
						if (encounterSel.failure.crew < 0) {
							for (i = 0; i > encounterSel.failure.crew; i--) {
								deadPerson = ship.crew.splice(Math.floor(Math.random() * crew.length), 1)
								toAdd += "\n<" + deadPerson.rank + " " + deadPerson.name + " deceased>" 
							}
						}
					}
					
				}
				
				// check that resources are not over capacity
				
				if (ship.oxygen > 100) {
					ship.oxygen = 100;
				}
				if (ship.power > 100) {
					ship.power = 100;
				}
				if (ship.fuel > 100) {
					ship.fuel = 100;
				}
				if (ship.scienceDatabase > 100) {
					ship.scienceDatabase = 100;
				}
				
				
			}
			else {
				
				if (encounterSel.oxygen) {
					ship.oxygen += encounterSel.oxygen
				}
				if (encounterSel.fuel) {
					ship.fuel += encounterSel.fuel
				}
				if (encounterSel.power) {
					ship.power += encounterSel.power
				}
				if (encounterSel.science) {
					ship.scienceDatabase += encounterSel.science
				}
				
				if (encounterSel.speed) {
					ship.speed = Number(Number(encounterSel.speed) + Number(ship.speed))
				}
				
				if (encounterSel.lifeSupport) {
					ship.lifeSupport += encounterSel.lifeSupport
				}
				if (encounterSel.sensors) {
					ship.sensors += encounterSel.sensors
				}
				if (encounterSel.oxygenSensor) {
					ship.oxygenSensor += encounterSel.oxygenSensor
				}
				if (encounterSel.fuelSensor) {
					ship.fuelSensor += encounterSel.fuelSensor
				}
				if (encounterSel.powerSensor) {
					ship.powerSensor += encounterSel.powerSensor
				}
				if (encounterSel.scienceSensor) {
					ship.scienceSensor += encounterSel.scienceSensor
				}
				if (encounterSel.shipComputer) {
					ship.shipComputer += encounterSel.shipComputer
				}
				if (encounterSel.shipIntegrity) {
					ship.shipIntegrity += encounterSel.shipIntegrity
				}
				if (encounterSel.solarArray) {
					ship.solarArray += encounterSel.solarArray
				}
				
				if (encounterSel.crew) {
					if (encounterSel.crew < 0) {
						for (i = 0; i > encounterSel.crew; i--) {
							deadPerson = ship.crew.splice(Math.floor(Math.random() * crew.length), 1)
							toAdd += "\n<" + deadPerson.rank + " " + deadPerson.name + " deceased>" 
						}
					}
				}
				
				if (ship.oxygen > 100) {
					ship.oxygen = 100;
				}
				if (ship.power > 100) {
					ship.power = 100;
				}
				if (ship.fuel > 100) {
					ship.fuel = 100;
				}
				if (ship.scienceDatabase > 100) {
					ship.scienceDatabase = 100;
				}
				
				toPost += toAdd;
				console.log(toPost);
			}
			
			runInfo = fs.readFileSync("./runs/" + ship.name + ".txt")
			runInfo += toAdd;
			
			fs.writeFileSync("./to-post.txt",toPost)
			fs.writeFileSync("./runs/" + ship.name + ".txt",runInfo)
			fs.writeFileSync("./ship.json",JSON.stringify(ship))
			
		}, delayTime * 1000);
	}	
}

class Ship {
	constructor () {
		
		// all names will be taken from an external JSON file
		this.name = shipnames[Math.floor(Math.random() * shipnames.length)]
		
		// ship needs various stats to keep balanced
		// things like oxygen, power, fuel, technical systems like sensors, databases, crew options too
		
		// oxygen can only be decreased by encounters, or if the life support system is damaged
		// oxygen level will only rarely go up
		// low levels will negatively impact the crew
		this.oxygen = 100;
		
		// life support can be damaged and repaired by random encounters
		// every hour, life support decided whether the oxygen level decreases or remains constant
		// at 100, there is a 0% chance to decrease, at 90 there is a 10% chance, at 50 a 50% chance, and so on
		this.lifeSupport = 100;
		
		// fuel can be increased and decreased by encounters
		// every hour, fuel will decrease by one
		// when fuel runs out, excess power will be required to run the ship
		// this means that systems such as life support, sensors, and the databases will each decrease by one per hour
		this.fuel = 100;
		
		// can be increased or decreased via encounters
		// works similarly to life support, except that it drains from a random system
		// this can be life support, sensors, database, etc
		this.power = 100;
		
		// general sensors, have an effect on resources gained from certain encounters, specific sensor ability
		this.sensors = 100;
		
		// increases the chance of oxygen being gained from encounters
		this.oxygenSensor = 100;
		
		// increases the chance of fuel being gained from encounters
		this.fuelSensor = 100;
		
		// increases the chance of power being gained from encounters
		this.powerSensor = 100;
		
		// related to the amount of science gained from scientific encounters
		this.scienceSensor = 100;
		
		// increases the yields of resource related encounters, boosts the success chance of some encounters
		this.scienceDatabase = 20;
		
		// the integrity of the ship's computer, at lower levels corruption occurs and can damage ship systems and resources
		this.shipComputer = 100;
		
		// the integrity of the solar array, below 50% power will drain at a rate of 1 per hour
		this.solarArray = 100;
		
		// the integrity of the ship itself, it degrading has a chance to kill the crew
		// also encompasses propulsion systems
		// at 0 the ship is destroyed
		this.shipIntegrity = 100;
		
		// the speed of the ship in km/s
		// used for distance purposes, can be affected by encounters
		this.speed = (Math.random() * 16 + 8).toFixed(2);
		
		// distance travelled in km
		this.distanceKM = 0;
		
		// distance travelled in light years
		this.distanceLY = 0
		
		// the time of last encounter (initially launch) in seconds, used for distance calculations
		var date = new Date();
		this.previousEncounterTime = date.getTime();
		
		// big list of people, semi-random length
		this.crew = []
		
		// was having an issue with i not existing, stupid bot
		var i = 0;
		
		var totalCrew = Math.floor(Math.random() * 200 + 100);
		
		for (i = 0; i < totalCrew; i++) {
			if (crewnames.length > 0) {
				this.crew.push(new Person(crewnames.splice(Math.floor(Math.random() * crewnames.length), 1), i))
			}
			else {
				this.crew.push(new Person("Crew Member " + (i + 1), i))
			}
		}
	}

}

class Person {
	// makes people
	constructor (name, rank) {
		this.name = name
		
		if (rank == 0){
			this.rank = "Captain"
		}
		else if (rank == 1) {
			this.rank = "Commander"
		}
		else if (rank < 4) {
			this.rank = "Lieutentant Commander"
		}
		else if (rank < 8) {
			this.rank = "Lieutentant"
		}
		else if (rank < 16) {
			this.rank = "Lieutentant JR"
		}
		else if (rank < 64) {
			this.rank = "Ensign"
		}
		else {
			this.rank = "Civilian"
		}
		
		this.age = Math.floor(Math.random() * 55 + 17);
		
		this.notes = "Nothing to note"
	}
}

function checkDead () {
	if (ship.integrity < 1) {
		return 1;
	}
	if (ship.crew.length < 1) {
		return 2;
	}
	return 0;
}

function getShipInfo () {
	shipInfo = "Current Speed: " + ship.speed + "km/s\n\n"
	
	shipInfo += "Total System Status: " + getSystemStatus(getTotalSystemsValue()) + "\n";
	
	shipInfo += "Ship Integrity: " + getSystemStatus(ship.shipIntegrity) + "\n";
	shipInfo += "Sensor Grid: " + getSystemStatus((ship.sensors + ship.oxygenSensor + ship.powerSensor + ship.fuelSensor + ship.scienceSensor)/5) + "\n"
	shipInfo += "Life Support: " + getSystemStatus(ship.lifeSupport) + "\n";
	shipInfo += "Solar Array: " + getSystemStatus(ship.solarArray) + "\n";
	shipInfo += "Computer Core: " + getSystemStatus(ship.shipComputer) + "\n";
	shipInfo += "\n"
	
	shipInfo += "Resources Overview\n"
	shipInfo += "Oxygen = " + ship.oxygen + "%\n"
	shipInfo += "Power = " + ship.power + "%\n"
	shipInfo += "Fuel = " + ship.fuel + "%\n"
	shipInfo += "Scientific Data = " + ship.scienceDatabase + "%\n"
	shipInfo += "\n"
	
	shipInfo += "Crew: " + ship.crew.length + " Members"
	
	return shipInfo;
}

function getSystemStatus (value) {
	if (value <= 0) {
		return "Inoperative"
	}
	else if (value > 100) {
		return "Exceeding Expectations"
	}
	switch (Math.floor(value / 20)) {
		case 0:
		return ("Barely Functional");
		break;
		
		case 1:
		return ("Major Issues");
		break;
		
		case 2:
		return ("Several Issues");
		break;
		
		case 3:
		return ("Minor Issues");
		break;
		
		case 4:
		return ("Good Performance");
		break;
		
		case 5:
		return ("Peak Efficiency");
		break;
	}
}

function getTotalSystemsValue () {
	var systemsValue = (ship.shipIntegrity + ship.lifeSupport + ship.solarArray + ship.shipComputer + (ship.sensors + ship.oxygenSensor + ship.powerSensor + ship.fuelSensor + ship.scienceSensor)/5 ) / 5;
	return systemsValue;
}

function getCrewPerformance () {
	var performanceValue = (ship.shipIntegrity + ship.lifeSupport + ship.solarArray + ship.shipComputer + ship.sensors + ship.oxygenSensor + ship.fuelSensor + ship.powerSensor + ship.scienceSensor  + ship.scienceDatabase + ship.oxygen + ship.fuel + ship.power) / 13;
	
	switch (Math.floor(performanceValue / 20)) {
		case 0:
		return ("Abysmal");
		break;
		
		case 1:
		return ("Poor");
		break;
		
		case 2:
		return ("Room for Improvement");
		break;
		
		case 3:
		return ("Average");
		break;
		
		case 4:
		return ("Exceeding Expectations");
		break;
		
		case 5:
		return ("Exemplary");
		break;
	}
}

function getTimeStamp () {
	
	// gets the UTC date for logging and posting
	
	var d = new Date();
	var hours = d.getUTCHours();
	if (hours < 10) {
		hours = "0" + hours.toString()
	}
	
	var minutes = d.getUTCMinutes()
	if (minutes < 10) {
		minutes = "0" + minutes.toString()
	}
	
	var seconds = d.getUTCSeconds()
	if (seconds < 10) {
		seconds = "0" + seconds.toString()
	}
	
	var days = d.getUTCDate()
	if (days < 10) {
		days = "0" + days.toString()
	}
	
	var months = d.getUTCMonth() + 1
	if (months < 10) {
		months = "0" + months.toString()
	}
	
	
	return("[" + hours + ":" + minutes + ":" + seconds + " " + days + "/" + months + "/" + d.getUTCFullYear()) + " UTC";
}

function getDistanceStamp () {
	
	// gets and updates the total distance travelled by the ship
	
	var d = new Date();
	
	var shipTime = ship.previousEncounterTime;
	var encounterTime = d.getTime();
	
	var distanceKM = (((encounterTime - shipTime) / 1000) * ship.speed);
	ship.previousEncounterTime = encounterTime;
	ship.distanceKM += distanceKM
	ship.distanceLY += (distanceKM / (9.461 * 10 ** 12))
	
	distanceKM = Number(ship.distanceKM)
	
	console.log(ship.distanceKM)
	
	distanceLY = Number(ship.distanceLY)
	
	console.log(ship.distanceLY)
	
	return("" + distanceKM.toFixed(2) + " kilometres (" + (distanceLY).toFixed(4) + " ly) travelled] ")
}

