import axios from 'axios';
import { backend } from './endpoints';

export default axios.create({
	baseURL: backend,
	withCredentials: true
});
