import React from 'react';
import { Redirect } from 'react-router-dom';
import { ROLES } from '../../utils/data';

import { useSelector } from 'react-redux';

export function AuthRoute(props) {
	const userRole = useSelector(state => state.userRole);
	const Component = props.component;

	return userRole === 'loading' ? (
		<LoadingText />
	) : userRole ? (
		<Component />
	) : (
		<Redirect to={{ pathname: '/login' }} />
	);
}

export function UnauthRoute(props) {
	const userRole = useSelector(state => state.userRole);
	const Component = props.component;

	return userRole === 'loading' ? (
		<LoadingText />
	) : !userRole ? (
		<Component />
	) : (
		<Redirect to={{ pathname: '/' }} />
	);
}

export function AdminRoute(props) {
	const userRole = useSelector(state => state.userRole);
	const Component = props.component;

	return userRole === 'loading' ? (
		<LoadingText />
	) : userRole ? (
		userRole === ROLES.ADMIN || userRole === ROLES.MASTER ? (
			<Component />
		) : (
			<Redirect to={{ pathname: '/' }} />
		)
	) : (
		<Redirect to={{ pathname: '/login' }} />
	);
}

function LoadingText() {
	return <h1 className="absolute-center">Loading...</h1>;
}
