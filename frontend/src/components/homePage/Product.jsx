import React, { useState } from 'react';
import ProductButtons from './ProductButtons';
import { ROLES } from '../../utils/data';
import { Link } from 'react-router-dom';

function Product(props) {
	function setImgToDefault(e) {
		e.target.src = require('../../images/product-placeholder.jpg');
	}

	return (
		<div className="product">
			<Link to={'/product?id=' + props.product._id}>
				<div className="product-img-container">
					<img
						className="product-image"
						src={props.product.imagePath}
						onError={setImgToDefault}
						alt="product"
					/>
				</div>
				<p className="product-name">{props.product.name}</p>
				<p className="product-price">
					{'$' + (Math.round(props.product.price) / 100).toFixed(2)}
				</p>
			</Link>
			<ProductButtons userRole={props.userRole} product={props.product} />
		</div>
	);
}

export default Product;
