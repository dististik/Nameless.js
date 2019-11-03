exports.randomCode = function generateCode(){
	var alphaArray = ['A','B','C','D','E','F','G','H','J','K','M','P','Q','R','T','U','W','X','Y']; var genCode;
	var randno = Math.floor(Math.random() * alphaArray.length);

	genCode = alphaArray[randno]; genCode += Math.floor(Math.random() * 899) + 100;
	return genCode;
}