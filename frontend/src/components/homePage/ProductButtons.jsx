import React, { useState } from 'react';
import SettingsIcon from '../../images/settings-24px.svg';
import { useDispatch, useSelector } from 'react-redux';
import { toggleEditPanel, addToCart } from '../../redux/reduxActions';
import { ROLES } from '../../utils/data';

function ProductButtons(props) {
	const dispatch = useDispatch();
	const cart = useSelector(state => state.cart);
	const isCartLoading = cart === 'loading';
	const canEdit =
		props.userRole === ROLES.MASTER ||
		(props.userRole === ROLES.ADMIN && !props.product.isDefault);
	const isAdmin =
		props.userRole === ROLES.ADMIN || props.userRole === ROLES.MASTER;
	const [isAdded, setIsAdded] = useState(
		isCartLoading
			? false
			: cart.some(item => item.product._id === props.product._id)
	);

	function openEditPanel() {
		dispatch(toggleEditPanel(props.product));
	}

	function addProduct() {
		const productData = {
			product: props.product,
			amount: 1
		};
		dispatch(addToCart(productData));
		setIsAdded(true);
	}

	return (
		<span className="product-buttons-container">
			<button
				onClick={() => (!isCartLoading && !isAdded ? addProduct() : null)}
				className={
					'btn-primary ' +
					(isCartLoading || isAdded ? ' btn-primary-loading' : '')
				}>
				{!isAdded ? 'ADD TO CART' : 'IN CART'}
			</button>
			{isAdmin ? (
				<button
					onClick={() => (canEdit ? openEditPanel() : null)}
					className={'btn-edit ' + (canEdit ? '' : ' not-editable')}>
					<img src={SettingsIcon} />
					{canEdit ? null : (
						<span className="not-editable-tooltip">
							You can't edit a default product.
						</span>
					)}
				</button>
			) : null}
		</span>
	);
}

export default ProductButtons;
