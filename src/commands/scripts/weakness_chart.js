//all numbers and type affiliations here
var typeChart = [
	[2,2,2,2,2,2,4,2,2,2,2,2,2,0,2,2,2,2], //normal
	[2,1,4,1,2,1,2,2,4,2,2,1,4,2,2,2,1,1], //fire
	[2,1,1,4,4,1,2,2,2,2,2,2,2,2,2,2,1,2], //water
	[2,4,1,1,1,4,2,4,1,4,2,4,2,2,2,2,2,2], //grass
	[2,2,2,2,1,2,2,2,4,1,2,2,2,2,2,2,1,2], //electric
	[2,4,2,2,2,1,4,2,2,2,2,2,4,2,2,2,4,2], //ice
	[2,2,2,2,2,2,2,2,2,4,4,1,1,2,2,1,2,4], //fighting
	[2,2,2,1,2,2,1,1,4,2,4,1,2,2,2,2,2,1], //poison
	[2,2,4,4,0,4,2,1,2,2,2,2,1,2,2,2,2,2], //ground
	[2,2,2,1,4,4,1,2,0,2,2,1,4,2,2,2,2,2], //flying
	[2,2,2,2,2,2,1,2,2,2,1,4,2,4,2,4,2,2], //psychic
	[2,4,2,1,2,2,1,2,1,4,2,2,4,2,2,2,2,2], //bug
	[1,1,4,4,2,2,4,1,4,1,2,2,2,2,2,2,4,2], //rock
	[0,2,2,2,2,2,0,1,2,2,2,1,2,4,2,4,2,2], //ghost
	[2,1,1,1,1,4,2,2,2,2,2,2,2,2,4,2,2,4], //dragon
	[2,2,2,2,2,2,4,2,2,2,0,4,2,1,2,1,2,4], //dark
	[1,4,2,1,2,1,4,0,4,1,1,1,1,2,1,2,1,1], //steel
	[2,2,2,2,2,2,1,4,2,2,2,1,2,2,0,1,4,2]  //fairy
];
var blankArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var weaknessArray = [blankArray.slice(),blankArray.slice(),blankArray.slice()];
var weaknessArray2 = [blankArray.slice(),blankArray.slice(),blankArray.slice()];
var types2 = false; var test2 = 0; var doubleType = 0;

function getType(i){
	switch(i){
		case 0: return "Normal"; break;
		case 1: return "Fire"; break;
		case 2: return "Water"; break;
		case 3: return "Grass"; break;
		case 4: return "Electric"; break;
		case 5: return "Ice"; break;
		case 6: return "Fighting"; break;
		case 7: return "Poison"; break;
		case 8: return "Ground"; break;
		case 9: return "Flying"; break;
		case 10: return "Psychic"; break;
		case 11: return "Bug"; break;
		case 12: return "Rock"; break;
		case 13: return "Ghost"; break;
		case 14: return "Dragon"; break;
		case 15: return "Dark"; break;
		case 16: return "Steel"; break;
		case 17: return "Fairy"; break;
		default: return false; break;
	}
}

function getWeaknesses(e){
	var returnString; var checkTtl;

	for(i = 0; i<18; i++){
		var x = typeChart[e][i];
		if(x === 0) weaknessArray[2][i] = 1;
		if(x === 1) weaknessArray[1][i] = 1;
		if(x === 4) weaknessArray[0][i] = 1;
	}

	if(types2) { 
		weaknessArray2 = [weaknessArray[0].slice(),weaknessArray[1].slice(),weaknessArray[2].slice()];
		weaknessArray = [blankArray.slice(),blankArray.slice(),blankArray.slice()];
		types2 = false; return 57; 
	}

	var weakTtl = weaknessArray[0].reduce(add,0);
	var resistTtl = weaknessArray[1].reduce(add,0);
	var immuneTtl = weaknessArray[2].reduce(add,0);
	
	if((!types2) && weaknessArray2[0].reduce(add,0)){
		array1 = weaknessArray; array2 = weaknessArray2; doubleType = true;
		for(i = 0; i < 18; i++){
			if(array2[2][i] && (!array1[2][i])){ 
				if(array1[1][i]) { array1[1][i] = 0; resistTtl--; }
				else if(array1[0][i]) { array1[0][i] = 0; weakTtl--; }
				array1[2][i] = 1; immuneTtl++;  
			}
			if(array2[1][i]){
				if(array1[0][i]) { array1[0][i] = 0; weakTtl--; }
				else if(array1[1][i]) { array1[1][i]++; }
				else if(!array1[2][i]) { array1[1][i]++; resistTtl++; }
			}
			if(array2[0][i]){ 
				if(array1[1][i]) { array1[1][i] = 0; resistTtl--; }
				else if(array1[0][i]) { array1[0][i]++; }
				else if(!array1[2][i]) { array1[0][i]++; weakTtl++; }
			}
		}
	}

	returnString = "Weaknesses: ";
	if(!weakTtl) returnString += "None\n";
	else{
		checkTtl = weakTtl;
		for(i = 0; i<18; i++){
			if(weaknessArray[0][i] && (weakTtl == checkTtl)){
				if(!doubleType){ returnString += getType(i); weakTtl--; }
				else if(doubleType){
					if(weaknessArray[0][i] == 1){ returnString += getType(i); weakTtl--; }
					else { returnString += "**" + getType(i) + "**"; weakTtl--; }
				}
			}
			else if(weaknessArray[0][i] && (weakTtl != checkTtl)){
				if(!doubleType){ returnString += ", " + getType(i); weakTtl--; }
				else if(doubleType){
					if(weaknessArray[0][i] == 1){ returnString += ", " + getType(i); weakTtl--; }
					else { returnString += ", **" + getType(i) + "**"; weakTtl--; }
				}
			}
			if(weakTtl == 0){
				returnString += "\n";
				weakTtl--;
			}
		}
	}
	
	returnString += "Resistances: ";
	if(!resistTtl) returnString += "None\n";
	else{
		checkTtl = resistTtl;
		for(i = 0; i<18; i++){
			if(weaknessArray[1][i] && (resistTtl == checkTtl)){
				if(!doubleType){ returnString += getType(i); resistTtl--; }
				else if(doubleType){ 
					if(weaknessArray[1][i] == 1){ returnString += getType(i); resistTtl--; }
					else { returnString += "**" + getType(i) + "**"; resistTtl--; }
				}
			}
			else if(weaknessArray[1][i] && (resistTtl != checkTtl)){
				if(!doubleType){ returnString += ", " + getType(i); resistTtl--; }
				else if(doubleType){
					if(weaknessArray[1][i] == 1){ returnString += ", " + getType(i); resistTtl--; }
					else { returnString += ", **" + getType(i) + "**"; resistTtl--; }
				}
			}
			if(resistTtl == 0){
				returnString += "\n";
				resistTtl--;
			}
		}
	}
	
	returnString += "Immunities: ";
	if(!immuneTtl) returnString += "None\n";
	else{
		checkTtl = immuneTtl;
		for(i = 0; i<18; i++){
			if(weaknessArray[2][i] && (immuneTtl == checkTtl)){
				returnString += getType(i);
				immuneTtl--;
			}
			else if(weaknessArray[2][i] && (immuneTtl != checkTtl)){
				returnString += ", " + getType(i);
				immuneTtl--;
			}
		}
	}

	weaknessArray = [blankArray.slice(),blankArray.slice(),blankArray.slice()];
	if(!types2) return returnString;
}

