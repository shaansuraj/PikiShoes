const mongoose = require('mongoose');

const orderedProductSchema = new mongoose.Schema(
	{
		product: { type: mongoose.Types.ObjectId, ref: 'Product' },
		amount: Number
	},
	{ _id: false }
);

const orderSchema = new mongoose.Schema(
	{
		products: [orderedProductSchema],
		buyerId: { type: mongoose.Types.ObjectId, ref: 'User' } // TODO: Change 'buyerId' to 'buyer'
	},
	{ timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
