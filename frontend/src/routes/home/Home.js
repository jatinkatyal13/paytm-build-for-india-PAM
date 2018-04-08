import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
	MenuItem,
	DropdownButton,
	Panel, PageHeader, ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';

import s from './Home.css';
import StatWidget from '../../components/Widget';
import Donut from '../../components/Donut';

const title = 'Psychology Assistive Module';

class Home extends Component {
	constructor() {
		super()

		this.state = {
			patient_count : 0,
			session_count : 0
		}
	}

	componentDidMount() {
		fetch('http://localhost:8000/basic', {
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({
				patient_count : responseJson.number_of_patients,
				session_count : responseJson.number_of_sessions
			})
		})
		.catch((error) => {
		})
	}

	render() {
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
							count={ this.state.patient_count }
							headerText="Number of Patients"
							footerText="View Details"
							linkTo="/patient"
						/>
					</div>
					<div className="col-lg-3 col-md-6">
						<StatWidget
							style="panel-green"
							icon="fa fa-tasks fa-5x"
							count={ this.state.session_count }
							headerText="Number of Sessions"
							footerText="View Details"
							linkTo="/patient"
						/>
					</div>
					<div className="col-lg-3 col-md-6">
						<StatWidget
							style="panel-yellow"
							icon="fa fa-shopping-cart fa-5x"
							count="00:00"
							headerText="Total Time in Sessions"
							footerText="View Details"
							linkTo="/"
						/>
					</div>
					<div className="col-lg-3 col-md-6">
						<StatWidget
							style="panel-red"
							icon="fa fa-support fa-5x"
							count="Active"
							headerText="Status"
							footerText="View Details"
							linkTo="/"
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(s)(Home);
