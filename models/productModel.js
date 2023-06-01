const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: String,
	price: Number,
	category: String,
	imagePath: String,
	description: {
		type: String,
		default:
			"This item does not have a description. If you have Admin level clearence, you can edit this product by clicking on the Gear Icon, and give it a description (as long as it's not a default product)"
	},
	isDefault: { type: Boolean, default: false }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
