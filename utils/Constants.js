class Constants {

	constructor() {
		this.PORT = process.env.PORT || 3000;
		this.MONGODB_URI = process.env.MONGODB_URI;
	}
}

var constants = new Constants();

module.exports = constants;