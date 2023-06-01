import React, { useState } from 'react';
import LabeledInput from '../reusable/LabeledInput';
import GoogleLogo from '../../images/google-icon.svg';
import LoginBackground from '../../images/Nike Sneakers Background.jpg';
import { useDispatch } from 'react-redux';
import { setRole } from '../../redux/reduxActions';
import axiosApp from '../../utils/axiosConfig';
import axios from 'axios';
import { backend } from '../../utils/endpoints';
import { ROLES } from '../../utils/data';

function LoginPage() {
	const dispatch = useDispatch();

	const [isRegister, setIsRegister] = useState(true);
	const [btnLoading, setBtnLoading] = useState(false);
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	// const source = axios.CancelToken.source();

	async function login(e) {
		e.preventDefault();
		if (email.length === 0) {
			setErrorMessage('Please enter your email.');
			return;
		}
		if (password.length === 0) {
			setErrorMessage('Please enter your password.');
			return;
		}

		setBtnLoading(true);

		try {
			const data = {
				email,
				password
			};
			await axiosApp.post('/auth/login', data);
			const result = await axiosApp.get('/auth/status');

			window.location.reload();
		} catch (err) {
			setBtnLoading(false);
			if (err.response && err.response.status === 401) {
				setErrorMessage(err.response.data);
			} else {
				setErrorMessage('Something went wrong.');
			}
		}
	}

	async function register(e) {
		e.preventDefault();
		if (username.length === 0) {
			setErrorMessage('Please enter a username.');
			return;
		}
		if (email.length === 0) {
			setErrorMessage('Please enter a email.');
			return;
		}
		if (password.length === 0) {
			setErrorMessage('Please enter a password.');
			return;
		}

		setBtnLoading(true);

		try {
			const data = {
				username,
				email,
				password
			};
			await axiosApp.post('/auth/register', data);
			window.location.reload();
		} catch (err) {
			setBtnLoading(false);
			if (err.response && err.response.status === 403) {
				setErrorMessage(err.response.data);
			} else {
				setErrorMessage('Something went wrong.');
			}
			console.log(err);
		}
	}

	function toggleAuthType() {
		setUsername('');
		setEmail('');
		setPassword('');
		setErrorMessage('');
		setIsRegister(prev => !prev);
	}

	return (
		<>
			<div className="login-page-container">
				<div className="login-content-container">
					<h2 className="amazoon-logo">DOPE KICKS</h2>
					<h1>{isRegister ? 'CREATE AN ACCOUNT' : 'SIGN IN USING:'}</h1>
					<form onSubmit={isRegister ? register : login}>
						{isRegister ? (
							<>
								<LabeledInput
									label="Username"
									name="username"
									placeholder="Enter Username"
									value={username}
									onChange={e => setUsername(e.target.value)}
								/>
							</>
						) : null}
						<LabeledInput
							label="Email"
							name="email"
							placeholder="Enter Email"
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						<LabeledInput
							label="Password"
							name="password"
							placeholder="Enter Password"
							inputType="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<p className="login-error">{errorMessage}</p>

						<div className="sign-in-buttons">
							<button
								type="submit"
								className={
									'btn-primary' +
									(!btnLoading ? '' : ' btn-primary-loading')
								}>
								{isRegister ? 'REGISTER' : 'SIGN IN'}
							</button>
							<a onClick={toggleAuthType}>
								{isRegister ? 'Have an account?' : 'Create account'}
							</a>
						</div>
					</form>

					<div className="login-seperation">
						<span>OR</span>
					</div>

					<a href={`${backend}/auth/google`} className="google">
						<img alt="google-icon" src={GoogleLogo} />
						<span>Continue with Google</span>
					</a>
				</div>
			</div>
			<div className="image-tint"></div>
			<img className="hide-mobile login-background" src={LoginBackground} />
		</>
	);
}

export default LoginPage;
