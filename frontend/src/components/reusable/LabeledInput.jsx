import React from 'react';

function LabeledInput(props) {
	return (
		<div className="input-container">
			<label htmlFor={props.name}>{props.label}</label>
			<input
				name={props.name}
				id={props.name}
				value={props.value}
				onChange={props.onChange}
				type={
					props.inputType === 'password'
						? 'password'
						: props.inputType === 'number'
						? 'number'
						: 'text'
				}
				autoComplete="off"
				placeholder={props.placeholder}
				maxLength={props.maxLength || ''}></input>
		</div>
	);
}

export default LabeledInput;
