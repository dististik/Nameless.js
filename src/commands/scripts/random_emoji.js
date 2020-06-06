const Discord = require("discord.js")
const DiscordIDs = require("../../json/discord_ids.json");

// Function for picking random property from object
function randomProperty(obj){
	// Create array of emoji keys
	let keys = Array.from(obj.keys());
	// Pick a random key to access the cache of guild emoji
	return obj.get(keys[Math.floor(Math.random() * keys.length)])
};
// Get a random emoji from Nameless' designated emoji guild
exports.randomEmoji = function(client){
	// Create variable for emoji guild
	let emojiGuild = client.guilds.cache.get(DiscordIDs.guilds.emoji);
	// If the emoji guild is online, return a random emoji from it
	if(emojiGuild.available)
		return randomProperty(emojiGuild.emojis.cache);
}