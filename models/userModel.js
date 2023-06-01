const mongoose = require('mongoose');
const { ROLES } = require('../config/data');

const cartSchema = new mongoose.Schema(
	{
		product: { type: mongoose.Types.ObjectId, ref: 'Product' },
		amount: Number
	},
	{ _id: false }
);

const userSchema = new mongoose.Schema({
	username: String,
	email: { type: String, required: true, unique: true },
	role: { type: String, default: ROLES.BASIC },
	cart: [cartSchema],
	password: String,
	googleId: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
