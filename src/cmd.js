const Discord = require('discord.js');

module.exports = {
	noArg : function() {
		if(message.content === '!hello'){
			message.channel.send("Hi! I'm Nameless!")
		}
	}
}