const { Client, Attachment, RichEmbed } = require('discord.js');
const client = new Client();
const { Promises } = require('util');

const typeChart = require('./weakness_chart.js');
const Gacha = require('./roulette.js');
const $config = require('./config.json');

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
//Gacha globals
let gachaLimit = 2; // How many players can be active at once
let gachaPlayers = [null,null]; // IDs of active players
let gachaFormat = []; // Format of gacha the player of the same index has been set to
let userBank = []; // Players' active choices
let userLimit = []; // Remaining picks for the active player
let userPick = []; // If the user may pick or not
let userChoices = []; // Choices the current user may pick from
let gachaMasterKey = []; // Array for clearing memory after successful round
let gachaRules = `Once entered into the gacha by anyone with the permissions to do so, you can draw up to 6 choices from your specified format. After your draw, you must pick at least one choice before being able to draw again. If your choice does not specify a forme (for example "Kyurem-Normal"), you're free to use any forme of that choice that is legal in your specified format for your team.\n\nPlease be careful to only pick choices you're absolutely sure about, as once you take one there's no going back! Once you've made all six of your choices, I'll print them all out for you to keep track of in case you forget. We highly recommend making your team as you make picks to keep track of your team's weaknesses and existing coverage. Have fun!`;

//Quit globals
let quitKey = null;
let quitP1 = ['z','v','3','r','1','$'];
let quitP2 = ['y','z','+','7','n','i'];

