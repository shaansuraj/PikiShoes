import React from 'react';
import GeneralStatsItem from './GeneralStatsItem';

function GeneralStats(props) {
	return (
		<div className="general-stats-container">
			<h1 className="admin-stats-title">General Stats</h1>
			<ul>
				<GeneralStatsItem
					label="Total Users"
					count={props.stats.userCount}
				/>
				<GeneralStatsItem
					label="Total Products"
					count={props.stats.productCount}
				/>
				<GeneralStatsItem
					label="Total Sales"
					count={props.stats.saleCount}
				/>
			</ul>
		</div>
	);
}

export default GeneralStats;
