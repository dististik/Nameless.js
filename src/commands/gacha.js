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
				message.channel.send("Please provide a valid number of draws to perform (1-6)");
				return;
			}
			// Initialise a while loop variable
			let i = 0;
			// Run a draw depending on the format provided
			switch(args[0]){
				case "any" : // Draw to run using the full list of included Pokemon
					while(i < agrs[1]){
						
					}
			}
		}

	}
}