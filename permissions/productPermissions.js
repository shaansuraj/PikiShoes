const { ROLES } = require('../config/data');

function canEditOrDeleteProduct(product, user) {
	return (
		(!product.isDefault && user.role === ROLES.ADMIN) ||
		user.role === ROLES.MASTER
	);
}

module.exports = {
	canEditOrDeleteProduct
};
