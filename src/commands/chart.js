const Discord = require('discord.js');

module.exports = {
	name: "chart",
	description: "Sends an image of the most up-to-date type alignment chart.",
	execute(message,args){
		message.channel.send(new Discord.Attachment('attatchments/images/type_chart.png'));
	}
}
