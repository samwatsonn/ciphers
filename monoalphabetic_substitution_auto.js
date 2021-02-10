
function auto_monoalphabetic_subsitution(ciphertext){
	/*
	This implementation of a monoalphabetic substitution / patristocrat cipher uses a stochastic hill climbing approach.
	Each cycle, it starts from a new random permutation of the alphabet as its key and randomly swaps letters to try to
	improve. 
	*/
	
	// This is used to keep track of the highest scoring key
    maxkey = "";
    maxscore = -99999999999999;

	// Initial Conditions
    initial_parentkey = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	max_cycles = 4;
	
	// The hill climbing is random so it is performed 4 times to give a better chance of success
    for(cycle=0; cycle<max_cycles; cycle++){
		
		// This is used to keep track of the high scoring key for each cycle
        parentkey = initial_parentkey.shuffle();
        parentscore = english_fitness(manual_monoalphabetic(ciphertext,alphabet,parentkey));
		
		// Count is used to determine when the program reaches a local maxima. If there are no improvements within a 1000 tries, it finishes
        count = 0;
        while(count < 1000){
			
			// Swap two random letters in the key
            a = getRandomInt(0,25);
            b = getRandomInt(0,25);
            child = parentkey;
            child = child.split('');
            [child[a], child[b]] = [child[b], child[a]];
            child = child.join('');
			
			// Calculate the score of the child key by looking at the fitness of the ciphertext after being decrypted using the key
            childscore = english_fitness(manual_monoalphabetic(ciphertext,alphabet,child));
			
			// Count is reset as local maxima not reach and 
            if(childscore > parentscore){
                parentscore = childscore;
                parentkey = child;
                count = 0;
            }
            count ++;
        }
		
		// This compares the best key of the cycle with the best key overall
        if(parentscore > maxscore){
            maxscore = parentscore;
            maxkey = parentkey;
        }
    }
	
	// Returns an array containing the best key and score with the deciphered text
    return [maxkey, maxscore, manual_monoalphabetic(ciphertext,alphabet,maxkey)];
}

function manual_monoalphabetic(ciphertext,originalAlphabet,cipheredAlphabet){
	for(i=0;i<ciphertext.length;i++){
		letter = ciphertext.charAt(i);
		replacement = originalAlphabet.charAt(cipheredAlphabet.indexOf(letter))
		ciphertext = ciphertext.slice(0,i) + replacement + ciphertext.slice(i+1,ciphertext.length);
	}
	return ciphertext;
}