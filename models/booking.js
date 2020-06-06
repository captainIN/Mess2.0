const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = Schema({
	user_email:{
		type: String,
		required: true
	},
	totalTickets: {
		type: Number,
		required: true
	},
	amount: {
		type: Number,
		required: true
    },
    date: {
		type: Date,
		required: true
    },
    bookingDate: {
		type: Date,
		required: true
	},
    dish: {
        type: Schema.Types.ObjectId,
        ref:'Dish'
    },
    transactionId: {
		type: String
	}
});

module.exports = mongoose.model('Booking', bookingSchema);