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
	[1,4,2,1,2,1,2,0,2,1,1,1,1,2,1,2,1,1], //steel
	[2,2,2,2,2,2,1,4,2,2,2,1,2,2,0,1,4,2]  //fairy
];

for(i = 0; i < 18; i++){
	//console.log(test[2][i]);
	if(test[7][i] == 1){
		console.log("index " + i + ": resist");
	}
	if(test[7][i] == 4){
		console.log("index " + i + ": weak");
	}
	if(test[7][i] == 0){
		console.log("index " + i + ": immune");
	}
}

function getType(i){
	switch(i){
		case 0: return "Normal"; break;
		case 1: return "Fire"; break;
		case 2: return "Water"; break;
		case 3; return "Grass"; break;
		case 4; return "Electric"; break;
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
		case 17: return "Fairy" break;
		default: return false; break;
	}
}

/*
 * 0 = immune
 * 1 = resist
 * 2 = neutral
 * 4 = weak
 */