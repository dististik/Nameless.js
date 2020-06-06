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
		this.links = ["download","view"];
	}
}
// Function for creating tournament embeds
function tourEmbed(obj,type){
	switch(type){
		case "roster":
			// Initialise string for tour status and set it to the correct string depending on obj propety
			let tourStatus = "";
			if(!obj.status) tourStatus = "Closed"; else tourStatus = "Open";
			// Create and return embed
			let embed = new Discord.MessageEmbed()
				.setColor(0xE57274)
				.setTitle(`${obj.uid} - Tournament Roster`)
				.setDescription(`**Players**: ${obj.roster.length}\n**Status**: ${tourStatus}\n[download](${obj.links[0]}) | [view](${obj.links[1]})`)
				.setFooter("#tournaments");
			return embed;
	}
}
// Function for fetching newly sent roster text files
async function getTextFile(channel){
	// Initialise blank return string
	let $return = "";
	// Wait for the client to finish sending the file
	await channel.send(new Discord.Attachment('attatchments/text/roster.txt')).then($message => {
		// Assign message ID to string
		$return = channel.lastMessageID;
	});
	// Return ID
	return $return;
}
// Function for processing the roster of open or closing (not yet closed) tournaments
function getRoster(obj,message,send){
	// Empty the existing roster in case any changes have happened to already existing registries
	obj.roster = [].slice();
	// Fetch the tournament message and it's reactions
	console.log(obj);
	console.log(obj.message_id);
	message.channel.messages.fetch(obj.message_id)
		.then($message => {
			console.log($message);
			let reactions = $message.reactions.cache.get(obj.emoji_id);
			// Process the reactions and place them in the tournament object's roster array
			reactions.users.fetch({limit:100}).then($map => {
				// Assign values to an array and initialise a string mirror of tour object roster array
				let values = Array.from($map);
				let userString = "";
				// Itterate over values array and pull full usernames into users array
				for(i=0;i<values.length;i++){
					// Ignore bot accounts
					if(values[i][1].bot) continue;
					// Construct string using template, push it into the user array, and mirror it to the user string
					let x = `${values[i][1].username}#${values[i][1].discriminator}`;
					obj.roster.push(x); userString += `${x}\n`;
				}
				// Create text file for tournament roster
				fs.writeFile(`attatchments/text/roster.txt`,userString,(err) => {
					if (err) throw err;
					// Send text file to private server and grab it
					let attFile = message.client.guilds.cache.get(DiscordIDs.guilds.emoji)
						.channels.cache.get(DiscordIDs.channels['attachments']);
					attFile.send(new Discord.MessageAttachment('attatchments/text/roster.txt')).then($txt => {
						// Grab .txt file attachment ID from message attachment keys
						let textID = $txt.attachments.keys().next().value;
						// Set tournament link array to the appropriate links
						obj.links[0] = `https://cdn.discordapp.com/attachments/${DiscordIDs.channels['attachments']}/${textID}/roster.txt`;
						obj.links[1] = `https://txt.discord.website/?txt=${DiscordIDs.channels['attachments']}/${textID}/roster`;
						// Send the embed if requested to, otherwise overwrite old tournament JSON
						if (send) { message.channel.send(tourEmbed(obj,"roster")); return; }
						else {
							// Assign JSON to old tournament string
							tourString = JSON.stringify(obj);
							// Overwrite old tournament file
							fs.writeFile(`tournaments/${obj.uid}.json`,tourString,(err) => {
								if(err) throw err;
								console.log(`Tournament file for '${obj.uid}' updated`);
								// Send confirmation message
								message.channel.send(`Tournament **${obj.uid}** has been closed`);
							});
						}
					});
				});
			});
		});
}

