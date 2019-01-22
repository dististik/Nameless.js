exports.getCurrentTime = function(){
	var xi = new Date(); var xv = "[";

	if(xi.getHours() < 10) xv += "0" + xi.getHours() + ":";
	else xv += xi.getHours() + ":";

	if(xi.getMinutes() < 10) xv += "0" + xi.getMinutes() + ":";
	else xv += xi.getMinutes() + ":";

	if(xi.getSeconds() < 10) xv += "0" + xi.getSeconds() + "]";
	else xv += xi.getSeconds() + "]";

	return xv;
}
exports.generateCode = function(){
	var alphaArray = ['A','B','C','D','E','F','G','H','J','K','M','P','Q','R','T','U','W','X','Y']; var genCode;
	var randno = Math.floor(Math.random() * alphaArray.length);

	genCode = alphaArray[randno]; genCode += Math.floor(Math.random() * 899) + 100;
	return genCode;
}