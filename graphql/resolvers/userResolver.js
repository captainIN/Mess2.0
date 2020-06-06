const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const Admin = require('../../models/Admin');
const Booking = require('../../models/booking');
const Dish = require('../../models/dish');

module.exports = {
	
	createUser: async ({userInput}) => {
		try{
			const existingUser = await User.findOne({email: userInput.email});
			if(existingUser){
				throw new Error('User Exists Already!');
			}
			const hashedPassword = await bcrypt.hash(userInput.password, 12);
			const user = new User({
				email: userInput.email,
				password: hashedPassword
			});

			const result = await user.save();

			return {...result._doc, password:null};

		}catch(err){
			throw(err);
		}

	},
	login: async ({email, password})=>{
			const user = await User.findOne({email: email});
			if(!user){
				throw new Error("User Does Not Exists");
			}
			const isEqual = await bcrypt.compare(password, user.password);
			if(!isEqual){
				throw new Error("Password is Incorrect");
			}
			const token = jwt.sign({userId: user.id, email: user.email}, 'happynewyear2020');
			return {userId: user.id, token: token};

	},
	fetchUserBooking: async (args, req) => {
		if(!req.isAuth){
			throw new Error("Not Authorised to access this feature");
		}
		try{
			const pBooking = await User.find({_id:req.userId});
			const pastBooking = pBooking[0].pastBooking
			console.log(pastBooking)
			return Promise.all(pastBooking.map(async booking => {
				const book = await Booking.find({_id: booking})
				const DName = await Dish.find({_id: book[0].dish})
				return {
					_id: book[0]._id,
					totalTickets: book[0].totalTickets,
					amount: book[0].amount,
					date: book[0].date,
					bookingDate: book[0].bookingDate,
					dish: DName[0].name,
					transactionId: book[0].transactionId
				}

			}))
		}catch(err){
			throw(err);
		}

	},
	createAdmin: async (args) => {
		try{
			const existingUser = await Admin.findOne({username: args.username});
			if(existingUser){
				throw new Error('User Exists Already!');
			}
			const hashedPassword = await bcrypt.hash(args.password, 12);
			const admin = new Admin({
				username: args.username,
				password: hashedPassword
			});

			const result = await admin.save();

			return {...result._doc, password:null};

		}catch(err){
			throw(err);
		}

	},
	loginAdmin: async ({username, password})=>{
		const user = await Admin.findOne({username: username});
		if(!user){
			throw new Error("User Does Not Exists");
		}
		const isEqual = await bcrypt.compare(password, user.password);
		if(!isEqual){
			throw new Error("Password is Incorrect");
		}
		const token = jwt.sign({userId: user.id, username: user.username}, 'happynewyear2020');
		return {userId: user.id, token: token};

	},
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