//actual function(s) here
exports.weakness = function(type){ //function for one type
	var typeNo;
	switch(type.toLowerCase()){
		case "normal": typeNo = 0; break;
		case "fire": typeNo = 1; break;
		case "water": typeNo = 2; break;
		case "grass": typeNo = 3; break;
		case "electric": typeNo = 4; break;
		case "ice": typeNo = 5; break;
		case "fighting": typeNo = 6; break;
		case "poison": typeNo = 7; break;
		case "ground": typeNo = 8; break;
		case "flying": typeNo = 9; break;
		case "psychic": typeNo = 10; break;
		case "bug": typeNo = 11; break;
		case "rock": typeNo = 12; break;
		case "ghost": typeNo = 13; break;
		case "dragon": typeNo = 14; break;
		case "dark": typeNo = 15; break;
		case "steel": typeNo = 16; break;
		case "fairy": typeNo = 17; break;
		default: typeNo = "string"; break;
	}

	if(isNaN(typeNo)) return "Invalid type or types.";
	else{
		var msg = "Here are the type advantages for " + getType(typeNo) + " without abilities.\n";
		msg += getWeaknesses(typeNo);	
		
		return msg; 
	}
}

exports.weakness2 = function(type1,type2){ //function for two types
	var typeNo1, typeNo2, typeArray = [type1,type2]; var typeNoArray = [typeNo1,typeNo2];
	for(i = 0; i < 2; i++){
		switch(typeArray[i].toLowerCase()){
			case "normal": typeNoArray[i] = 0; break;
			case "fire": typeNoArray[i] = 1; break;
			case "water": typeNoArray[i] = 2; break;
			case "grass": typeNoArray[i] = 3; break;
			case "electric": typeNoArray[i] = 4; break;
			case "ice": typeNoArray[i] = 5; break;
			case "fighting": typeNoArray[i] = 6; break;
			case "poison": typeNoArray[i] = 7; break;
			case "ground": typeNoArray[i] = 8; break;
			case "flying": typeNoArray[i] = 9; break;
			case "psychic": typeNoArray[i] = 10; break;
			case "bug": typeNoArray[i] = 11; break;
			case "rock": typeNoArray[i] = 12; break;
			case "ghost": typeNoArray[i] = 13; break;
			case "dragon": typeNoArray[i] = 14; break;
			case "dark": typeNoArray[i] = 15; break;
			case "steel": typeNoArray[i] = 16; break;
			case "fairy": typeNoArray[i] = 17; break;
			default: typeNoArray[i] = "string"; break;
		}
	}
	if(isNaN(typeNoArray[0]) || isNaN(typeNoArray[1])) return "Invalid type or types.";
	else{
		types2 = true;
		var msg = "Here are the type advantages for " + getType(typeNoArray[0]) + "/" + getType(typeNoArray[1]) + " without abilities.\n";
		getWeaknesses(typeNoArray[0]); msg += getWeaknesses(typeNoArray[1]); doubleType = 0; 
		weaknessArray2 = [blankArray.slice(),blankArray.slice(),blankArray.slice()];

		return msg;
	}
}

function add(a,b){
	return a + b;
}