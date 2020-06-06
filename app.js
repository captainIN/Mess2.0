const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const isAuth = require('./middleware/is-auth');

const graphQlSchema = require('./graphql/schema/index.js');
const graphQlResolvers = require('./graphql/resolvers/index.js');

const app = express();

app.use(bodyParser.json());
app.use(isAuth);

app.use((req, res, next)=>{
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	if (req.method === 'OPTIONS'){
		return res.sendStatus(200);
	}
	next();
	
});

app.use('/graphql', graphqlHttp({
	schema: graphQlSchema,
	rootValue: graphQlResolvers,
	graphiql: true
}));

mongoose.set('useCreateIndex', true);

mongoose.connect(`mongodb+srv://captain:8gB30k5Xy1XlV1Br@cluster0-rky9w.mongodb.net/Mess2?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>{
	app.listen(process.env.PORT || 3002);
}).catch(err => {
	console.log(err);
});


// Coloudinary 
// Cloud name: dpit26bgi
// API Key: 579778883755183
// API Secret: 8nHRyjXD1rEfFycBPlax9MDCE4A
// Env Variable: cloudinary://579778883755183:8nHRyjXD1rEfFycBPlax9MDCE4A@dpit26bgi/