

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
	MenuItem,
	DropdownButton,
	Panel, PageHeader, ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';


import s from './Initiate.css';
import StatWidget from '../../components/Widget';
import Donut from '../../components/Donut';

import {
	Tooltip,
	XAxis, YAxis, Line,
	CartesianGrid, LineChart, Bar, BarChart,
	ResponsiveContainer } from '../../vendor/recharts';

import Chat from './Chat';

import Webcam from 'react-webcam';

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

class Initiate extends Component {

	constructor() {
		super()

		this.state = {
			running : false,
			forceEnd : false,

			// text emotion analysis
			text_emotion : [
				{ name: 'No Emotion', amt: 0 },
			],

			// text sentiment analysis
			text_sentiment : [

			],

			messages : []
		}

		this.recognition = new window.webkitSpeechRecognition()
		this.recognition.onstart = () => {
			// console.log("Start")
			this.setState({running: true})
		}
		this.recognition.onerror = () => {
			// console.log("Error Occured")
			this.setState({running: false})
		}
		this.recognition.onend = () => {
			// console.log("Ended")
			this.setState({running: false})
			if (!this.state.running && !this.state.forceEnd){
				this.setState({running: true})
				this.recognition.start()
			}
			if (this.state.forceEnd) this.setState({forceEnd: false})
		}
		this.recognition.onresult = (event) => {
			// event is a SpeechRecognitionEvent object.
			// It holds all the lines we have captured so far.
			// We only need the current one.
			var current = event.resultIndex;

			// Get a transcript of what was said.
			var transcript = event.results[current][0].transcript;

			this.getEmotionAndSentiment(transcript)

			this.setState((prev) => { messages : prev.messages.push({id: 0, message: transcript}) })

			// console.log(transcript)
			// this.getEmotion(noteContent).then((result) => console.log(result) )
			// this.setState((prevState) => { identifiedTextList: prevState.identifiedTextList.push(noteContent) })
		}

	}

	async getEmotionAndSentiment(content) {
		var formData = new FormData()
		formData.append("str", content)
		await fetch('http://localhost:8000/textAnalyze', {
			method: 'POST',
			body: formData
		}).then((response) => 
			response.json()
		).then((json) => {

			var emotions = json.emotion
			var sentiments = json.sentiment

			// setting the emotions
			let data = []
			for (let p in emotions){
				if (emotions.hasOwnProperty(p)){
					data.push({
						'name' : p,
						'amt' : emotions[p]
					})
				}
			}
			this.setState({ text_emotion : data })

			// setting the sentiments
			this.setState((prevState) => { text_sentiment : prevState.text_sentiment.push({
				name : 'Sentiment',
				pos : sentiments.pos,
				neg : sentiments.neg
			})})

			console.log(this.state.text_emotion)
			console.log(this.state.text_sentiment)

		}).catch((err) => {
			console.log(err)
		})
	}

	setWebcamRef = (webcam) => {
		this.webcam = webcam;
	}
	
	capture = () => {
		const imageSrc = this.webcam.getScreenshot();
		return imageSrc
	}

	renderWebCam(){
		return (
			<div>
				<Webcam
					playsInline={false}
					audio={false}
					height={135}
					ref={this.setWebcamRef}
					screenshotFormat="image/jpeg"
					width={150}
				/>
			</div>
		)
	}

	renderStartStopButton() {

		if (!this.state.running){
			return(
				<button 
					className="btn btn-success"
					onClick={ () => {
						this.recognition.start()
					}}	
				>
					Start
				</button>
			)
		} else {
			return (
				<button 
					className="btn btn-danger"
					onClick={ () => {
						if (!this.state.forceEnd){
							this.setState({forceEnd: true})
							// var emotionAverage = {}
							// this.state.emotionDataList.map((data, i) => {
							// 	data.map((data, i) => {
							// 		if (data.name in emotionAverage){
							// 			emotionAverage[data.name] = (emotionAverage[data.name] + data.value)/2
							// 		} else {
							// 			emotionAverage[data.name] = data.value
							// 		}
							// 	})
							// })
							// this.setState({emotionAverage: emotionAverage})
						}
						this.recognition.stop()
					}}	
				>
					Stop
				</button>
			)
		}
	}

