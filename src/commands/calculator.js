module.exports = {
	name: "calculator",
	description: "Sends a link to all relevent damage calculators.",
	aliases: ["calc"],
	execute(message,args){
		message.channel.send("Smogon's Damage Calculator: https://pokemonshowdown.com/damagecalc/");
	}
}
