module.exports = {
	name: "invite",
	description: "Sends the permanent invite link for the Nisemon League server.",
	execute(message,args){
		message.channel.send("Here's the permalink to join this server! https://discord.gg/kvWncZx");
	}
}