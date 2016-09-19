class Constants {

	constructor() {
		this.PORT = process.env.PORT || 8080;
		this.MONGODB_URI = process.env.MONGODB_URI;
	}
}

var constants = new Constants();

module.exports = constants;