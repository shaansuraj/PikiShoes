import { combineReducers } from 'redux';

function navOpenReducer(state = false, action) {
	switch (action.type) {
		case 'TOGGLE_NAV':
			return !state;
		default:
			return state;
	}
}

function editPanelReducer(state = false, action) {
	switch (action.type) {
		case 'TOGGLE_EDIT_PANEL':
			if (state) return false;
			if (action.payload && action.payload.product) {
				return action.payload.product;
			} else return 'new';

		default:
			return state;
	}
}

function userRoleReducer(state = 'loading', action) {
	switch (action.type) {
		case 'SET_ROLE':
			return action.payload.role;
		default:
			return state;
	}
}

function productsReducer(state = 'loading', action) {
	switch (action.type) {
		case 'SET_PRODUCTS':
			return action.payload.products;
		default:
			return state;
	}
}

function adminStatsReducer(state = 'loading', action) {
	switch (action.type) {
		case 'SET_STATS':
			return action.payload.stats;
		default:
			return state;
	}
}

function cartReducer(state = 'loading', action) {
	switch (action.type) {
		case 'SET_CART':
			return action.payload.cart;
		case 'ADD_TO_CART':
			if (state === 'loading') return state;

			if (state.some(item => item.product._id === action.payload.product._id))
				return state;

			return [...state, action.payload.product];
		case 'CHANGE_AMOUNT':
			if (state === 'loading') return state;

			let newCart = state.map(item => {
				if (action.payload.id !== item.product._id) return item;

				const amount = Number(action.payload.amount);
				item.amount = amount < 1 ? 1 : amount > 100 ? 100 : amount;
				return item;
			});
			return newCart;
		default:
			return state;
	}
}

function queriesReducer(state = {}, action) {
	switch (action.type) {
		case 'SET_QUERIES':
			return action.payload.queries;
		default:
			return state;
	}
}

export default combineReducers({
	isNavOpen: navOpenReducer,
	editPanelState: editPanelReducer,
	userRole: userRoleReducer,
	products: productsReducer,
	adminStats: adminStatsReducer,
	cart: cartReducer,
	queries: queriesReducer
});
