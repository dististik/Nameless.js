const Rules = require("../json/rules.json");
const DiscordIDs = require("../json/discord_ids.json");
const Discord = require('discord.js');
// Array for roles with extra permissions for the command
const Perms = [
	DiscordIDs.roles.coordinator,
	DiscordIDs.roles.moderator,
	DiscordIDs.roles.gym_leader
];

module.exports = {
	name : "rules",
	description: "Sends a requested rule or can be used by moderators to warn others breaking the rules.",
	aliases: ["rule"],
	execute(message,args){
		// If the command is sent in DMs, ignore it
		if(!message.guild) return;
		// If a mention exists in the command message, assign it to memory
		let mention = message.mentions.members.first();
		// Create the embed object for sending the rule by fetching rule info from rules.json
		let embed = new Discord.MessageEmbed()
			.setColor(0xEE7F34)
			.setTitle(Rules[args[0]].title)
			.setDescription(Rules[args[0]].text);
		// Check if the command was sent as a warning, if so send it to the warnee
		if(mention){
			// Check if the sender has the permission to send warnings
			for(i=0;i<Perms.length;i++){
				if(message.member.roles.has(Perms[i])) break;
				else if(i == Perms.length) {
					message.channel.send("You don't have permission to send warnings.");
					return;
				}
			}
			// Set footer to warning issuer info
			embed.setFooter('Warned by ' + message.member.displayName);
			// Send warning in DM to warnee
			mention.send(embed);
			// Send information regarding the warning to staff lobby
			message.guild.channels.find(ch => ch.name === 'staff-only')
				.send("**" + mention.displayName + "** has been warned by **" + message.member.displayName + "** (" + args[0] + ")");
			return;
		}
		// If the command was not sent as a warning, set the generic footer
		embed.setFooter('General Rules');
		// Send embed
		message.channel.send(embed);
	}
}