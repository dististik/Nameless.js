module.exports = {
	name: "hello",
	description: "Say hello to me!",
	execute(message,args){
		message.channel.send("Hi! I'm Nameless!");
	}
}