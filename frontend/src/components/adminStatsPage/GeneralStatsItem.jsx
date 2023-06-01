import React from 'react';

function GeneralStatsItem(props) {
	return (
		<li>
			<p className="general-stats-label">
				{props.label.split(' ')[0]}
				<br />
				{props.label.split(' ')[1] + ':'}
			</p>
			<p className="general-stats-count">{props.count}</p>
		</li>
	);
}

export default GeneralStatsItem;
