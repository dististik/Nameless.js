// All requirements declared here
const { Client, Attachment, RichEmbed } = require('discord.js');
const client = new Client();
const { Promises } = require('util');
const typeChart = require('./weakness_chart.js');
const fs = require('fs');
const config = require('./config.json');
const reuse = require('./reusable.js');
const helpi = require('./help.json');
const asset = require('./textassets.js')

// Commands class
module.exports = class Commands{
	// Find the current prefix and set it for use later
	constructor(prefix){
		this.prefix = prefix;
		this.assets = new asset();
	}

	// Full command listing
	command($msg,$args){
		// Remove prefix from command and check alias
		$args[0] = checkAlias($args[0].substr(this.prefix.length));
		// Commands with optional arguments (always sends a message on a match)
		switch ($args[0]){
			// Actually helpful

			case 'help': // Retrieve info about command listing
				if(!$args[1]){
					$msg.channel.send(this.assets.helpEmbed);
					return;
				}
				if($args[1] && !$args[2]){
					if(this.assets.helpFunction(4,$args[1])){
						this.assets.commandEmbed
							.setDescription(this.assets.helpFunction(4,$args[1]))
							.setFooter(`Command info: ${$args[1]}`);
						$msg.channel.send(this.assets.commandEmbed);
						return;
						}
					else {
						$msg.channel.send("Command not found.");
						return;
					}
				}

			// Easter eggs
		}
		// Commands without arguments (only sends a message if there are no aruments)
		if(!$args[1]){
			switch ($args[0]){
				// Actually helpful

				case 'hello': // Basic ping command
					$msg.channel.send("Hi! I'm Nameless!");
					return;
				case 'calc': // Links to relevant damage calculators
					$msg.channel.send("Smogon's Damage Calculator: https://pokemonshowdown.com/damagecalc/");
					return;
				case 'chart': // Sends image of current type chart
					let atch = new Attachment('attatchments/images/type_chart.png');
					$msg.channel.send(atch);
					return;
				case 'invite': // Sends invite link
					$msg.channel.send("Here's the permalink to join the server! https://discord.gg/kvWncZx");
					return;

				// Easter eggs

				case 'patpat': // Pat Nameless on the head
					switch (Math.floor(Math.random() * 7)){
						case 0:
							$msg.channel.send("Bweh!");
							return;
						case 1:
							$msg.channel.send("W-Why are you doing this?");
							return;
						case 2:
							$msg.channel.send("H-Huh?! Can I help you with something..?");
							return;
						case 3:
							$msg.channel.send("Ehh?! Why do people have such a fixation with touching my head...");
							return;
						case 4:
							$msg.channel.send("T-Thank you, but this really isn't necessary.");
							return;
						case 5:
							$msg.channel.send("Don't you think this is a little embarrassing..?");
							return;
						case 6:
							$msg.channel.send("Why don't you just say hello to me like a normal person??");
							return;
					}
			}
		}
		// Commands with required arguments (only sends a message if there's at least one argument)
		if($args[1]){
			switch ($args[0]){
				//Actually helpful commands

				// Easter eggs

				case 'quote': // Have Nameless recite a quote
					switch ($args[1]){
						case 'beyond':
							$msg.channel.send("PLUS ULTRA!");
							return;
						case 'magic':
							$msg.channel.send("A believing heart is your magic!");
							return;
						case 'jevil':
							if( Math.random() > 0.5 )
								$msg.channel.send("Chaos chaos!");
							else
								$msg.channel.send("I can do anything!");
							return;
						case 'one-two':
							$msg.channel.send("Get up on the Hydra's back!");
							return;
						case 'rapture':
							$msg.channel.send("Would you kindly...");
							return;
						case 'maria':
							$msg.channel.send("A corpse... should be left well alone.");
							return;
						case 'key':
							$msg.channel.send("Let your heart be your guiding key.");
							return;
						case 'sleep':
							$msg.channel.send("I dream of Mareep.");
							return;
						case 'nico':
							$msg.channel.send("にっこにっこにー");
							return;
					}
			}
		}
		// Commands with optional arguments

		// End
	}
}

// Initiate command alias associative array
let list = [];
// Add all aliases here
list['calculator'] = 'calc';
list['rules'] = 'rule';
list['tournament'] = 'tour';
list['typechart'] = 'chart';
list['weakness'] = 'weak';

// Function for checking if the submitted command is an alias
function checkAlias(alias){
	if(!list[alias]) return alias;
	else return list[alias];
}