client.on('ready', () => {
  console.log('Nameless.js build 13 ready!');
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
function nameContainsLink(name){
	if(
		name.includes("discord.gg") ||
		name.includes("paypal.me") ||
		name.includes("twitter.com")
	) return true;
	else return false;
}
function generateCode(){
	var alphaArray = ['A','B','C','D','E','F','G','H','J','K','M','P','Q','R','T','U','W','X','Y']; var genCode;
	var randno = Math.floor(Math.random() * alphaArray.length);

	genCode = alphaArray[randno]; genCode += Math.floor(Math.random() * 899) + 100;
	return genCode;
}

client.on('guildMemberAdd', member => {
	if(nameContainsLink(member.displayName.toString())){
		member.guild.channels.find(ch => ch.name === 'lobby').bulkDelete(1)
			.then(console.log(`"$(member)" was detected with a link in their name`))
			.catch(console.error);
		member.addRole('216459121287888896')
			.catch(console.log("Something went wrong with adding a role to that user"));
	}
});

//ALL COMMANDS, will be exported eventually maybe
client.on('message', message => {
	//temp commands
	if(message.content === '?replacex'){
		var $$string = 'Text\nText2\nText3';
		$$string = $$string.replace('Text2\n','');
		console.log($$string);
	}
	if(message.content === '?testmsg'){
		client.guilds.get('207392567925538817').channels.get('241397260489981952').send('This test was successful.');
	}
	if(message.content === '?testembed'){
		var embed = new RichEmbed()
			.setDescription('[Link test](https://google.com)');
		message.channel.send(embed);
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
	if(message.content.startsWith('!gacha')){ //Returns a random selection of technically viable mons
		function checkRole(id){
			return message.member.roles.has(id);
		}
		let $args = message.content.split(' ');
		if(!$args[1]){
			message.channel.send("Please provide the following arguments: `!gacha <format> <# 1-6>`");
			return false;
		}

		if($args[1] == "help"){
			var embed = new RichEmbed()
				.setTitle('Nisemon Gacha Rules')
				.setColor(0xEF7CEF)
				.setDescription(gachaRules)
				.setFooter('Welcome to gacha hell!');
			message.channel.send(embed);
			return false;
		}

		if($args[1] == "start" && (checkRole('207392952777965568') || checkRole('455246303530713089') || checkRole('501510244749541376')) && gachaLimit > 0){
			if(!message.guild.members.get($args[2])){
				message.channel.send('This user is not a member of this server.');
				return false;
			}
			if(gachaPlayers.includes($args[2])){
				message.channel.send('This user is already entered in the gacha.');
				return false;
			}
			if(!Gacha.validFormats($args[3].toLowerCase()) || !$args[3]){
				message.channel.send("Invalid or unprovided format.");
				return false;
			}

			gachaPlayers[gachaLimit - 1] = $args[2];
			let playerKey = `p${gachaPlayers[gachaLimit - 1]}`;
			gachaMasterKey[playerKey] = gachaLimit - 1;
			gachaFormat[playerKey] = $args[3].toLowerCase();
			userPick[playerKey] = true;
			userBank[playerKey] = [null,null,null,null,null,null];
			userLimit[playerKey] = 6;
			userChoices[playerKey] = 0;
			gachaLimit--;

			message.channel.send(`**${message.guild.members.get($args[2]).displayName}** has been entered in the gacha.`);

			return false;
		}
		else if((gachaLimit <= 0) && $args[1] == 'start'){
			message.channel.send("Only two players may pick at the same time.");
			return false;
		}
		else if(!(checkRole('207392952777965568') || checkRole('455246303530713089') || checkRole('501510244749541376')) && $args[1] == "start"){
			message.channel.send("You're not allowed to use this command, silly.");
			return false;
		}

		if(!gachaPlayers.includes(message.author.id)){
			$args[2] = Number($args[2]);

			if(!Gacha.validFormats($args[1].toLowerCase())){
				message.channel.send("Invalid format.");
				return false;
			}
			if(Gacha.validSize($args[2])){
				message.channel.send("You must pick a number between 1 and 6 Pokemon to draw (including 1 and 6).");
				return false;
			}
			message.channel.send(Gacha.randpoke($args[1].toLowerCase(),$args[2]));
			return false;
		}
		else if(gachaPlayers.includes(message.author.id)){
			let playerKey = `p${message.author.id}`;
			// get whether or not the player can roll
			if(userPick[playerKey] == true && $args[1] != "pick"){
				// if they can, check if they requested the correct format
				if($args[1].toLowerCase() == gachaFormat[playerKey]){
					if(Gacha.validSize($args[2])){
						message.channel.send("You must pick a number between 1 and 6 Pokemon to draw (including 1 and 6).");
						return false;
					}
					// generate a list of picks for them to chose from and make them unable to roll again
					$picks = Gacha.randpoke($args[1].toLowerCase(),$args[2]);
					$picksArray = $picks.split('\n');
					$picksArray.shift();
					$picksArray.forEach(function(){
						for(xi=0;xi<$args[2];xi++) $picksArray[xi] = $picksArray[xi].replace(/\[+[0-6]+\]+\ /g,'').replace(/\*\*/g,'');
					});
					userChoices[playerKey] = $picksArray.slice();
					message.channel.send($picks);
					userPick[playerKey] = NaN;

					return false;
				}
				else{
					message.channel.send("You may only draw from the following format: `" + gachaFormat[playerKey] + "`");
					return false;
				}
				return false;
			}
			else if($args[1] == "pick" && userChoices[playerKey] == 0){
				message.channel.send("Please start your first draw before picking.");
				return false;
			}
			else if($args[1] == "pick" && userChoices[playerKey] != 0 && userLimit[playerKey] > 0){
				if(userChoices[playerKey][$args[2] - 1]){
					if(userBank[playerKey].includes(userChoices[playerKey][$args[2] - 1])){
						message.channel.send("You have already picked this Pokemon.");
						return false;
					}

					userBank[playerKey][userLimit[playerKey] - 1] = userChoices[playerKey][$args[2] - 1];
					message.channel.send(`You have selected **${userBank[playerKey][userLimit[playerKey] - 1]}**.`);
					userLimit[playerKey]--;
					if(userLimit[playerKey] == 0){
						let printString = `Your picks:`;
						for(vi=0;vi<6;vi++){
							printString += `\n- **${userBank[playerKey][vi]}**`;
						}
						message.channel.send(printString);

						gachaPlayers[gachaMasterKey[playerKey]] = null;
						delete gachaFormat[playerKey];
						delete userBank[playerKey];
						delete userLimit[playerKey];
						delete userPick[playerKey];
						delete userChoices[playerKey];
						delete gachaMasterKey[playerKey];
						gachaLimit++;
						return false;
					}
					userPick[playerKey] = true;
					return false;
				}
				else{
					message.channel.send("Invalid input.");
					return false;
				}
			}
			else if($args[1] != "pick" && userPick[playerKey] == NaN){
				message.channel.send("You must pick a Pokemon before starting a new draw.");
				return false;
			}
			return false;
		}
	}
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
		if($user && (checkRole('207394386412175361') || checkRole('207393223813890048') || checkRole('207392952777965568'))){ warn = true; }
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
		if(!message.guild) { message.channel.send('I can only do this in a guild!'); return; }
		function checkRole(id){
			return message.member.roles.has(id);
		}

		if(checkRole('207392952777965568') || checkRole('455246303530713089') || checkRole('501510244749541376')){
			var commandTxt = message.toString(); var $arguments = commandTxt.split(" ");
			if(commandTxt.includes('start')){
				var tourCode = generateCode();
				while(fs.existsSync(`tournaments/${tourCode}.txt`)){
					tourCode = generateCode(); //generate new code if the current one already exists
				}

				var randEmoji;
				if(client.guilds.get('502711142083198977').available){
					var $guild = client.guilds.get('502711142083198977');
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
						client.guilds.get('207392567925538817').channels.get('207393832222982155').fetchMessage(tournament[1])
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
					message.channel.send("The requested tournament does not exist.");
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
							roster.remove('241391655519780869');
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
					message.channel.send("The requested tournament does not exist.");
				}
			}
			else if(commandTxt.includes('kill')){
				if(fs.existsSync(`tournaments/${$arguments[2]}.txt`) && fs.existsSync(`tournaments/closed/${$arguments[2]}.txt`)){
					if(checkRole('207392952777965568')){
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
				let filtered = false;

				function tourFindLoop(callback){
					var returnString = ""; var directoryContents = ""; var directoryLength; let $$_ = false;
					fs.readdir('./tournaments/',(err,files) => {
						if(err) throw err;
						directoryLength = files.length;
						for(i = 0; i < directoryLength; i++){
							directoryContents += files[i];
							if(i != directoryLength - 1) directoryContents += ",";
						}
						directoryContents = directoryContents.replace(/\.txt/gi,'');
						directoryContents = directoryContents.split(',');

						if($arguments[2]) $$_ = true;

						var tourLinks = []; var tourCount = directoryContents.length;
						for(i = 0; i < tourCount; i++){
							if(directoryContents[i] == "closed" || (directoryContents[i] != $arguments[2] && $$_)) continue;
							var currentTour = fs.readFileSync(`./tournaments/${directoryContents[i]}.txt`).toString().split(',');
							tourLinks.push(`https://canary.discordapp.com/channels/207392567925538817/207393832222982155/${currentTour[1]}`);
						}

						let $$$ = 0;
						for(i = 0; i < tourCount; i++){
							if(directoryContents[i] == "closed" || (directoryContents[i] != $arguments[2] && $$_)) {$$$++;continue;}
							returnString += `[${directoryContents[i]}](${tourLinks[i-$$$]}): `;
							tournament = fs.readFileSync(`tournaments/${directoryContents[i]}.txt`).toString().split(',');
							returnString += tournament[0];
							returnString += "\n";
						}

						if($$_) filtered = true;
						returnString = returnString.trim();
						if(callback) callback(returnString);
					});
				}

				tourFindLoop($string => { 
					var embed = new RichEmbed()
						.setDescription($string)
						.setColor(0xEF2626)
						.setFooter('#tournaments');
					if(filtered) embed.setTitle('Filtered Tournament Listing');
					else embed.setTitle('Complete Tournament Listing');
					message.channel.send(embed);
				});
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

		if(checkRole('207394386412175361') || checkRole('207393223813890048') || checkRole('207392952777965568')){
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
	if(message.content.startsWith('!quit')){ //shuts down nameless after verification
		if(message.member.roles.has('207392952777965568')){
			if(!quitKey){
				let tempKey = '';
				for(i=0;i<5;i++){
					if(Math.random() < 0.5) tempKey += quitP2[Math.floor(Math.random() * 6)];
					else tempKey += quitP1[Math.floor(Math.random() * 6)];
				}
				quitKey = tempKey;
				message.channel.send(`Please verify shutdown. Token: \`${quitKey}\``);
			} else {
				let verifyKey = message.toString().substr(6);
				if(verifyKey == quitKey){
					async function shutdown(){
						await message.channel.send("Shutting down...");
						process.exit(22);
					}
					shutdown();
				}
				else{
					quitKey = null;
					message.channel.send("Incorrect shutdown token. Token has been reset to null.");
				}
			}
		}
		else{
			message.channel.send(`That's a dangerous command you're trying to use there mister.`);
		}
	}
	if(message.content.startsWith('!verify')){ //changes verification level, mod only
		function checkRole(id){
			return message.member.roles.has(id);
		}
		if(checkRole('207394386412175361') || checkRole('207393223813890048') || checkRole('207392952777965568')){
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
	//FUN COMMANDS (not doccumented in commands_index.txt)
	if(message.content.toLowerCase().startsWith('your mom')){ //validates awful jokes
		message.channel.send("Got 'em");
	}
	if(message.content === '!patpat'){ //picks a random reply between 0 and i - 1
		var randno = Math.floor(Math.random() * 7);
		switch(randno){
			case 0:
				message.channel.send("Bweh!");
				break;
			case 1:
				message.channel.send("W-Why are you doing this?");
				break;
			case 2:
				message.channel.send("H-Huh?! Can I help you with something..?");
				break;
			case 3:
				message.channel.send("Ehh?! Why do people have such a fixation with touching my head...");
				break;
			case 4:
				message.channel.send("T-Thank you, but this really isn't necessary.");
				break;
			case 5:
				message.channel.send("Don't you think this is a little embarrassing..?");
				break;
			case 6:
				message.channel.send("Why don't you just say hello to me like a normal person??");
				break;
		}
	}
	if(message.content === '!codepls'){ //snarky reply to asking for commands
		message.channel.send("I await your pull request :heart:\nhttps://github.com/dististik/Nameless.js");
	}
	if(message.content.toLowerCase().startsWith('!quote')){ //says a requested quote
		var quote = message.toString().substr(7);
		switch(quote){
			case 'beyond':
				message.channel.send("PLUS ULTRA!");
				break;
			case 'magic':
				message.channel.send("A believing heart is your magic!");
				break;
			case 'jevil':
				if( Math.random > 0.5 )
					message.channel.send("Chaos chaos!");
				else
					message.channel.send("I can do anything!");
				break;
			case 'one-two':
				message.channel.send("Get up on the Hydra's back!");
				break;
			case 'rapture':
				message.channel.send("Would you kindly...");
				break;
			case 'maria':
				message.channel.send("A corpse... should be left well alone.");
				break;
			case 'key':
				message.channel.send("Let your heart be your guiding key.");
				break;
			case 'sleep':
				message.channel.send("I dream of Mareep.");
				break;
			case 'nico':
				message.channel.send("にっこにっこにー");
				break;
			case 'claro':
				let insult = Math.floor(Math.random() * 3);
				if(message.author.id == "266698342103252993"){
					switch(insult){
						case 0:
							message.channel.send("No.");
							return;
						case 1:
							message.channel.send(`"Guys when am I getting a quote?" that's you that's what you sound like`);
							return;
						case 2:
							message.channel.send("Please stop asking.");
							return;
					}
				} else {
					switch(insult){
						case 0:
							message.channel.send("Why are you validating him?");
							return;
						case 1:
							message.channel.send("You have a terrible sense of humour.");
							return;
						case 2:
							message.channel.send("Go make your own Discord bot, you absolute nerds.");
							return;
					}
				}
				return;
			case 'yorha':
				message.channel.send("Glory to Mankind");
				return;
			case 'pirate':
				message.channel.send("It's just good business");
				return;
			case 'transistor':
				message.channel.send("Quote()");
				return;
			case 'youtube':
				message.channel.send("Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.");
				return;
			case 'illuminati':
				message.channel.send("Shhhhhhhhhhh");
				return;
		}
	}
});

client.on('error', () => {
	console.log("Client encountered an error");
});
//Login using config JSON
client.login($config.token);