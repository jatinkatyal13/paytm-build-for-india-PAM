

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
	MenuItem,
	DropdownButton,
	Panel, PageHeader, ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';


import s from './Home.css';
import StatWidget from '../../components/Widget';
import Donut from '../../components/Donut';

import {
	Tooltip,
	XAxis, YAxis, Area,
	CartesianGrid, AreaChart, Bar, BarChart,
	ResponsiveContainer } from '../../vendor/recharts';

const title = 'Psychology Assistive Module';


const data = [
			{ name: 'Page A', uv: 4000, pv: 2400, amt: 2400, value: 600 },
			{ name: 'Page B', uv: 3000, pv: 1398, amt: 2210, value: 300 },
			{ name: 'Page C', uv: 2000, pv: 9800, amt: 2290, value: 500 },
			{ name: 'Page D', uv: 2780, pv: 3908, amt: 2000, value: 400 },
			{ name: 'Page E', uv: 1890, pv: 4800, amt: 2181, value: 200 },
			{ name: 'Page F', uv: 2390, pv: 3800, amt: 2500, value: 700 },
			{ name: 'Page G', uv: 3490, pv: 4300, amt: 2100, value: 100 },
];

function Home(props, context) {
	context.setTitle(title);
	return (
		<div>
			<div className="row">
				<div className="col-lg-12">
					<PageHeader>Dashboard</PageHeader>
				</div>
			</div>

			<div className="row">
				<div className="col-lg-3 col-md-6">
					<StatWidget
						style="panel-primary"
						icon="fa fa-comments fa-5x"
						count="26"
						headerText="New Comments!"
						footerText="View Details"
						linkTo="/"
					/>
				</div>
				<div className="col-lg-3 col-md-6">
					<StatWidget
						style="panel-green"
						icon="fa fa-tasks fa-5x"
						count="12"
						headerText="New Tasks!"
						footerText="View Details"
						linkTo="/"
					/>
				</div>
				<div className="col-lg-3 col-md-6">
					<StatWidget
						style="panel-yellow"
						icon="fa fa-shopping-cart fa-5x"
						count="124"
						headerText="New Orders!"
						footerText="View Details"
						linkTo="/"
					/>
				</div>
				<div className="col-lg-3 col-md-6">
					<StatWidget
						style="panel-red"
						icon="fa fa-support fa-5x"
						count="13"
						headerText="Support Tickets!"
						footerText="View Details"
						linkTo="/"
					/>
				</div>
			</div>
		</div>
	);
}

Home.propTypes = {
	// news: PropTypes.arrayOf(PropTypes.shape({
	//   title: PropTypes.string.isRequired,
	//   link: PropTypes.string.isRequired,
	//   contentSnippet: PropTypes.string,
	// })).isRequired,
};
Home.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Home);
