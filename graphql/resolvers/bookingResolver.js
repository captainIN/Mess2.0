const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const Booking = require('../../models/booking');
const Dish = require('../../models/dish');

module.exports = {
	
	createNewBooking: async ({bookingInput},req) => {
		if(!req.isAuth){
			throw new Error("Not Authorised to access this feature");
		}
		try{
            const price = bookingInput.price;
            const amount = bookingInput.amount;
			const totalTickets = bookingInput.totalTickets;
			const {email} = await User.findById(req.userId)
            if(price*totalTickets !== amount){
                throw new Error("Calculation Incorrect!")
			}
			var {availableTokens} = await Dish.findById(bookingInput.dish)
			console.log(availableTokens)
			availableTokens = availableTokens - bookingInput.totalTickets
			console.log(availableTokens)
			if(availableTokens<0){
				throw new Error('Not enough tickets')
			}
			
			const booking = new Booking({
				user_email: email,
                totalTickets: bookingInput.totalTickets,
                amount: bookingInput.amount,
                date: bookingInput.date,
                bookingDate: bookingInput.bookingDate,
                dish: bookingInput.dish,
                transactionId: bookingInput.transactionId
			});

			const result = await booking.save();
			const booking_id = result._id
			const pBooking = await User.find({_id: req.userId})
			const pastBooking = pBooking[0].pastBooking
			const updated_user = await User.findOneAndUpdate({_id: req.userId}, {pastBooking: [...pastBooking, booking_id]}, {useFindAndModify: false});
			
			const updated_mealCount = await Dish.findOneAndUpdate({_id: bookingInput.dish}, {availableTokens: availableTokens}, {useFindAndModify: false});
			console.log(updated_mealCount)
			return {...result._doc};

		}catch(err){
			throw(err);
		}

	},
	createDish: async ({dishInput}) => {
		try{
            const price = dishInput.price;
            const availableTokens = dishInput.availableTokens;
			const name = dishInput.name;
			const date = dishInput.date;
			
			const dish = new Dish({
                availableTokens: availableTokens,
                name: name,
				price: price,
				date: date
			});

			const result = await dish.save();

			return {...result._doc};

		}catch(err){
			throw(err);
		}

	},
	fetchUpcommingMeal: async () => {
		try{
			const today_date = new Date()
			const result = await Dish.find({date: {$gt:today_date}})
			console.log(result)
			return {result}
		}catch(err){
			throw(err);
		}
	},
	fetchAllBookings: async (args, req) => {
		try{
			const date = args.date;
			const nextDate = new Date(date).setDate(new Date(date).getDate() + 1);
			const list = await Booking.find({date: {"$gte": new Date(date), "$lt": new Date(nextDate)}})
			console.log(list)
			return {list}
		}catch(err){
			throw(err);
		}
	}
	
	// fetchUserDetail: async (args, req) => {
	// 	try{
	// 		const userId = args.userId;
	// 		if(!userId){
	// 			throw new Error("URL cannot be empty");
	// 		}
	// 		const response = await User.findOne({_id: userId}).populate('createdPosts savedPost following followers');
	// 		console.log(response);
	// 		return {...response._doc, password: null};
	// 	}catch(err){
	// 		throw(err);
	// 	}

	// },
	// updateProfile: async (args, req) => {
	// 	if(!req.isAuth){
	// 		throw new Error("Not Authorised to access this feature");
	// 	}
	// 	try{
	// 		const userId = req.userId; //"5e0edd18845b912b244a1990";
	// 		const imageURL = args.imageUrl;

	// 		const user = await User.findOneAndUpdate({_id: userId}, {displayPicURL: imageURL}, {useFindAndModify: false});

	// 		return {...user._doc};
	// 	}catch(err){
	// 		throw(err);
	// 	}
	// },
	// searchUser: async ({searchValue}, req) => {
	// 	if(!req.isAuth){
	// 		throw new Error("Not Authorised to access this feature");
	// 	}
	// 	try{
	// 		const result = await User.find({displayName: new RegExp(searchValue, 'i')}, '_id displayName' );

	// 		return {...result};
	// 	}catch(err){
	// 		throw(err);
	// 	}
	// },
	

};