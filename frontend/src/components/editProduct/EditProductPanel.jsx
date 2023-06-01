import React, { useState, useEffect } from 'react';
import LabeledInput from '../reusable/LabeledInput';
import CloseIcon from '../../images/close_black-24px.svg';

import { useSelector, useDispatch } from 'react-redux';
import { toggleEditPanel, setCart } from '../../redux/reduxActions';
import axiosApp from '../../utils/axiosConfig';
import { ROLES, CATEGORIES } from '../../utils/data';

function EditProductPanel() {
	const editPanelState = useSelector(state => state.editPanelState);
	const userRole = useSelector(state => state.userRole);
	const dispatch = useDispatch();
	const isNewProduct = editPanelState === 'new';

	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');
	const [imagePath, setImagePath] = useState('');
	const [category, setCategory] = useState(CATEGORIES.RUNNING);
	const [isDefault, setIsDefault] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setName(editPanelState.name || '');
		setPrice(editPanelState.price || '');
		setDescription(editPanelState.description || '');
		setImagePath(editPanelState.imagePath || '');
		setCategory(editPanelState.category || '');
		setIsDefault(Boolean(editPanelState.isDefault));
	}, [editPanelState]);

	function setImgToDefault(e) {
		e.target.src = require('../../images/product-placeholder.jpg');
	}

	async function createProduct(e) {
		e.preventDefault();
		setIsLoading(true);

		try {
			const data = {
				name,
				price,
				description,
				imagePath,
				category,
				isDefault
			};
			await axiosApp.post('/products/new-product', data);
			dispatch(toggleEditPanel());
		} catch (err) {
			console.log(err);
			alert('There was an error.');
		}
		setIsLoading(false);
	}

	async function updateProduct(e) {
		e.preventDefault();
		setIsLoading(true);

		try {
			const data = {
				name,
				price,
				description,
				imagePath,
				category,
				isDefault
			};
			await axiosApp.patch(`/products/${editPanelState._id}`, data);

			dispatch(setCart((await axiosApp.get('/products/cart')).data));
			dispatch(toggleEditPanel());
		} catch (err) {
			console.log(err);
			alert('There was an error.');
		}
		setIsLoading(false);
	}

	async function deleteProduct() {
		try {
			await axiosApp.delete(`/products/${editPanelState._id}`);
			dispatch(setCart((await axiosApp.get('/products/cart')).data));
			dispatch(toggleEditPanel());
		} catch (e) {
			console.log(e);
			alert('There was an error.');
		}
	}

	return !editPanelState ? null : (
		<div
			id="edit-panel-background"
			className="edit-product-background"
			onClick={e => {
				if (e.target.id === 'edit-panel-background') {
					dispatch(toggleEditPanel());
				}
			}}>
			<div className="edit-product-container">
				{isNewProduct ? null : (
					<button onClick={deleteProduct} className="delete-product">
						Delete Product
					</button>
				)}
				<button
					className="exit-edit-product"
					onClick={() => dispatch(toggleEditPanel())}>
					<img alt="close" src={CloseIcon} />
				</button>
				<div className="edit-product-right-panel">
					<h1>{isNewProduct ? 'Add New Product' : 'Edit Product'}</h1>

					<form onSubmit={isNewProduct ? createProduct : updateProduct}>
						<div className="edit-product-flex-container">
							<div className="upload-image-container">
								<div className="upload-image">
									<img
										className="product-image-preview"
										src={imagePath || ''}
										alt="product"
										onError={setImgToDefault}
									/>
								</div>
								<label htmlFor="product-image">Product Image</label>
							</div>
							<div className="edit-product-right-panel">
								<LabeledInput
									label="Product Name"
									name="name"
									placeholder="Name of product"
									value={name}
									onChange={e => setName(e.target.value)}
									maxLength={32}
								/>
								<LabeledInput
									label="Price (in USD)"
									name="price"
									placeholder="Price of product"
									inputType="number"
									value={price / 100 || ''}
									onChange={e => setPrice(e.target.value * 100)}
								/>
								<LabeledInput
									label="Short Description"
									name="description"
									placeholder="Leave blank for default description"
									value={description}
									onChange={e => setDescription(e.target.value)}
								/>
								<LabeledInput
									label="Image URL Link"
									name="img-link"
									placeholder="Leave blank for default image"
									value={imagePath}
									onChange={e => setImagePath(e.target.value)}
								/>

								{userRole !== ROLES.MASTER ? null : (
									<div className="is-default">
										<input
											id="is-default"
											type="checkbox"
											checked={isDefault}
											onChange={() =>
												setIsDefault(prev => !prev)
											}></input>
										<label htmlFor="is-default">
											Is default
										</label>
									</div>
								)}

								<select
									onChange={e => setCategory(e.target.value)}
									className="btn-category"
									value={category}>
									<option value={CATEGORIES.RUNNING}>
										Running
									</option>
									<option value={CATEGORIES.LIFESTYLE}>
										Lifestyle
									</option>
									<option value={CATEGORIES.BASKETBALL}>
										Basketball
									</option>
								</select>
							</div>
						</div>

						<div className="product-edit-buttons">
							<button
								onClick={() => dispatch(toggleEditPanel())}
								className="btn-secondary">
								CANCEL
							</button>
							<button
								type="submit"
								className={
									'btn-primary' +
									(isLoading ? ' btn-primary-loading' : '')
								}>
								SAVE
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default EditProductPanel;
