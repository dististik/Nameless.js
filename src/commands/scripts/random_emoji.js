const Discord = require("discord.js")
const DiscordIDs = require("../../json/discord_ids.json");

// Function for picking random property from object
function randomProperty(obj){
	let keys = Array.from(obj.keys());
	return obj.get(keys[Math.floor(Math.random() * keys.length)])
};
// Get a random emoji from Nameless' designated emoji guild
exports.randomEmoji = function(client){
	// Create variable for emoji guild
	let emojiGuild = client.guilds.get(DiscordIDs.guilds.emoji);
	// If the emoji guild is online, return a random emoji from it
	if(emojiGuild.available)
		return randomProperty(emojiGuild.emojis);
}