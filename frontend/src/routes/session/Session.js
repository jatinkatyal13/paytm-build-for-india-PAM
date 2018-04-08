
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import Pagination from 'react-bootstrap/lib/Pagination';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Well from 'react-bootstrap/lib/Well';

import {
	Tooltip,
	XAxis, YAxis, Line,
	CartesianGrid, LineChart, Bar, BarChart,
	ResponsiveContainer } from '../../vendor/recharts';

const title = 'Table';

class Session extends Component {

  constructor() {
    super()

    this.state = {
      graphs : []
    }

  }

  componentDidMount() {
    this.updateGraphs()
  }

  async updateGraphs() {
    await fetch('http://localhost:8000/sessionId/'+this.props.patientId, {
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseJson) => {
      console.log(responseJson)
      var data = []
      for (let y in responseJson){
        let x = responseJson[y]
        var temp = {
          text_emotion : JSON.parse(x.textual_emotional),
          face_emotion : JSON.parse(x.facial_emotional),
          text_sentiment : JSON.parse(x.textual_sentimental)
        }
        data.push(temp)
      }
      this.setState({ graphs : data })
      console.log(this.state.graphs)
		})
		// .catch((error) => {
    //   console.log(error)
		// })
  }

  render() {
    return (
      <div>
        <div className="col-lg-12">
          <PageHeader>Session for patient ID: { this.props.patientId } </PageHeader>
        </div>

        <div className="col-lg-12">
          <div>
            {
              this.state.graphs.map((data, i) => (
                <div className="row" key={i}>
                  <div className="col-lg-4">
                    <Panel
                      header={<span>
                        <i className="fa fa-bar-chart-o fa-fw" /> Textual Emotion Analysis
                      </span>}
                    >
                      <div>
                        <ResponsiveContainer width="100%" aspect={2}>
                          <BarChart 
                            data={ data.text_emotion } 
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar type="monotone" dataKey="amt" fill="#ffc658" isAnimationActive = {false}/>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
      
                    </Panel>
                  </div>
                  <div className="col-lg-4">
                    <Panel
                      header={<span>
                        <i className="fa fa-bar-chart-o fa-fw" /> Visual Emotional Analysis
                      </span>}
                    >
                      <div>
                        <ResponsiveContainer width="100%" aspect={2}>
                          <BarChart data={ data.face_emotion } margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar type="monotone" dataKey="amt" fill="#ffc658" isAnimationActive = {false}/>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Panel>
                  </div>
                  <div className="col-lg-4">
                    <Panel
                      header={<span>
                        <i className="fa fa-bar-chart-o fa-fw" /> Textual Sentimental Analysis
                      </span>}
                    >
                      <div>
                      <ResponsiveContainer width="100%" aspect={2}>
                        <LineChart data={ data.text_sentiment } margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <CartesianGrid stroke="#ccc" />
                          <Tooltip />
                          <Line type="monotone" dataKey="pos" stackId="1" stroke="#8884d8" fill="#8884d8" isAnimationActive = {false}/>
                          <Line type="monotone" dataKey="neg" stackId="1" stroke="#82ca9d" fill="#82ca9d" isAnimationActive = {false}/>
                        </LineChart>
                      </ResponsiveContainer>
                      </div>
      
                    </Panel>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

    );
  }
}

export default Session;
