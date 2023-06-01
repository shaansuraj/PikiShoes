import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';

function RecentSalesChart(props) {
	const [series, setSeries] = useState([
		{
			data: props.stats.map(item => [
				Number(Object.keys(item)),
				item[Number(Object.keys(item))]
			])
		}
	]);
	const [options, setOptions] = useState({
		chart: {
			type: 'area',
			zoom: { enabled: false },
			toolbar: false
		},
		stroke: { curve: 'straight' },
		dataLabels: { enabled: false },
		labels: {},
		xaxis: {
			type: 'datetime',
			labels: {
				show: true,
				formatter: value => {
					return dayjs(value).format('MMM DD');
				},
				style: {
					cssClass: 'chart-label',
					fontFamily: 'Roboto, sans-serif'
				},
				rotate: 0
			},
			tickAmount: 4,
			tooltip: { enabled: false }
		},
		yaxis: {
			labels: {
				style: {
					cssClass: 'chart-lebal',
					fontFamily: 'Roboto, sans-serif'
				}
			}
		},
		tooltip: {
			y: {
				title: {
					formatter: (value, { dataPointIndex }) => {
						return 'Sales: ';
					}
				}
			},
			x: {
				show: true
			}
		}
	});

	return (
		<div className="recent-sales-container">
			<h1 className="admin-stats-title">Sales Last 30 Days</h1>
			<Chart options={options} series={series} height="90%" type="area" />
		</div>
	);
}

export default RecentSalesChart;
