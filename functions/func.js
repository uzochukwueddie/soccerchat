module.exports = {
	cutString: function(str, n){
//		if(typeof str.indexOf != 'undefined'){
            var cut = str.indexOf('', n);
            if(cut == -1) return str;
            return str.substring(0, cut);
//        }
	}
}