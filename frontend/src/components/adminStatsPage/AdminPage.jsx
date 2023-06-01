import React, { useEffect, useState } from 'react';
import BestsellersChart from './BestsellersChart';
import RecentSalesChart from './RecentSalesChart';
import GeneralStats from './GeneralStats';

import Navbar from '../reusable/Navbar';
import EditProductPanel from '../editProduct/EditProductPanel';
import axios from 'axios';
import axiosApp from '../../utils/axiosConfig';
import { useSelector, useDispatch } from 'react-redux';
import { setAdminStats } from '../../redux/reduxActions';

function AdminPage() {
	const dispatch = useDispatch();
	const stats = useSelector(state => state.adminStats);
	const [willUpdateCharts, setWillUpdateCharts] = useState(false);

	useEffect(() => {
		const source = axios.CancelToken.source();

		async function fetchStats() {
			try {
				const result = await axios.all([
					axiosApp.get('/admin/general-stats', {
						cancelToken: source.token
					}),
					axiosApp.get('/admin/bestsellers', {
						cancelToken: source.token
					}),
					axiosApp.get('/admin/sales-stats', { cancelToken: source.token })
				]);

				const data = {
					general: result[0].data,
					bestsellers: result[1].data,
					recentSales: result[2].data
				};

				if (JSON.stringify(stats) !== JSON.stringify(data))
					dispatch(setAdminStats(data));
			} catch (err) {
				console.log(err);
			}
		}

		fetchStats();

		return () => {
			source.cancel();
		};
	}, []);

	// ApexCharts are kinda weird so they have to be refreshed manually
	useEffect(() => {
		setWillUpdateCharts(true);
	}, [stats]);

	useEffect(() => {
		if (willUpdateCharts) setWillUpdateCharts(false);
	}, [willUpdateCharts]);

	return stats === 'loading' ? (
		<h1 className="absolute-center">Loading...</h1>
	) : (
		<>
			<Navbar />
			<EditProductPanel />
			{willUpdateCharts ? null : (
				<div className="admin-page-container">
					<BestsellersChart stats={stats.bestsellers} />
					<div className="admin-right-panel">
						<GeneralStats stats={stats.general} />
						<RecentSalesChart stats={stats.recentSales} />
					</div>
				</div>
			)}
		</>
	);
}

export default AdminPage;
