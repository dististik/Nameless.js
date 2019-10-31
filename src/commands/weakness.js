const typeChart = require('./scripts/weakness_chart.js');

module.exports = {
	name: "weakness",
	description: "Sends the type advantages for a type or pair of types.",
	aliases: ["weak"],
	execute(message,args){
		// Check if the user provided types to check
		if(args.length == 1){
			// Execute function for single type if only one provided
			message.channel.send( typeChart.weakness(args[0]) );
		} else if (args.length == 2){
			// Execute function for dual typing if two types provided
			message.channel.send( typeChart.weakness2(args[0],args[1]) );
		} else if (args.length > 2){
			// Return specified string if more than two types provided
			message.channel.send("I can't evaluate more than two types at once!");
		} else {
			// Return specified string if no types provided
			message.channel.send("Please specify a type or combined types for me to check the weaknesses of.");
		}
	}
}