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
//	'live' feed of encounters posted as they occur.
//
//	Additionally, crew member names can be submitted either via the comments section of a specific
//	Facebook post, or through moderated Discord submissions. Facebook entries are not moderated as
//	they are taken directly from the commenter's profile name.
//

const FB = require('fb')
const fs = require("fs");
const cron = require("node-cron");
//const Jimp = require('jimp');
//const express = require('express');
const path = require('path')

// comment this out
const token = fs.readFileSync("./token.txt")

var encounters = JSON.parse(fs.readFileSync("./encounters.json"));

var encounterSel
var toPost = "";

var inputData;

var stdin = process.openStdin();

stdin.addListener ("data", function (d) {
	console.log("input = [" + d.toString().trim() + "]");
	inputData = d.toString().trim();
	run();
})

cron.schedule('0 * * * *', () => {
	console.log(getTimeStamp() + '] Post report to FB');
	FB.setAccessToken(token);
	
//	post toPost
	
	toPost = "[Mission Report - " + ship.name + " - " + getDistanceStamp() + toPost;
	console.log(toPost);
	
	FB.api('me/photos', 'post', { source: fs.createReadStream('./icon.png'), caption: toPost }, function (res) {
		if(!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);
			return true;
		}
		console.log(getTimeStamp() + "Posted Successfully!");
		console.log(getTimeStamp() + 'Post Id: ' + res.id);
		/*
		if (comment != null) {
			var body = comment;
			console.log(getTimeStamp() + "Posting Moves Comment...");
			FB.api(res.id + '/comments', 'post', { message: body }, function (comm) {
			if(!comm || comm.error) {
				console.log(!comm ? 'error occurred' : comm.error);
				return true;
			}
			console.log(getTimeStamp() + "Comment Posted Successfully!");
			});
		}
		*/
	});
	
	toPost = "";
});

cron.schedule('0 * * * * *', () => {
	console.log(getTimeStamp() + '] Generate info for report');
	run();
});

function run () {
	if (JSON.parse(fs.readFileSync("./in-run.json")) == true) {
		ship = JSON.parse(fs.readFileSync("./ship.json"));
	}
	else {
		ship = new Ship()
		fs.writeFileSync("./runs/" + ship.name + ".txt","Ship Designation: " + ship.name)
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
			
			var toAdd = "\n" + getTimeStamp() + "] " + encounterSel.encounterText;
			
			// check if encounter has a success condition
			// i hope you like if statements
			
			if (encounterSel.condition) {
				
				// if so then check if enough conditions are met
				// resources (oxygen, fuel, power) award score if the required amount is present
				// systems (all sensors, life support, etc) will roll a chance based on their integrity
				// science can roll on either chance or quantity depending on the encounter
				
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
				
				if (score >= encounterSel.score) {
					// success
					toAdd += encounterSel.success.successText;
					
					// update resources and systems
					// i'm sure there's a more efficient way to do this
					
				//	if (encounterSel)
				}
				else {
					// fail
					toAdd += encounterSel.failure.failText;
					
					// update resources and systems
					// yes, this is the same code as above
					
					
				}
				
				
				
			}
			else {
				
				toPost += toAdd;
				console.log(toPost);
			}
			
			runInfo = fs.readFileSync("./runs/" + ship.name + ".txt")
			runInfo += toAdd;
			
			fs.writeFileSync("./runs/" + ship.name + ".txt",runInfo)
			fs.writeFileSync("./ship.json",JSON.stringify(ship))
			
		}, delayTime * 1000);
	}	
}

class Ship {
	constructor () {
		
		// all names will be taken from an external JSON file
		this.name = "Pioneer"
		
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
		// at 0 the ship is destroyed
		this.shipIntegrity = 100;
		
		// the speed of the ship in km/s
		// used for distance purposes, can be affected by encounters
		this.speed = 20;
		
		// distance travelled in km
		this.distanceKM = 0;
		
		// distance travelled in light years
		this.distanceLY = 0
		
		// the time of last encounter (initially launch) in seconds, used for distance calculations
		var date = new Date();
		this.previousEncounterTime = date.getTime();
	}
}

function getTimeStamp() {
	
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
