import React, { useState, useEffect } from 'react';
import Product from './Product';

import Navbar from '../reusable/Navbar';
import EditProductPanel from '../editProduct/EditProductPanel';
import axiosApp from '../../utils/axiosConfig';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setProducts, setQueries } from '../../redux/reduxActions';

function Homepage() {
	const dispatch = useDispatch();
	const products = useSelector(state => state.products);
	const userRole = useSelector(state => state.userRole);
	const editPanelState = useSelector(state => state.editPanelState);
	const queries = useSelector(state => state.queries);
	const totalPages = products.pages || null;

	const [query, setQuery] = useState(queries.query || '');
	const [minPrice, setMinPrice] = useState(queries.minPrice || '');
	const [maxPrice, setMaxPrice] = useState(queries.maxPrice || '');
	const [category, setCategory] = useState(queries.category || '');
	const [page, setPage] = useState(queries.page || 1);

	const [isLoading, setIsLoading] = useState(false);
	const [preventFirstRender, setPreventFirstRender] = useState(true);

	const pages = [];
	for (let i = 0; i < totalPages; i++) {
		pages.push(
			<li
				key={i}
				onClick={() => setPageFilter(i + 1)}
				className={page === i + 1 ? 'active-page' : ''}>
				<a>{i + 1}</a>
			</li>
		);
	}

	useEffect(() => {
		if (preventFirstRender) return;

		setPage(1);
	}, [category, minPrice, maxPrice]);

	useEffect(() => {
		if (products === 'loading') {
			setPreventFirstRender(false);
		} else if (preventFirstRender) {
			setPreventFirstRender(false);
			return;
		}
		if (editPanelState !== false) return;

		const source = axios.CancelToken.source();

		getProducts(source.token);

		return () => source.cancel();
	}, [editPanelState, page, category, minPrice, maxPrice]);

	useEffect(() => {
		dispatch(
			setQueries({
				query,
				minPrice,
				maxPrice: maxPrice || 0,
				category,
				page
			})
		);
	}, [query, minPrice, maxPrice, category, page]);

	async function getProducts(token) {
		setIsLoading(true);

		const itemsPerPage = 8;

		try {
			const result = await axiosApp.get(
				`/products/?itemsPerPage=${itemsPerPage}&query=${query}&minPrice=${minPrice}&maxPrice=${
					maxPrice || ''
				}&category=${category}&page=${page}`,
				{
					cancelToken: token
				}
			);

			dispatch(setProducts(result.data));
			setIsLoading(false);
		} catch (err) {
			console.log(err);
			if (!axios.isCancel(err)) {
				setIsLoading(false);
			} else console.log(err);
		}
	}

	function setPageFilter(value) {
		setPage(value > totalPages ? totalPages : value || 1);
	}

	return (
		<>
			<Navbar />
			<EditProductPanel />
			<div className="products-main-container">
				<form
					onSubmit={e => {
						e.preventDefault();
						setPage(1);
						getProducts(null);
					}}>
					<div className="search-filters">
						<div className="search">
							<input
								type="text"
								placeholder="Search"
								value={query}
								onChange={e => setQuery(e.target.value)}
							/>
							<button
								type="submit"
								className={
									'btn-primary' +
									(isLoading ? ' btn-primary-loading' : '')
								}>
								SEARCH
							</button>
						</div>
						<div className="filters">
							<span className="price-filters">
								<span>
									<p>From:</p>
									<input
										type="number"
										placeholder="$$$"
										value={minPrice / 100 || ''}
										onChange={e =>
											setMinPrice(
												e.target.value
													? e.target.value * 100
													: ''
											)
										}
									/>
								</span>
								<span>
									<p>To:</p>
									<input
										type="number"
										placeholder="$$$"
										value={maxPrice / 100 || ''}
										onChange={e =>
											setMaxPrice(
												e.target.value
													? e.target.value * 100
													: ''
											)
										}
									/>
								</span>
							</span>

							<select
								onChange={e => setCategory(e.target.value)}
								className="btn-category"
								value={category}>
								<option value="">All Categories</option>
								<option value="running">Running</option>
								<option value="lifestyle">Lifestyle</option>
								<option value="basketball">Basketball</option>
							</select>
						</div>
					</div>
				</form>
				<div className="products">
					{!isLoading ? null : <div className="loading-products"></div>}
					{products === 'loading' ? (
						<h1>Loading...</h1>
					) : products.results.length === 0 ? (
						<h1>No products</h1>
					) : (
						products.results.map(product => (
							<Product
								product={product}
								userRole={userRole}
								key={product._id}
							/>
						))
					)}
				</div>

				<div className="page-selection">
					<a className="prev-page" onClick={() => setPageFilter(page - 1)}>
						Previous
					</a>
					<div className="pages-container">
						<ul>{pages}</ul>
					</div>
					<a className="next-page" onClick={() => setPageFilter(page + 1)}>
						Next
					</a>
				</div>
				<p
					style={{
						color: '#999999',
						maxWidth: '80vw',
						margin: '2rem auto 1rem'
					}}>
					No copyright infringement intended. All images used belong to
					their respective owners. This is just a hobby project.
				</p>
			</div>
		</>
	);
}

export default Homepage;
