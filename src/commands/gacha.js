const DiscordIDs = require('../json/discord_ids.json');
const Pokedex = require('../json/pokedex.json');
const Gacha = require('./scripts/roulette.js');
// Declare array of possible rolls
let randpoke = [];
// Create array of Pokedex keys (Pokemon names)
let pokemon = Array.from(Object.keys(Pokedex));
// Iterate over list of Pokemon and only include those with a roulette property in array of rolls
for(i = 0; i < pokemon.length; i++){
	// If the Pokemon does have a roulette property, add it to randpoke
	if(Pokedex[pokemon[i]].roulette) randpoke.push(pokemon[i]);
}
// Gacha limits and reusable variables
let gachaLimit = 2; // Max number of active players
let gachaPlayers = [null,null]; // IDs of active players
let gachaFormat = []; // Format player has been set to draw from
let userBank = []; // Players' current selections
let userLimit = []; // Remaining picks for specified player
let userPick = []; // If the user may pick or not
let userChoices = []; // Choices the current user may pick from
let gachaMasterKey = []; // Array for clearing memory after successful round
let gachaString = ""; // String for sending results of a single gacha roll

// Function for returning array of 1 - 6 random pokemon based on provided criteria
function gachaArray(format,number){
	// Initialise array being returned
	let returnArray = [];
	// Initialise loop control variable
	let i = 0;
	// Randomly select the specified number from the array of possible rolls
	while(i < number){
		// Pick a random number to access the array of possible rolls with
		let x = Math.floor(Math.random() * randpoke.length);
		// Check if the requested number isn't already in the return array and legal in specified format
		if(!returnArray.includes(randpoke[x]) && formatLegal(format,Pokedex[randpoke[x]])){
			// If the return array does not have our randomly selected Pokemon, add it
			returnArray.push(randpoke[x]);
			// On successful add, increment control variable and restart loop 
			i++; continue;
		} else continue; // else, restart loop
	}
	// Return the return array
	return returnArray;
}
// Function for checking format legality of randomly selected Pokemon
function formatLegal(format,obj){
	// Find specified format in switch statement
	switch(format){
		// Any Pokemon allowed
		case "any":
			return true;
		// Checking for legality in current Smogon CAP singles format
		case "cap":
			if(!obj.uber) return true;
			else return false;
		// Checking for legality in current Nisemon Singles format
		case "nisemon":
			if(!obj.exiled) return true;
			else return false;
	}
}

module.exports = {
	name: "gacha",
	description: "Facilitates roulette draws and rolls.",
	aliases : ["roulette"],
	execute(message,args){
		// Check if an argument either in the form a a format or player entree was provided
		if(!args[0]) { message.channel.send("Please send an argument."); return; }
		// If one was provided, check if a format was provided with a number
		if(args[0] == 'any' || args[0] == 'cap' || args[0] == 'nisemon'){
			// Check if a valid number was provided alongside the format
			if(!(+args[1]) || args[1] > 6 || args[1] < 1) {
				message.channel.send("Please provide a valid number of draws to perform. (1-6)");
				return;
			}
			// Initialise array of randomly selected Pokemon legal in specified format
			let gachaRoll = gachaArray(args[0],args[1]).slice();
			// Constructing generic response
			// Initialise response string
			let response = "You draw:";
			// Loop through recieved roll and copy contents into response
			for(i = 0; i < gachaRoll.length; i++){
				response += `\n[${i+1}] **${gachaRoll[i]}**`;
			}
			message.channel.send(response);
		}
		else {
			message.channel.send("Please request a valid format.");
			return;
		}
	}
}