	render(){
		return (
			<div>
				<div className="row">
					<div className="col-lg-12">
						<PageHeader>
							<span>Assitant</span>
							{ this.renderStartStopButton() }
						</PageHeader>
					</div>
				</div>
	
				<div className="row">
	
					<div className="col-lg-4">
						<Panel
							header={<span>
								<i className="fa fa-bar-chart-o fa-fw" /> Video Stream
								<div>
								</div>
							</span>}
						>
							<div>
								{ this.renderWebCam() }
							</div>
	
						</Panel>
						<Panel
							header={<span>
								<i className="fa fa-bar-chart-o fa-fw" /> Text Stream
								<div>
								</div>
							</span>}
						>
							<div>
								<Chat 
									messages = {this.state.messages}
								/>
							</div>
	
						</Panel>
					</div>
	
					<div className="col-lg-8">
						<div className="row">
							<div className="col-lg-6">
								<Panel
									header={<span>
										<i className="fa fa-bar-chart-o fa-fw" /> Textual Emotion Analysis
									</span>}
								>
									<div>
										<ResponsiveContainer width="100%" aspect={2}>
											<BarChart data={ this.state.text_emotion } margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
												<CartesianGrid stroke="#ccc" />
												<XAxis dataKey="name" />
												<YAxis />
												<Tooltip />
												<Bar type="monotone" dataKey="amt" fill="#ffc658" />
											</BarChart>
										</ResponsiveContainer>
									</div>
	
								</Panel>
							</div>
							<div className="col-lg-6">
								<Panel
									header={<span>
										<i className="fa fa-bar-chart-o fa-fw" /> Bar Chart Example
										<div className="pull-right">
											<DropdownButton title="Dropdown" bsSize="xs" pullRight id="dropdownButton2">
												<MenuItem eventKey="1">Action</MenuItem>
												<MenuItem eventKey="2">Another action</MenuItem>
												<MenuItem eventKey="3">Something else here</MenuItem>
												<MenuItem divider />
												<MenuItem eventKey="4">Separated link</MenuItem>
											</DropdownButton>
										</div>
									</span>}
								>
									<div>
										<ResponsiveContainer width="100%" aspect={2}>
											<BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
												<CartesianGrid stroke="#ccc" />
												<XAxis dataKey="name" />
												<YAxis />
												<Tooltip />
												<Bar dataKey="pv" stackId="1" fill="#8884d8" />
												<Bar dataKey="uv" stackId="1" fill="#82ca9d" />
												<Bar type="monotone" dataKey="amt" fill="#ffc658" />
											</BarChart>
										</ResponsiveContainer>
									</div>
								</Panel>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-12">
								<Panel
									header={<span>
										<i className="fa fa-bar-chart-o fa-fw" /> Area Chart Example
										<div className="pull-right">
											<DropdownButton title="Dropdown" bsSize="xs" pullRight id="dropdownButton1" >
												<MenuItem eventKey="1">Action</MenuItem>
												<MenuItem eventKey="2">Another action</MenuItem>
												<MenuItem eventKey="3">Something else here</MenuItem>
												<MenuItem divider />
												<MenuItem eventKey="4">Separated link</MenuItem>
											</DropdownButton>
										</div>
									</span>}
								>
									<div>
									<ResponsiveContainer width="100%" aspect={2}>
										<LineChart data={ this.state.text_sentiment } margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
											<XAxis dataKey="name" />
											<YAxis />
											<CartesianGrid stroke="#ccc" />
											<Tooltip />
											<Line type="monotone" dataKey="pos" stackId="1" stroke="#8884d8" fill="#8884d8" />
											<Line type="monotone" dataKey="neg" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
										</LineChart>
									</ResponsiveContainer>
									</div>
	
								</Panel>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(s)(Initiate);
