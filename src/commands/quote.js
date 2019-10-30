const Quotes = require('../json/quotes.json');

// Function for sending a random quote so it doesn't have to be rewritten a trillion times
function randomQuote(message,quoteArray){
	// For more "accurate" randomness with just two responces
	if(quoteArray.length == 2){
		if(Math.random() > 0.5) { message.channel.send(quoteArray[0]); return; }
		else { message.channel.send(quoteArray[1]); return; }
	} else {
		message.channel.send(quoteArray[Math.floor(Math.random() * (quoteArray.length - 1))]);
		return;
	}
}

// Code to be executed for the !quote command
module.exports = {
	name: "quote",
	description: "Sends a specified quote.",
	execute(message,args){
		// Check if quote exists, if not let the user know
		if(!Quotes[args[0]]) { message.channel.send("This quote hasn't been registered."); return; }
		// Check if quote has random responces
		else if(!Quotes[args[0]].random){
			// If there are no random responces, send quote and return
			message.channel.send(Quotes[args[0]]);
			return;
		} // If there are random responces, check if they're conditional
		else if(!Quotes[args[0]].conditional || !Quote.[args[0]].conditional[0]){
			// If they aren't conditional, send a random responce
			randomQuote(message,Quotes[args[0]].options);
		} // If the random responces are conditional, check if the condition is the author's userid
		else if(Quotes[args[0]].conditional[1] == 'userid'){
			// Check if author's userid is included in the conditions for a specified responce
			let conditionalResponce = Quotes[args[0]].condition.indexOf(message.author.id);
			if(conditionalResponce == -1){
				// If the author's userid isn't included in the list of conditions, send a generic responce
				randomQuote(message,Quotes[args[0]].options[Quotes[args[0]].options.length - 1]);
			} else {
				// Otherwise, send specified responce
				randomQuote(message,Quotes[args[0]].options[conditionalResponce]);
			}
		}
	}
}