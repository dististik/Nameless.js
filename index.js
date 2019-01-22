// All requirements declared here
const { Client, Attachment, RichEmbed } = require('discord.js');
const client = new Client();
const config = require('./config.json');
const reuse = require('./reusable.js');
let cmd = require('./commands.js');

// Empty variables
let cmds;

// Override console.log
let oldCon = console.log;
console.log = function(){
	Array.prototype.unshift.call(arguments, reuse.getCurrentTime());
    oldCon.apply(this, arguments);
}

// Operations to run on ready
client.on('ready', () => {
	console.log('Nameless.js rewrite build pre-1 ready!');
	cmds = new cmd('.!');
});

// Operations to run on message recieved
client.on('message', message => {
	// return if the message doesn't begin with the command prefix
	if(!message.content.startsWith(cmds.prefix)) return;
	// Execute command
	let $arguments = message.content.toLowerCase().split(' ');
	cmds.command(message,$arguments);
});

// Handle client errors
client.on('error', () => {
	console.log("Client encountered an error");
});

// Login using current bot token
client.login(config.currentToken);