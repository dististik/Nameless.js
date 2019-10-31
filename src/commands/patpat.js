// List of patpat responces
const responces = [
	"Bweh!",
	"W-Why are you doing this?",
	"H-Huh?! Can I help you with something..?",
	"Ehh?! Why do people have such a fixation with touching my head...",
	"T-Thank you, but this really isn't necessary.",
	"Don't you think this is a little embarrassing..?",
	"Why don't you just say hello to me like a normal person??",
	"Uwah!! Goodness, don't surprise me like that..!"
];

module.exports = {
	name: "patpat",
	description: "Pat Nameless' head.",
	execute(message,args){
		message.channel.send(responces[Math.floor(Math.random() * responces.length)]);
	}
}
