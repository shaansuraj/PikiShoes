import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthRoute, UnauthRoute, AdminRoute } from './authRoutes/ProtectedRoute';

import Homepage from './homePage/Homepage';
import AdminPage from './adminStatsPage/AdminPage';
import LoginPage from './loginPage/LoginPage';
import CheckoutPage from './checkoutPage/CheckoutPage';
import ProductDetails from './productDetailsPage/ProductPage';
import BecomeAdminPage from './adminStatsPage/BecomeAdminPage';

import { useDispatch, useSelector } from 'react-redux';
import { setRole, setCart } from '../redux/reduxActions';
import axiosApp from '../utils/axiosConfig';
import axios from 'axios';

function App() {
	const dispatch = useDispatch();
	const cart = useSelector(state => state.cart);
	const editPanelState = useSelector(state => state.editPanelState);

	useEffect(() => {
		const source = axios.CancelToken.source();

		async function checkStatus() {
			try {
				const result = await axiosApp.get('/auth/status', {
					cancelToken: source.token
				});

				dispatch(setRole(result.data.role));
			} catch (err) {
				dispatch(setRole(null));
			}
		}

		async function fetchCart() {
			try {
				const result = await axiosApp.get('/products/cart', {
					cancelToken: source.token
				});

				dispatch(setCart(result.data));
			} catch (err) {
				console.log(err);
			}
		}

		checkStatus();
		fetchCart();

		return () => {
			source.cancel();
		};
	}, []);

	useEffect(() => {
		const source = axios.CancelToken.source();

		async function updateCart() {
			try {
				await axiosApp.post(
					'/products/cart',
					{
						products: cart.map(item => {
							return {
								product: item.product._id,
								amount: item.amount
							};
						})
					},
					{
						cancelToken: source.token
					}
				);
			} catch (err) {
				console.log(err);
			}
		}

		if (cart !== 'loading') updateCart();

		return () => {
			source.cancel();
		};
	}, [cart]);

	useEffect(() => {
		const body = document.querySelector('body');

		if (editPanelState) {
			body.classList.add('no-overflow');
		} else {
			body.classList.remove('no-overflow');
		}
	}, [editPanelState]);

	return (
		<Router>
			<Switch>
				<UnauthRoute path="/login" component={LoginPage} />
				<AuthRoute exact path="/" component={Homepage} />
				<AuthRoute path="/cart" component={CheckoutPage} />
				<AdminRoute path="/dashboard" component={AdminPage} />
				<AuthRoute path="/product" component={ProductDetails} />
				<AuthRoute path="/become-admin" component={BecomeAdminPage} />
				<Route
					component={() => (
						<h1 className="absolute-center">
							Page not found: Error 404
						</h1>
					)}
				/>
			</Switch>
		</Router>
	);
}

export default App;