module.exports = {
	name: "tournament",
	description: "Command for handling tournaments.",
	aliases: ["tour","tournaments"],
	execute(message,args){
		// Return if sent in DMs
		if(!message.guild) return;
		// If the message wasn't sent in either of the proper channels, return
		if(message.channel.id != DiscordIDs.channels['tournaments'] && message.channel.id != DiscordIDs.channels['bot-test']){
			message.channel.send("Please send this request the tournaments channel.");
			return;
		}
		// Check if message author has the role required to start a tournament
		for(i=0;i<Perms.length;i++){
			if(message.member.roles.cache.has(Perms[i])) break;
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
				// Generate a random tournament ID
				let tourID = RandomID.randomCode();
				// If the random ID is taken, generate a new one
				while (fs.existsSync(`tournaments/${tourID}.json`))
					tourID = RandomID.randomCode();
				// Grab a random emoji from Nameless' list
				let reactEmoji = RandomEmoji.randomEmoji(message.client);
				// Get the tournament start message and react to it with the random emoji
				message.channel.messages.fetch(args[1]).then($message => {$message.react(reactEmoji)});
				// Create a new open tournament object and json stringify it
				let newTournament = new Tournament(true,args[1],reactEmoji.id,["69420"],tourID);
				let newTourString = JSON.stringify(newTournament);
				// Create the new tournament file
				fs.writeFile(`tournaments/${tourID}.json`,newTourString,(err) => {
					if(err) throw err;
					console.log(`Tournament file for '${tourID}' created`);
					// Send confirmation message
					message.channel.send(`Started tournament **${tourID}** (${reactEmoji.toString()})`);
				});
				return;
			// Check the roster of a requested tournament
			case "registered":
			case "players":
			case "participants":
				// Check if a tournament ID was supplied and if so, if it exists
				if(!args[1]) { message.channel.send("Please provide a tournament ID."); return; }
				if(!fs.existsSync(`tournaments/${args[1]}.json`)) { message.channel.send("That tournament does not exist."); return; }
				// Create an object from the specified tournament file
				let tourContents = fs.readFileSync(`tournaments/${args[1]}.json`);
				let $tour = JSON.parse(tourContents);
				// If the fetched tournament has closed it's signups, send the registered list and return
				if($tour.links[0] != "download"){
					message.channel.send(tourEmbed($tour,"roster"));
					return;
				}
				// If the fetched tournament is still open, process the roster and send the resulting embed
				getRoster($tour,message,true);
				return;
			// End signups for a requested tournament
			case "close":
			case "end":
				// Check if a tournament ID was supplied and if so, if it exists
				if(!args[1]) { message.channel.send("Please provide a tournament ID."); return; }
				if(!fs.existsSync(`tournaments/${args[1]}.json`)) { message.channel.send("That tournament does not exist."); return; }
				// Create an object from the specified tournament file
				let tourString = fs.readFileSync(`tournaments/${args[1]}.json`);
				let tournObj = JSON.parse(tourString);
				// Check if the tournament signups have already ended
				if(!tournObj.status) { message.channel.send("Signups for this tournament have already been closed."); return; }
				// If tournament signups have not ended, set the tournament object's status to false
				tournObj.status = false;
				// Process the roster and overwrite old tournament file
				getRoster(tournObj,message,false);
				return;
			// Delete a tournament file
			case "kill":
			case "delete":
				// Check if the user is a coordinator
				if(!message.member.roles.cache.has(DiscordIDs.roles.coordinator)) { 
					message.channel.send("Only a coordinator can delete tournament files."); 
					return; 
				}
				// Check if a tournament ID was supplied and if so, if it exists
				if(!args[1]) { message.channel.send("Please provide a tournament ID."); return; }
				if(!fs.existsSync(`tournaments/${args[1]}.json`)) { message.channel.send("That tournament does not exist."); return; }
				// Delete file
				fs.unlinkSync(`tournaments/${args[1]}.json`);
				// Log in console and send confirmation message
				console.log(`Tournament '${args[1].toUpperCase()}' has been killed by ${message.member.displayName}`);
				message.channel.send(`The requested tournament has been removed from my memory (${args[1].toUpperCase()})`);
				return;
		}
	}
}
