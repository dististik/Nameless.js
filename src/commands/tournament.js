const RandomID = require('./scripts/random_id.js');
const RandomEmoji = require('./scripts/random_emoji.js')
const DiscordIDs = require('../json/discord_ids.json')
const Discord = require('discord.js');
const fs = require('fs');
// Array of roles with permissions to use this command
const Perms = [
	DiscordIDs.roles.coordinator,
	DiscordIDs.roles.guest_organizer,
	DiscordIDs.roles.meta_director
];
// Class for constructing tournament objects
class Tournament {
	constructor(status,messageid,emojiid,roster,uid){
		this.status = status;
		this.message_id = messageid;
		this.emoji_id = emojiid;
		this.roster = roster;
		this.uid = uid;
	}
}

module.exports = {
	name: "tournament",
	description: "Command for handling tournaments.",
	aliases: ["tour","tournaments"],
	execute(message,args){
		// Return if sent in DMs
		if(!message.guild) return;
		// Check if message author has the role required to start a tournament
		for(i=0;i<Perms.length;i++){
			if(message.member.roles.has(Perms[i])) break;
			else if(i == Perms.length) { 
				// Exit command if they don't have any of the requires roles
				message.channel.send("You don't have permission to start tournaments");
				return;
			}
		}
		// If no keyword is provided, exit command
		if(!args[0]) { message.channel.send("Please send a tournament keyword."); return; }
		// Execute the proper sub-command for supplied keyword
		switch(args[0]){
			// Start a new tournament
			case "start":
			case "create":
				// If sent outside of the tournament or test channel, exit command
				if(message.channel.id != DiscordIDs.channels['tournaments'] && message.channel.id != DiscordIDs.channels['bot-test']){
					message.channel.send("Please begin a tournament in the proper channels.");
					return;
				}
				// Generate a random tournament ID
				let tourID = RandomID.randomCode();
				// If the random ID is taken, generate a new one
				console.log(fs.existsSync('tournaments/K995.txt'));
				while (fs.existsSync(`tournaments/${tourID}.json`))
					tourID = RandomID.randomCode();
				// Grab a random emoji from Nameless' list
				let reactEmoji = RandomEmoji.randomEmoji(message.client);
				// Get the tournament start message and react to it with the random emoji
				message.channel.fetchMessage(args[1]).then($message => {$message.react(reactEmoji)});
				// Create a new open tournament object and json stringify it
				let newTournament = new Tournament(true,args[1],`${reactEmoji.name}:${reactEmoji.id}`,["69420"],tourID);
				let newTourString = JSON.stringify(newTournament);
				// Create the new tournament file
				fs.writeFile(`tournaments/${tourID}.json`,newTourString,(err) => {
					if(err) throw err;
					console.log(`Tournament file for '${tourID}' created`);
					// Send confirmation message
					message.channel.send(`Started tournament **${tourID}** (${reactEmoji.toString()})`);
				});
				return;
			case "registered":
			case "players":
			case "participants":
				return;
			case "close":
			case "end":
				return;
			case "kill":
			case "delete":
				return;
			case "find":
			case "search":
				return;
		}
	}
}
// !tour {keyword} {message id}