import React, { useEffect, useState } from 'react';
import ProductButtons from '../homePage/ProductButtons';
import Navbar from '../reusable/Navbar';
import EditProductPanel from '../editProduct/EditProductPanel';
import axios from 'axios';
import axiosApp from '../../utils/axiosConfig';
import { useSelector } from 'react-redux';

function ProductPage() {
	let id = new URLSearchParams(window.location.search).get('id');
	const userRole = useSelector(state => state.userRole);

	const [product, setProduct] = useState('loading');

	useEffect(() => {
		const source = axios.CancelToken.source();

		async function fetchProduct() {
			try {
				const result = await axiosApp.get(`/products/${id}`, {
					cancelToken: source.token
				});

				console.log(result.data);
				setProduct(result.data);
			} catch (e) {
				console.log(e);
				if (e.response && e.response.status === 404) {
					setProduct('404');
				}
			}
		}

		fetchProduct();

		return () => {
			source.cancel();
		};
	}, []);

	return product === '404' ? (
		<h1 className="status-text">404: Not Found</h1>
	) : product === 'loading' ? (
		<h1 className="status-text">Loading...</h1>
	) : (
		<>
			<Navbar />
			<EditProductPanel />
			<div className="product-page-container">
				<div className="product-img-container">
					<img
						className="product-image"
						src={product.imagePath}
						alt="product"
						onError={e =>
							(e.target.src = require('../../images/product-placeholder.jpg'))
						}
					/>
				</div>
				<div className="product-details-container">
					<p className="product-page-name">{product.name}</p>
					<p className="product-page-price">
						{'$' + (Math.round(product.price) / 100).toFixed(2)}
					</p>
					<p className="product-page-category">
						Category:{' '}
						<span>
							{product.category.charAt(0).toUpperCase() +
								product.category.slice(1)}
						</span>
					</p>
					<p className="product-page-description">{product.description}</p>
					<ProductButtons userRole={userRole} product={product} />
				</div>
			</div>
		</>
	);
}

export default ProductPage;
