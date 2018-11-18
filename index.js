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
  console.log('Nameless.js build 6 ready!');
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
function generateCode(){
	var alphaArray = ['A','B','C','D','E','F','G','H','J','K','M','P','Q','R','T','U','W','X','Y']; var genCode;
	var randno = Math.floor(Math.random() * alphaArray.length);

	genCode = alphaArray[randno]; genCode += Math.floor(Math.random() * 899) + 100;
	return genCode;
}

//ALL COMMANDS, will be exported eventually maybe
client.on('message', message => {

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
		if (!message.guild) return;
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

		if($channel == $user){
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
	if(message.content.startsWith('!tour')){ //Simple tournament handling
		function checkRole(id){
			return message.member.roles.has(id);
		}

		if(checkRole('coordinator id') || checkRole('meta director id') || checkRole('guest organizer id')){
			var commandTxt = message.toString(); var $arguments = commandTxt.split(" ");
			if(commandTxt.includes('start')){
				var tourCode = generateCode();
				while(fs.existsSync(`tournaments/${tourCode}.txt`)){
					tourCode = generateCode(); //generate new code if the current one already exists
				}

				var randEmoji;
				if(client.guilds.get('emoji server id').available){
					var $guild = client.guilds.get('emoji server id');
					var $emoji = $guild.emojis;

					let emojiKeys = Array.from($emoji.keys());
					var randno = Math.floor(Math.random() * emojiKeys.length);

					randEmoji = $emoji.get(emojiKeys[randno]);
				}

				if(randEmoji && ($arguments[2])){
					message.channel.fetchMessage($arguments[2])
						.then($message => {
							$message.react(randEmoji);
							var fileContent = `open,${$arguments[2]},${randEmoji.name}:${randEmoji.id}`;
							var filePath = `tournaments/${tourCode}.txt`;

							fs.writeFile(filePath,fileContent,(err) =>{
								if(err) throw err;
								console.log(`Tournament file for '${tourCode}' created`);
								message.channel.send(`Started tournament **${tourCode}** (${randEmoji.toString()})`);
							});
						})
						.catch(() => {
							message.channel.send("I couldn't find a message with that ID in this channel.");
							console.error;
						});
				}
			}
			else if(commandTxt.includes('registered') && ($arguments[2])){
				if(fs.existsSync(`tournaments/${$arguments[2]}.txt`)){
					tournament = fs.readFileSync(`tournaments/${$arguments[2]}.txt`).toString().split(',');
					if(tournament[0] == 'closed'){
						var roster = new Attachment(`tournaments/closed/${$arguments[2]}.txt`);
						message.channel.send(`This is the current roster for tournament **${$arguments[2]}**`,roster);
					}
					else{
						client.guilds.get('nisemon league id').channels.get('tournament channel id').fetchMessage(tournament[1])
							.then($message => {
								var roster = $message.reactions.get(tournament[2]); var fileContent;
								var filePath = `tournaments/closed/${$arguments[2]}.txt`;

								function createTempRoster(val,key,map){
									fileContent += `${val.username}#${val.discriminator}\r\n`;
								}
								
								roster.fetchUsers(100).then($map => {
									$map.forEach(createTempRoster);
									fileContent = fileContent.replace('Nameless#1985\r\n','');
									fileContent = fileContent.substr(9);
									fileContent = fileContent.trim();
									fs.writeFile(filePath,fileContent,(err) => {
										if(err) throw err;
										console.log(`Roster for tournament '${$arguments[2]}' updated`);
									});
									var $roster = new Attachment(`tournaments/closed/${$arguments[2]}.txt`);
									message.channel.send(`This is the current roster for tournament **${$arguments[2]}**`,$roster);
								});
								return true;
							})
							.catch((err) => {
								var $error = err.toString().split('\n');
								message.channel.send("Something went wrong. Please make sure you're following the requirements for this command.");
								console.log($error[0]);
							});
					}
				}
				else{
					channel.message.send("The requested tournament does not exist.");
				}
			}
			else if(commandTxt.includes('close')){
				if(fs.existsSync(`tournaments/${$arguments[2]}.txt`)){
					tournament = fs.readFileSync(`tournaments/${$arguments[2]}.txt`).toString().split(',');
					tournament[0] = 'closed'; tournamentJoin = tournament.join(',');

					message.channel.fetchMessage(tournament[1])
						.then($message => {
							var roster = $message.reactions.get(tournament[2]); var fileContent;
							var filePath = `tournaments/closed/${$arguments[2]}.txt`;

							function createTempRoster(val,key,map){
								fileContent += `${val.username}#${val.discriminator}\r\n`;
							}
							roster.remove('nameless id');
							roster.fetchUsers(100).then($map => {
								$map.forEach(createTempRoster);
								fileContent = fileContent.replace('Nameless#1985\r\n','');
								fileContent = fileContent.substr(9);
								fileContent = fileContent.trim();
								fs.writeFile(filePath,fileContent,(err) => {
									if(err) throw err;
									console.log(`Roster for tournament '${$arguments[2]}' updated`);
								});
								var $roster = new Attachment(`tournaments/closed/${$arguments[2]}.txt`);
							});
						})
						.catch((err) => {
							var $error = err.toString().split('\n');
							message.channel.send("Something went wrong. Please make sure you're following the requirements for this command.");
							console.log($error[0]);
						});

					var filePath = `tournaments/${$arguments[2]}.txt`;
					fs.writeFile(filePath,tournamentJoin,(err) => {
						if(err) throw err;
						console.log(`Tournament '${$arguments[2]}' closed`);
						message.channel.send(`Closed tournament **${$arguments[2]}**`);
					});
				}
				else{
					channel.message.send("The requested tournament does not exist.");
				}
			}
			else if(commandTxt.includes('kill')){
				if(fs.existsSync(`tournaments/${$arguments[2]}.txt`) && fs.existsSync(`tournaments/closed/${$arguments[2]}.txt`)){
					if(checkRole('coordinator id')){
						var tourPath = `tournaments/${$arguments[2]}.txt`;
						var rosterPath = `tournaments/closed/${$arguments[2]}.txt`;
						fs.unlinkSync(tourPath); fs.unlinkSync(rosterPath);

						console.log(`Tournament '${$arguments[2]}' has been killed by ${message.member.displayName}`);
						message.channel.send(`The requested tournament has been removed from my memory (${$arguments[2]})`);
					}
					else{
						message.channel.send("Only coordinators can kill tournaments.");
					}
			}
				else{
					message.channel.send("Either the requested tournament does not exist or has not been closed.");
				}
			}
			else if(commandTxt.includes('find')){
				if(fs.existsSync(`tournaments/${$arguments[2]}.txt`)){
					tournament = fs.readFileSync(`tournaments/${$arguments[2]}.txt`).toString().split(',');
					var returnMsg = `Here is a link to the sign-up message for tournament **${$arguments[2]}**:` + "\n" 
					+ `https://canary.discordapp.com/channels/207392567925538817/207393832222982155/${tournament[1]}`;
					//link is in the order of: channels/server id/channel id/message id
					//canary link is likely unnecessary

					message.channel.send(returnMsg);
				}
			}
			else{
				message.channel.send("You're not allowed to use this command, silly.");
			}
		}
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