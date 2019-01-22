// All requirements declared here
const { Client, Attachment, RichEmbed } = require('discord.js');
const client = new Client();
const { Promises } = require('util');
const typeChart = require('./weakness_chart.js');
const fs = require('fs');
const config = require('./config.json');
const reuse = require('./reusable.js');

// Commands class
module.exports = class Commands{
	// Find the current prefix and set it for use later
	constructor(prefix){
		this.prefix = prefix;
	}

	// Full command listing
	command($msg,$args){
		// Remove prefix from command
		$args[0] = $args[0].substr(this.prefix.length);
		// Commands without arguments
		if(!$args[1]){
			switch ($args[0]){
				// Actually helpful

				case 'hello': // Basic ping command
					$msg.channel.send("Hi! I'm Nameless!");
					break;
				case 'calc': // Links to relevant damage calculators
					$msg.channel.send("Smogon's Damage Calculator: https://pokemonshowdown.com/damagecalc/");
					break;
				case 'chart': // Sends image of current type chart
					let atch = new Attachment('attatchments/images/type_chart.png');
					$msg.channel.send(atch);
					break;
				case 'invite': // Sends invite link
					$msg.channel.send("Here's the permalink to join the server! https://discord.gg/kvWncZx");
					break;

				// Easter eggs

				case 'patpat': // Pat Nameless on the head
					switch (Math.floor(Math.random() * 7)){
						case 0:
							$msg.channel.send("Bweh!");
							break;
						case 1:
							$msg.channel.send("W-Why are you doing this?");
							break;
						case 2:
							$msg.channel.send("H-Huh?! Can I help you with something..?");
							break;
						case 3:
							$msg.channel.send("Ehh?! Why do people have such a fixation with touching my head...");
							break;
						case 4:
							$msg.channel.send("T-Thank you, but this really isn't necessary.");
							break;
						case 5:
							$msg.channel.send("Don't you think this is a little embarrassing..?");
							break;
						case 6:
							$msg.channel.send("Why don't you just say hello to me like a normal person??");
							break;
					}
					break;
			}
		}
		// Commands with arguments
		if($args[1]){
			switch ($args[0]){
				//Actually helpful commands

				// Easter eggs

				case 'quote':
					switch ($args[1]){
						case 'beyond':
							$msg.channel.send("PLUS ULTRA!");
							break;
						case 'magic':
							$msg.channel.send("A believing heart is your magic!");
							break;
						case 'jevil':
							if( Math.random() > 0.5 )
								$msg.channel.send("Chaos chaos!");
							else
								$msg.channel.send("I can do anything!");
							break;
						case 'one-two':
							$msg.channel.send("Get up on the Hydra's back!");
							break;
						case 'rapture':
							$msg.channel.send("Would you kindly...");
							break;
						case 'maria':
							$msg.channel.send("A corpse... should be left well alone.");
							break;
						case 'key':
							$msg.channel.send("Let your heart be your guiding key.");
							break;
						case 'sleep':
							$msg.channel.send("I dream of Mareep.");
							break;
						case 'nico':
							$msg.channel.send("にっこにっこにー");
							break;
					}
					break;
			}
		}
	}
}