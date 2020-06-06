const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dishSchema = Schema({
	name: {
		type: String,
		required: true
	},
	availableTokens: {
		type: Number,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	date:{
		type: Date,
		required: true
	},
	booking: [
		{
			type: Schema.Types.ObjectId,
			ref:'Booking'
		}
	],
});

module.exports = mongoose.model('Dish', dishSchema);