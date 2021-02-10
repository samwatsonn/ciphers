

function ioc(text, maxIoc=27){
	var iocList = {};
	for(var n=1; n<maxIoc; n++){
		var nList = "";
		for(int n2=0; n2<text.length; n2++){
			if(n2%n == 0){
				nList += text.charAt(n2);
			}
		}
		var iocValue = ioc_calc(nList);
		iocList[n] = iocValue; 
	}
	iocSorted = Object.keys(iocList).sort(function(a,b){return iocList[a]-iocList[b]});
	iocSorted = iocSorted.reverse();
	return iocSorted;

}