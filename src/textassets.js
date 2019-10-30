// All requirements declared here
const { Client, Attachment, RichEmbed } = require('discord.js');
const client = new Client();
const reuse = require('./reusable.js');
const helpi = require('./help.json');

module.exports = class ExternalTextAssets{
	constructor(){
		// Embeds
		this.helpEmbed = new RichEmbed()
			.setTitle('Full Nameless.js command listing')
			.setColor(0xEE7F34)
			.setDescription(commandListing(0,null))
			.attachFiles([new Attachment('attatchments/images/boticon.png')])
			.setThumbnail('attachment://boticon.png')
			.setFooter('Page 1 of 1');
		this.commandEmbed = new RichEmbed()
			.setTitle('Command information')
			.setColor(0xEE7F34)
			.attachFiles([new Attachment('attatchments/images/boticon.png')])
			.setThumbnail('attachment://boticon.png')
		// String

		// Functions
		this.helpFunction = function(type,command) {return commandListing(type,command);}
	}
}

// Get command listing
let commandNames = Object.keys(helpi);
let commandIndex = Object.values(helpi);
// Create help embed details
function commandListing(type,command){
	// Initiate empty return string
	let $return = ""; 
	// Type 0 -- Initial help embed description
	if(type === 0){
		let currentAccess = -1;
		for(i = 0;i<=commandIndex.length-1;i++){
			// Add header to all user access command section
			if(commandIndex[i].access === 0 && currentAccess < 0){
				$return += "**__All user access__**\n";
				$return += `**${commandNames[i]}** - ${commandIndex[i].short}\n`;
				currentAccess++;
				continue;
			}
			// Add the rest of all user access commands
			else if(commandIndex[i].access !== 1){
				$return += `**${commandNames[i]}** - ${commandIndex[i].short}\n`;
				continue;
			}
			// Add header to staff only command section
			else if(commandIndex[i].access === 1 && currentAccess < 1 && i < commandIndex.length-1){
				$return += "\n**__Staff only commands__**\n";
				$return += `**${commandNames[i]}** - ${commandIndex[i].short}\n`;
				currentAccess++;
				continue;
			}
			// Add the rest of staff only commands
			else if(commandIndex[i].access === 1 && i < commandIndex.length-1){
				$return += `**${commandNames[i]}** - ${commandIndex[i].short}\n`;
				continue;
			}
			// Add last command and footer
			else{
				$return += `**${commandNames[i]}** - ${commandIndex[i].short}\n`;
				$return += "\nRemember to start messages with `!` if you're trying to use a command!"
			}
		}
		return $return;
	}
	// Type 4 -- Return specific command information
	if(type === 4){
		if(helpi[command]){
			// Command name
			$return += `\`${command}\`\n\n`;
			// Command description
			$return += `**__Description__**\n${helpi[command].desc}\n\n`;
			// Command arguments
			$return += `**__Arguments__**\n${helpi[command].arguments}\n\n`;
			// Command aliases
			$return += `**__Aliases__**\n${helpi[command].aliases}\n\n`;
			// Command access
			if(helpi[command].access === 0)
				$return += `All user access`;
			else
				$return += `Staff only access`;
			return $return;
		}
		else
			return false;
	}
}