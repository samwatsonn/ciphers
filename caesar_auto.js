
function decipher_caesar(ciphertext){
	highest_rating = Number.NEGATIVE_INFINITY;;
	highest_text = "";
	for(shift = 0; shift<26; shift++){
		solved = "";
		for(i = 0; i < ciphertext.length; i++){
			character = ciphertext.charAt(i);
			new_charcode = character.charCodeAt(0) - shift;
			if(new_charcode < "A".charCodeAt(0)){
				new_charcode += 26;
			}
			solved += String.fromCharCode(new_charcode);
		}
		if(fitness(solved) > highest_rating){
			highest_rating = english_fitness(solved);
			highest_text = solved;
		}
		plaintext = highest_text;
	}
	return plaintext;
}	