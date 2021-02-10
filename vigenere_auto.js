

function decipher_vigenereKeyless(ciphertext){
	/*
	This automatic Vigenere cipher solver uses simmulated annealing
	*/
	
	alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	/* In order to find the best key, we need to work out the length of the key
	We can use the Index of Coincidence at different periods (key lengths) to generate a
	list of the most likely periods for the text */
	likely_periods = get_likely_periods(ciphertext);
	
	/* For efficieny, we choose to test only the top 3 if possible as in this competition 
	key lengths tend to be shorter */
	if(likely_periods.length>=3){
		n_attempts = 3;
	}else{
		n_attempts = likely_periods.length;
	}	
	
	// Defines overall best checks
	overall_rating = Number.NEGATIVE_INFINITY;
	overall_keyword = "";
	
	// Iterates 3 or less times
	for(attempt = 0; attempt < n_attempts; attempt++){
		
		// Keylength as current likely period
		key_length = likely_periods[attempt];

		// Generates random new parent keywords and gets its rating
		parent_keyword = alphabet.shuffle().slice(0,key_length); 
		parent_rating = english_fitness(vigenere_manual(ciphertext, parent_keyword)); 
		
		// Start of simmulated annealing
		STEP = 1;	
		for(TEMP = 20; TEMP >= 0; TEMP-=STEP){
			
			// Each temperature level hill climbs 1000 times, this amount can be change to tailor to time or accuracy
			for(count = 0; count < 1000; count++){
				
				// Defines child keyword
				child_keyword = parent_keyword
				
				// Randomly changes one character in child key
				new_char_index = getRandomInt(0,key_length-1);
				new_char = alphabet.charAt(getRandomInt(0, alphabet.length-1));
				child_keyword = parent_keyword.slice(0, new_char_index) + new_char + parent_keyword.slice(new_char_index+1, key_length);
				
				// Gets rating for new key
				child_rating = english_fitness(vigenere_manual(ciphertext, child_keyword));
				
				// Calcultes the difference in rating between the child and parent key
				var dF = child_rating - parent_rating;	
						
				// Always updates parent if child is better
				if(dF > 0){
					parent_rating = child_rating;
					parent_keyword = child_keyword;
				}
				
				// The hotter the temperature, the more likely the parent will be updated even if its better than child
				if(dF < 0){
					probability = Math.E ** (dF/TEMP);
					if(probability > Math.random()){
						parent_rating = child_rating;
						parent_keyword = child_keyword;
					}
				}
			}
		}
		
		// Compares the key from each cycle to the overall best key
		if(parent_rating > overall_rating){
			overall_rating = parent_rating;
			overall_keyword = parent_keyword;
		}
	}
	return [overall_rating, overall_keyword, vigenere_manual(ciphertext, overall_keyword)];
}

function get_likely_periods(text){
	/*
	This returns a list of likely periods, using the index of coincidence function and
	a variety of increasing max indexs to check.
	*/
	likely_periods = [];	
	for(i = 1; i < 6; i++){
		index_of_coincidence = (ioc(ciphertext,6*i))[0];
		if(likely_periods.indexOf(index_of_coincidence) < 0){
			likely_periods.push(index_of_coincidence);
		}	
	}
	return likely_periods
}

function vigenere_manual(text, keyword){
	solved = '';
	period = keyword.length;
	position_in_key=0;
	
	for(i = 0; i<text.length; i++){
		character = text.charAt(i);
		
		if(position_in_key == period){
			position_in_key = 0;
		}
		
		new_charcode = 65 + (character.charCodeAt(0) - (keyword.charAt(position_in_key)).charCodeAt(0));
		if(new_charcode < 65){
			new_charcode += 26;
		}

		new_letter = String.fromCharCode(new_charcode);
		solved += new_letter
		
		position_in_key++
	}
	return solved;
}