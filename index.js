const { Client, Attachment, RichEmbed } = require('discord.js');
const client = new Client();
const { Promises } = require('util');

const typeChart = require('./weakness_chart.js');

const fs = require('fs');
//Gets text for !help command
var help; fs.readFile('text/command_index.txt','utf8',function(err,data){ if(err) throw err; help = data; });
var warn = false;
//console.log overriding
var oldCon = console.log;
console.log = function(){
	Array.prototype.unshift.call(arguments, getCurrentTime());
    oldCon.apply(this, arguments);
}

client.on('ready', () => {
  console.log('Nameless.js build pre-6 ready!');
});

//reusable functions
function getCurrentTime(){
	var xi = new Date(); var xv = "[";

	if(xi.getHours() < 10) xv += "0" + xi.getHours() + ":";
	else xv += xi.getHours() + ":";

	if(xi.getMinutes() < 10) xv += "0" + xi.getMinutes() + ":";
	else xv += xi.getMinutes() + ":";

	if(xi.getSeconds() < 10) xv += "0" + xi.getSeconds() + "]";
	else xv += xi.getSeconds() + "]";

	return xv;
}

//ALL COMMANDS, will be exported eventually maybe
client.on('message', message => {

	//Test commands (temp)
	if(message.content === '?randextern'){ //Random emoji from bot dump
		if(client.guilds.get('emoji server id').available){
			var $guild = client.guilds.get('emoji server id');
			var $emoji = $guild.emojis;

			let emojiKeys = Array.from($emoji.keys());
			var randno = Math.floor(Math.random() * emojiKeys.length);

			var randEmoji = $emoji.get(emojiKeys[randno]).toString();
			message.channel.send(randEmoji);
		}
		else{
			message.channel.send("I couldn't reach the external emoji server!");
		}
	}

	//HELP COMMAND - Index of call commands for users, add to this AFTER adding functionality
	if(message.content.startsWith('!help')){
		if(message.content === '!help'){
			var embed = new RichEmbed()
				.setTitle('Full Nameless.js command listing')
				.setColor(0xEE7F34)
				.setDescription(help)
				.attachFiles([new Attachment('attatchments/images/boticon.png')])
				.setThumbnail('attachment://boticon.png')
				.setFooter('Page 1 of 1');
			message.channel.send(embed);
		}
	}

	//NO ARGUMENTS
	if(message.content === '!hello'){ //Ping command
		message.channel.send("Hi! I'm Nameless!");
	}
	if(message.content === '!calc'){ //Link to damage calculator
		message.channel.send("Smogon's Damage Calculator: https://pokemonshowdown.com/damagecalc/");
	}
	if(message.content === '!chart'){ //png of weakness chart
		var img = new Attachment('attatchments/images/type_chart.png');
		message.channel.send(img);
	}
	if(message.content === '!invite'){ //Invite link
		message.channel.send("Here's the permalink to join this server! https://discord.gg/kvWncZx");
	}

	//ARGUMENTS OPTIONAL
	if(message.content.startsWith('!weak')){ //Returns weaknesses for one or more types
		var regex = /([a-zA-Z]{1})+(\ {1}\b)+([a-zA-Z]+)/g;

		var pointer;
		var argument;
		var types;

		if(message.content.startsWith('!weakness')) pointer = 10;
		else pointer = 6;

		argument = message.toString().substr(pointer);
		if(argument){
			if(regex.test(argument)) types = argument.split(' ');
			else types = [argument];
			if(types.length == 1){
				message.channel.send( typeChart.weakness(types[0]) );
			}
			else if(types.length == 2){
				message.channel.send( typeChart.weakness2(types[0],types[1]) );
			}
			else message.channel.send("I can't evaluate more than two types at once!");
		}
		else{
			message.channel.send("Please specify a type or combined types for me to check the weaknesses of.");
		}
	}

	//ARGUMENTS REQUIRED
	if(message.content.startsWith('!rule')){ //Reminds rules and allows moderators to warn others of the rules
		function checkRole(id){
			return message.member.roles.has(id);
		}

		var embed = new RichEmbed().setColor(0xEE7F34);
		var $user = message.mentions.members.first();
		var rule = message.toString().substr(6);
		var $channel = message.channel;
		var desc;
		if($user && (checkRole('coordinator id') || checkRole('moderator id') || checkRole('gym leader id'))){ warn = true; }
		if(warn == true){
			var snip = -Math.abs(String($user).length + 1);
			rule = rule.slice(0,snip);
			$channel = $user;
		}

		switch(rule){
			case "respect":
				embed.setTitle('Respect Rule');
				desc = fs.readFileSync('text/rule_respect.txt','utf8');
				break;
			case "spam":
				embed.setTitle('Spam Rule');
				desc = fs.readFileSync('text/rule_spam.txt','utf8');
				break;
			case "illegal":
				embed.setTitle('Illegal Rule');
				desc = fs.readFileSync('text/rule_illegal.txt','utf8');
				break;
			case "mods":
				embed.setTitle('Moderators Rule');
				desc = fs.readFileSync('text/rule_mods.txt','utf8');
				break;
			default:
				message.channel.send("Please send a valid argument."); warn = false;
				return false;
		}
		embed.setDescription(desc);

		if(channel == $user){
			var issuer = message.member.displayName;
			embed.setFooter('Warned by ' + issuer);
			var warned = $user.displayName;
			const staffchan = message.guild.channels.find(ch => ch.name === 'staff-only');
			staffchan.send("**" + warned + "** has been warned by **" + issuer + "** (" + rule + ")");
		}
		else{
			embed.setFooter('General Rules');
		}
		warn = false;
		$channel.send(embed);
	}

	//MOD COMMANDS
	if(message.content.startsWith('!delete')){ //delete messages, mod only
		function checkRole(id){
			return message.member.roles.has(id);
		}

		if(checkRole('coordinator id') || checkRole('moderator id') || checkRole('gym leader id')){
			var num = message.toString().substr(8); num = Number(num);

			if(!isNaN(num) && num < 101 && num > 0){
				message.channel.bulkDelete(num)
					.then(messages => console.log(num + ' messages deleted'))
					.catch(console.error);
				message.channel.send("Deleted " + num + " messages.");
			}
			else{
				message.channel.send("Please send a valid argument.");
			}
		}
		else {
			message.channel.send("You're not allowed to use this command, silly.");
		}
	}
	if(message.content.startsWith('!verify')){ //changes verification level, mod only
		function checkRole(id){
			return message.member.roles.has(id);
		}
		if(checkRole('coordinator id') || checkRole('moderator id') || checkRole('gym leader id')){
			var num = message.toString().substr(8); num = Number(num);

			if(!isNaN(num) && num > 0 && num < 5 && message.guild){
				message.guild.setVerificationLevel(num);
				message.channel.send("The verfication level has been changed to **" + num + "**.");
				console.log(`Server verification level set to ` + num + ` by ` + message.member.displayName);
			}
			else if(!message.guild){
				message.channel.send("I can only change the verfication level of a guild.");
				return false;
			}
			else if(num == 0){
				message.channel.send("Alice told me not to set the verification level lower than 1, sorry ;;");
				return false;
			}
			else{
				message.channel.send("Please send a valid argument.");
			}
		}
		else{
			message.channel.send("You're not allowed to use this command, silly.");
		}
	}

client.on('error', () => {
	console.log("Client encountered an error");
});
client.login(token);