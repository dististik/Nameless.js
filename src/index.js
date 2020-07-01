// declare all dependancies
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const Config = require('./config.json');

// declare all function independant values
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// assign all file based commands to the commands collection
for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name,command);
}

// common event handling
// code to execute when the client is successfully connected to discord
client.on('ready', () => {
	console.log('Nameless rewrite build 5 is ready!');
});

// code to execute when a message is recieved
client.on('message', message => {
	// if the message doesn't begin with the command prefix or is from any bot, return
	if(!message.content.startsWith(Config.prefix) || message.author.bot) return;
	// create a list of arguments and find what the command is (non-case sensitive)
	const args = message.content.slice(Config.prefix.length).toLowerCase().split(/ +/);
	const commandName = args.shift().toLowerCase();
	// search for command/command alias, return if none found
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if(!command) return;
	// execute command, now featuring error handler imagine that
	try{
		command.execute(message,args);
	} catch(error) {
		console.error(error);
		message.reply('An unexpected error occurred while trying to execute that command.');
	}
});

// if connection errors or other client level errors occur handle them and continue normal processes
client.on('error', () => {
	console.log("Client encountered an error");
});

// login processing - do NOT write her login token in plain text
client.login(Config.token);