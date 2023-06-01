const router = require('express').Router();
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const { authUser, authAdmin } = require('../authMiddleware');
const { canEditOrDeleteProduct } = require('../permissions/productPermissions');
const { ROLES, CATEGORIES } = require('../config/data');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuid } = require('uuid');

router.get('/', async (req, res) => {
	const itemsPerPage = parseInt(req.query.itemsPerPage);
	const page = parseInt(req.query.page) || 1;

	const startIndex = (page - 1) * itemsPerPage;

	const result = {};

	// Filter by category or search query, or return everything if there are no queries
	const category = new RegExp(escapeRegex(req.query.category), 'gi');
	const query = new RegExp(escapeRegex(req.query.query), 'gi');
	const minPrice = req.query.minPrice || 0;
	const maxPrice = req.query.maxPrice || 1000000000;

	const dbQuery = {
		category: category,
		name: query,
		price: { $gte: minPrice, $lte: maxPrice }
	};

	result.results = await Product.find(dbQuery)
		.sort({ _id: -1 })
		.limit(itemsPerPage)
		.skip(startIndex)
		.exec();

	result.pages = Math.ceil((await Product.countDocuments(dbQuery)) / itemsPerPage);

	res.send(result);
});

router.post('/purchase', authUser, verifyProductsSyntax, async (req, res) => {
	const idempotencyKey = uuid();

	const products = req.body.products;
	const token = req.body.token;
	let dbProducts;

	try {
		dbProducts = await Product.find({
			_id: { $in: products.map(item => item.product) }
		});
		if (dbProducts.length !== products.length) return res.send(400);
	} catch (e) {
		return res.send(e);
	}

	let totalPrice = 0;
	products.forEach(item => {
		totalPrice +=
			dbProducts.find(product => product.id === item.product).price *
			item.amount;
	});

	stripe.customers
		.create({ email: token.email, source: token.id })
		.then(customer => {
			stripe.charges
				.create(
					{
						amount: totalPrice,
						currency: 'eur',
						customer: customer.id,
						description: dbProducts.length + ' products.'
					},
					{ idempotencyKey }
				)
				.then(() => {
					new Order({
						products: req.body.products,
						buyerId: req.user.id
					})
						.save()
						.then(() => res.send('Transaction successful.'))
						.catch(err => res.send(err));
				})
				.catch(err => res.send(err));
		})
		.catch(err => res.send(err));
});

router.post('/cart', authUser, verifyProductsSyntax, (req, res) => {
	User.findByIdAndUpdate(req.user.id, { cart: req.body.products })
		.then(() => res.send('Cart updated.'))
		.catch(e => res.send(e));
});

router.get('/cart', authUser, (req, res) => {
	User.findById(req.user.id)
		.populate('cart.product')
		.exec()
		.then(user => res.send(user.cart))
		.catch(e => res.send(e));
});

router.post('/new-product', authAdmin, (req, res) => {
	const newProduct = new Product({
		name: req.body.name,
		price: req.body.price,
		description: req.body.description || undefined,
		category: req.body.category || CATEGORIES.RUNNING,
		imagePath: req.body.imagePath,
		isDefault: Boolean(req.user.role === ROLES.MASTER && req.body.isDefault)
	});
	newProduct
		.save()
		.then(() => res.send('Product added!'))
		.catch(e => res.send(e));
});

router.patch(
	'/:productId',
	authAdmin,
	setProduct,
	authEditOrDeleteProduct,
	(req, res) => {
		const [name, price, description, category, imagePath, isDefault] = [
			req.body.name,
			req.body.price,
			req.body.description,
			req.body.category,
			req.body.imagePath,
			Boolean(req.user.role === ROLES.MASTER && req.body.isDefault)
		];
		if (!name || !price || !category) return res.sendStatus(400);

		Product.findByIdAndUpdate(req.product.id, {
			name,
			price,
			description,
			category,
			imagePath,
			isDefault
		})
			.then(() => res.send('Updated product.'))
			.catch(e => res.send(e));
	}
);

router.delete(
	'/:productId',
	authAdmin,
	setProduct,
	authEditOrDeleteProduct,
	async (req, res) => {
		const productId = req.product.id;

		// Remove product id from all previous orders containing it
		await Order.updateMany(
			{ 'products.product': productId },
			{ $pull: { products: { product: productId } } }
		);

		await User.updateMany(
			{ 'cart.product': productId },
			{ $pull: { cart: { product: productId } } }
		);

		// Remove product from database
		await Product.findByIdAndDelete(productId);

		res.send('Successfully deleted product.');
	}
);

router.get('/:productId', setProduct, async (req, res) => {
	res.send(req.product);
});

function setProduct(req, res, next) {
	Product.findById(req.params.productId)
		.then(product => {
			if (product == null) {
				return res.sendStatus(404);
			}
			req.product = product;
			next();
		})
		.catch(e => res.sendStatus(404));
}

// Determine of the authenticated user has authorization to edit or delete the product
function authEditOrDeleteProduct(req, res, next) {
	if (!canEditOrDeleteProduct(req.product, req.user)) return res.sendStatus(403);
	next();
}

// Protection against regex DDoS attacks
function escapeRegex(text) {
	if (text == null) text = '';
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function verifyProductsSyntax(req, res, next) {
	const products = req.body.products;
	if (
		products == null ||
		(products.length > 0 &&
			(!products[0].product ||
				typeof products[0].product !== 'string' ||
				!products[0].amount))
	)
		return res.sendStatus(400);

	next();
}

module.exports = router;
