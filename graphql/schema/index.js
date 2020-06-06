const {buildSchema} = require('graphql');

module.exports = buildSchema(`

	scalar JSON

	type User{
		_id: ID!
		email: String!
		password: String
		pastBooking: [Booking!]!
	}

	type Booking{
		_id: ID!
		totalTickets: Int!
		amount: Int!
		date: String!
		bookingDate: String!
		dish: String!
		transactionId: String
	}

	type Dish{
		_id: ID!
		name: String!
		price: Int!
		date: String!
		availableTokens: Int!
		booking: [Booking!]!
	}

	type Admin{
		_id: ID!
		username: String!
		password: String
	}

	type AuthData{
		userId: ID!
		token: String!
	}

	input UserInput{
		email: String!
		password: String

	}

	input BookingInput{
		totalTickets: Int!
		amount: Int!
		date: String!
		bookingDate: String!
		dish: String!
		transactionId: String
		price: Int!
	}

	input DishInput{
		name: String!
		price: Int!
		availableTokens: Int!
		date: String!
	}

	type RootQuery{
		login(email: String!, password: String!): AuthData
		loginAdmin(username: String!, password: String!): JSON
		fetchUserBooking: JSON
		fetchUpcommingMeal: JSON
		fetchAllBookings(date: String!): JSON
	}

	type RootMutation{
		createNewBooking(bookingInput: BookingInput): Booking
		createUser(userInput: UserInput): User
		createAdmin(username: String!, password: String!): Admin
		createDish(dishInput: DishInput): Dish
	}

	schema {
		query: RootQuery
		mutation: RootMutation
	}

`);