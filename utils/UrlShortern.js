class UrlShortern {
	
	constructor() {
		this.alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
		this.base = this.alphabet.length; // base is the length of the alphabet (58 in this case)
	}

	// utility function to convert base 10 integer to base 58 string
	encode(num){
  		var encoded = '';
  		while (num){
    		var remainder = num % this.base;
    		num = Math.floor(num / this.base);
    		encoded = this.alphabet[remainder].toString() + encoded;
  		}
  		return encoded;
	}

	// utility function to convert a base 58 string to base 10 integer
	decode(str){
  		var decoded = 0;
  		while (str){
	    	var index = this.alphabet.indexOf(str[0]);
	    	var power = str.length - 1;
	    	decoded += index * (Math.pow(this.base, power));
	    	str = str.substring(1);
	  	}
  		return decoded;
	}
}

var tinyurl = new UrlShortern();

module.exports = tinyurl;