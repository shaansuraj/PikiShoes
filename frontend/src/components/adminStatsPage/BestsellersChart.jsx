import React, { useState } from 'react';
import Chart from 'react-apexcharts';

function BestsellersChart(props) {
	const [series, setSeries] = useState([
		{
			name: 'Times Sold',
			data: props.stats.map(item => item.timesSold)
		}
	]);
	const [options, setOptions] = useState({
		chart: {
			type: 'bar',
			toolbar: { show: false },
			height: '90%'
		},
		dataLabels: {
			enabled: true,
			textAnchor: 'start',
			formatter: function (val, opt) {
				return opt.w.globals.labels[opt.dataPointIndex];
			},
			background: {
				enabled: true,
				opacity: 0.5,
				borderWidth: 0
			},
			style: {
				colors: ['#499ffb']
			}
		},
		plotOptions: {
			bar: {
				horizontal: true,
				dataLabels: {
					position: 'bottom'
				}
			}
		},
		xaxis: {
			categories: props.stats.map(item => item.name)
		},
		yaxis: {
			labels: { show: false }
		},
		responsive: [
			{
				breakpoint: 1000,
				options: {
					chart: {
						height: '500px'
					}
				}
			}
		]
	});

	return (
		<div className="bestsellers-chart-container">
			<h1>Best-Sellers</h1>
			<Chart
				options={options}
				series={series}
				type="bar"
				height={options.chart.height}
			/>
		</div>
	);
}

export default BestsellersChart;
