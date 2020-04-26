const $p = require('../../json/randpoke.json');

exports.randpoke = function(format,number){
	let $format = format;
	let $number = number;
	let randarray = [-1,-1,-1,-1,-1,-1];
	let namearray = [null,null,null,null,null,null];
	let $range = $p.randompokemon.length - 1;

	if($format == "cap"){
		let i = 0;
		while(i < $number){
			let gacha = Math.floor(Math.random() * $range);
			if(!randarray.includes(gacha) && !$p.randompokemon[gacha].uber){
				randarray[i] = gacha;
				namearray[i] = $p.randompokemon[gacha].name;
				i++; continue;
			} else continue;
		}
		let returnstring = `Your draw:`;
		for(xi=0;xi<$number;xi++){
			returnstring += `\n[${xi+1}] **${namearray[xi]}**`
		}
		return returnstring;
	}
	if($format == "nisemon"){
		let i = 0;
		while(i < $number){
			let gacha = Math.floor(Math.random() * $range);
			if(!randarray.includes(gacha) && !$p.randompokemon[gacha].exiled){
				randarray[i] = gacha;
				namearray[i] = $p.randompokemon[gacha].name;
				i++; continue;
			} else continue;
		}
		let returnstring = `Your draw:`;
		for(xi=0;xi<$number;xi++){
			returnstring += `\n[${xi+1}] **${namearray[xi]}**`
		}
		return returnstring;
	}
	if($format == "any"){
		let i = 0;
		while(i < $number){
			let gacha = Math.floor(Math.random() * $range);
			if(!randarray.includes(gacha) && !$p.randompokemon[gacha].exiled){
				randarray[i] = gacha;
				namearray[i] = $p.randompokemon[gacha].name;
				i++; continue;
			} else continue;
		}
		let returnstring = `Your draw:`;
		for(xi=0;xi<$number;xi++){
			returnstring += `\n[${xi+1}] **${namearray[xi]}**`
		}
		return returnstring;
	}
}

exports.validFormats = function(string){
	if(string == "cap"){return true;}
	if(string == "nisemon"){return true;}
	if(string == "any"){return true;}
	return false;
}

exports.validSize = function(size){
	if(size > 6){return true;}
	if(size < 1){return true;}
	if(isNaN(size)){return true;}
	return false;
}