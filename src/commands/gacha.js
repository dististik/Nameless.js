const DiscordIDs = require('../json/discord_ids.json');
const Pokedex = require('../json/pokedex.json');
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

module.exports = {
	name: "gacha",
	description: "Facilitates roulette draws and rolls.",
	aliases : ["roulette"],
	execute(message,args){
		
	}
}