import React from 'react';
import DeleteIcon from '../../images/delete-24px.svg';
import DefaultImage from '../../images/product-placeholder.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { setCart, changeAmount } from '../../redux/reduxActions';

function CartTableItem(props) {
	const dispatch = useDispatch();
	const cart = useSelector(state => state.cart);

	function removeItem() {
		dispatch(
			setCart(cart.filter(item => item.product._id !== props.product._id))
		);
	}

	function handleChange(e) {
		setAmount(e.target.value);
	}

	function increment() {
		setAmount(props.amount + 1);
	}

	function decrement() {
		setAmount(props.amount - 1);
	}

	function setAmount(amount) {
		dispatch(changeAmount(amount, props.product._id));
	}

	return (
		<tr>
			<td className="cart-delete">
				<img alt="delete" src={DeleteIcon} onClick={removeItem} />
			</td>
			<td className="cart-product-image">
				<img
					alt="product"
					src={props.product.imagePath}
					onError={e => (e.target.src = DefaultImage)}
				/>
			</td>
			<td className="cart-product-name">{props.product.name}</td>
			<td className="cart-product-price">
				{'$' + (Math.round(props.product.price) / 100).toFixed(2)}
			</td>
			<td className="cart-amount">
				<div>
					<button onClick={decrement}>-</button>
					<input
						type="number"
						placeholder="0"
						value={Number(props.amount)}
						onChange={handleChange}
					/>
					<button onClick={increment}>+</button>
				</div>
			</td>
			<td className="cart-product-total">
				{'$' +
					(Math.round(props.product.price * props.amount) / 100).toFixed(
						2
					)}
			</td>
		</tr>
	);
}

export default CartTableItem;
