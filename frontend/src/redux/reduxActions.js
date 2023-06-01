export function toggleNavOpen() {
	return {
		type: 'TOGGLE_NAV'
	};
}

export function toggleEditPanel(product) {
	return {
		type: 'TOGGLE_EDIT_PANEL',
		payload: {
			product
		}
	};
}

export function authLogin() {
	return {
		type: 'LOGIN'
	};
}

export function setRole(role) {
	return {
		type: 'SET_ROLE',
		payload: {
			role
		}
	};
}

export function setProducts(products) {
	return {
		type: 'SET_PRODUCTS',
		payload: {
			products
		}
	};
}

export function setAdminStats(stats) {
	return {
		type: 'SET_STATS',
		payload: {
			stats
		}
	};
}

export function setCart(cart) {
	return {
		type: 'SET_CART',
		payload: {
			cart
		}
	};
}

export function addToCart(product) {
	return {
		type: 'ADD_TO_CART',
		payload: {
			product
		}
	};
}

export function changeAmount(amount, id) {
	return {
		type: 'CHANGE_AMOUNT',
		payload: {
			amount,
			id
		}
	};
}

export function setQueries(queries) {
	return {
		type: 'SET_QUERIES',
		payload: {
			queries
		}
	};
}
