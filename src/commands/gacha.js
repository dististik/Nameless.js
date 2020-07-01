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
let gachaRollStatus = false; // Bool that effects behavoir of normal roll subcommand

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
		// Check if an argument was provided
		if(!args[0]) { message.channel.send("Please send an argument."); return; }
		// If one was provided, check if a format was provided with a number
		if(args[0] == 'any' || args[0] == 'cap' || args[0] == 'nisemon'){
			// Check if the player is a roulette participant
			if(gachaFormat[`p${message.author.id}`]){
				// Check if player can roll or not, if not deny the roll
				if(!userPick[`p${message.author.id}`]){
					message.channel.send("You may not pick from a new roll yet.")
					return;
				}
				// If they can, change the roll status to true
				gachaRollStatus = true;
			}
			// Check if a valid number was provided alongside the format
			if(!(+args[1]) || args[1] > 6 || args[1] < 1) {
				message.channel.send("Please provide a valid number of draws to perform. (1-6)");
				return;
			}
			// Initialise array of randomly selected Pokemon legal in specified format
			let gachaRoll = gachaArray(args[0],args[1]).slice();
			// Perform optional steps for if the message author is a roulette participant
			if(gachaRollStatus){
				// Check if author is rolling the correct format
				if(gachaFormat[`p${message.author.id}`] == args[0]){ 
					// Copy gachaRoll for external use
					userChoices[`p${message.author.id}`] = gachaRoll.slice();
					// Set message author's permissions to roll to false
					userPick[`p${message.author.id}`] = false;
				} else { // If author is rolling a different format, send error and return
					message.channel.send(`You must roll using the format "${gachaFormat[`p${message.author.id}`]}"`);
					return;
				}
			}
			// Constructing generic response
			// Initialise response string
			let response = "You draw:";
			// Loop through recieved roll and copy contents into response
			for(i = 0; i < gachaRoll.length; i++){
				response += `\n[${i+1}] **${gachaRoll[i]}**`;
			}
			// Send constructed response string and set status to false
			message.channel.send(response);
			gachaRollStatus = false;
		}
		// If a format was not provided, check if the player is (and can) entering someone in a roulette
		else if(args[0] == 'start' && (message.member.roles.cache.get(DiscordIDs.roles.coordinator) || message.member.roles.cache.get(DiscordIDs.roles.guest_organiser))){
			// Check if the provided user ID is present in the server, if not return
			if(!message.guild.members.cache.get(args[1])){
				message.channel.send("The requested user is not a member of this server. (typo?)");
				return;
			}
			// Check if the provided format is valid, if not return
			if(!(args[2] == 'any' || args[2] == 'cap' || args[2] == 'nisemon')){
				message.channel.send("Please enter the participant in a valid format.");
				return;
			}
			// Check if there are any open slots in participants
			if(gachaLimit < 1){
				message.channel.send("There are currently 2 players participating. Please wait for one to finish.");
				return;
			}
			// Add the user to memory
			gachaPlayers[gachaLimit - 1] = args[1]; // Fill array backwards
			gachaFormat[`p${args[1]}`] = args[2]; // Associative array
			userLimit[`p${args[1]}`] = 6; // Associative array
			userPick[`p${args[1]}`] = true; // Associative array
			userBank[`p${message.author.id}`] = [null,null,null,null,null,null];
			// Send confirmation message
			message.channel.send(`**${message.guild.members.cache.get(args[1]).displayName}** was added as a roulette participant.`);
			// Decrement participant limit and return
			gachaLimit--; return;
		}
		// If the above return fasle, check if they were making a selection as a roulette participant
		else if(args[0] == "pick" && gachaFormat[`p${message.author.id}`]){
			// Check if a valid number was provided, if not return
			if(!(+args[1]) || args[1] > userChoices[`p${message.author.id}`].length || args[1] < 1) {
				message.channel.send("Please enter a valid number.");
				return;
			}
			// Check if the selected choice hasn't already been selected
			if(userBank[`p${message.author.id}`].includes(userChoices[`p${message.author.id}`][args[1]])){
				// Send error and return if it has
				message.channel.send("You've already selected this Pokemon.");
				return;
			}
			// Add the selected choice to the user's bank of choices
			userBank[`p${message.author.id}`][userLimit[`p${message.author.id}`] - 1] = userChoices[`p${message.author.id}`][args[1] - 1];
			// Send confirmation message
			message.channel.send(`You have selected **${userChoices[`p${message.author.id}`][args[1] - 1]}**.`);
			// Decrement remaning choices and reset pick status
			userLimit[`p${message.author.id}`]--;
			userPick[`p${message.author.id}`] = true;
			// Check if all six choices were made
			if(userLimit[`p${message.author.id}`] < 1){
				// Construct message relaying all choices
				let finalPick = "Your choices:"
				for(i=0; i<6; i++){
					finalPick += `\n- ${userBank[`p${message.author.id}`][i]}`;
				}
				// Send constructed message
				message.channel.send(finalPick);
				// Empty out previously used arrays
				delete gachaFormat[`p${message.author.id}`];
				delete userBank[`p${message.author.id}`];
				delete userLimit[`p${message.author.id}`];
				delete userPick[`p${message.author.id}`];
				delete userChoices[`p${message.author.id}`];
				// Find user ID in participant array and reset it's index to null
				gachaPlayers[gachaPlayers.indexOf(message.author.id)] = null;
				// Increment participant limit and return
				gachaLimit++; return;
			}
		}
		else { // If all above return false, send error message and return
			message.channel.send("Invalid arguments.");
			return;
		}
	}
}