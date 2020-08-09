const FB = require('fb')
const fs = require("fs");
const cron = require("node-cron");
//const Jimp = require('jimp');
//const express = require('express');
const path = require('path')

const token = fs.readFileSync("./token.tkn")

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
//	run();
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
	
	if (Math.random() < 1) {
		
		// if successful, wait between one and fifty five seconds
		
		var delayTime = Math.floor(Math.random() * 55)
		console.log(getTimeStamp() + "] Encounter Successful, waiting " + delayTime + " seconds")
		setTimeout(function () {
			console.log(getTimeStamp() + "] Encounter would go at this time")
			
			// need to generate the encounter here
			encounterSel = encounters[Math.floor(Math.random() * encounters.length)];
			var toAdd = "\n" + getTimeStamp() + getDistanceStamp() + encounterSel.encounterText;
			toPost += toAdd;
			console.log(toPost);
			
			runInfo = fs.readFileSync("./runs/" + ship.name + ".txt")
			runInfo += toAdd;
			
			fs.writeFileSync("./runs/" + ship.name + ".txt",runInfo)
			fs.writeFileSync("./ship.json",JSON.stringify(ship))
			
		}, delayTime * 1000);
	}
	
	
	
	
}

class Ship {
	constructor () {
		this.name = "cool ship name placeholder"
		
		// ship needs various stats to keep balanced
		// things like oxygen, power, fuel, technical systems like sensors, databases, crew options too
		
		// oxygen can only be decreased by encounters, or if the life support system is damaged
		// oxygen level will only rarely go up
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
		// used for distance purposes
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
	var d = new Date();
	var hours = d.getHours();
	if (hours < 10) {
		hours = "0" + hours.toString()
	}
	
	var minutes = d.getMinutes()
	if (minutes < 10) {
		minutes = "0" + minutes.toString()
	}
	
	var seconds = d.getSeconds()
	if (seconds < 10) {
		seconds = "0" + seconds.toString()
	}
	
	var days = d.getDate()
	if (days < 10) {
		days = "0" + days.toString()
	}
	
	var months = d.getMonth() + 1
	if (months < 10) {
		months = "0" + months.toString()
	}
	
	
	return("[" + hours + ":" + minutes + ":" + seconds + " " + days + "/" + months + "/" + d.getFullYear());
}

function getDistanceStamp () {
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
	
	return(" - " + distanceKM.toFixed(2) + " kilometres (" + (distanceLY).toFixed(4) + " ly) travelled] ")
}
