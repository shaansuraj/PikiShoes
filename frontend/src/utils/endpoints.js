export const backend =
	process.env.NODE_ENV === 'production'
		? 'https://dope-kicks.xyz'
		: 'http://localhost:5000';
