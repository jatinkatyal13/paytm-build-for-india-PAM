import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
	MenuItem,
	DropdownButton,
	Panel, PageHeader, ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';

import {
	ControlLabel,
	FormControl,
	FormGroup,
	Form } from 'react-bootstrap';

import s from './Initiate.css';
import StatWidget from '../../components/Widget';
import Donut from '../../components/Donut';

import {
	Tooltip,
	XAxis, YAxis, Line,
	CartesianGrid, LineChart, Bar, BarChart,
	ResponsiveContainer } from '../../vendor/recharts';

import Chat from './Chat';

import Webcam from 'react-user-media';

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
				{ name: 'No Emotion', pos: 0, neg: 0 },
			],

			// face emotion analysis
			face_emotion : [
				{ name: 'No Emotion', amt: 0 },
			],

			// patients
			patients : [],

			// selected patient
			selectedPatient: -1,

			//timer seconds
			seconds : 0,

			//timer minutes
			minutes : 0,

			messages : []
		}

		fetch('http://localhost:8000/patients', {
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({ patients : responseJson, selectedPatient: responseJson[0].id })
		})
		.catch((error) => {
		})

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

	componentDidMount() {
		setInterval(async () => {
			if (this.state.running){
				this.incTime()
				var base64 = this.capture()
				var formData = new FormData()
				formData.append('base64' , base64)
				await fetch('http://localhost:8000/imageAnalyze', {
					method: 'POST',
					body: formData
				})
				.then((response) => response.json())
				.then((responseJson) => {
					var emotions = responseJson.emotion

					var data = []
					for(var prop in emotions) {
						data.push({
							"name": prop,
							"amt": emotions[prop]
						})
					}

					this.setState({ face_emotion : data })
					// this.setState((prevState) => {{ faceEmotionDataList: prevState.faceEmotionDataList.push(data) }})
					// this.setState((prevState) => {{ faceEmotionData: prevState.faceEmotionData.push(responseJson[0].scores) }})
				})
				.catch((error) => {
				})
			}
		}, 1000)
	}

	incTime() {
		var s = this.state.seconds
		var m = this.state.minutes

		if (s < 59) {
			this.setState({ seconds : s+1 })
		} else {
			this.setState({ minutes : m+1, seconds : 0 })
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
			var response = json.response

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
			// this.setState({ text_sentiment : [...this.state.text_sentiment, temp]})
			var temp = [...this.state.text_sentiment, {
				name : 'Sentiment',
				pos : sentiments.pos,
				neg : sentiments.neg
			}]

			this.setState({ text_sentiment : temp })
			// this.setState({ text_sentiment : tempData })
			// this.setState((prevState) => {return { text_sentiment : prevState.text_sentiment.append(temp), text_emotion : data }})

			console.log(this.state.text_emotion)
			console.log(this.state.text_sentiment)

			//setting the message response
			this.setState((prev) => { messages : prev.messages.push({id: 1, message: response}) })

		}).catch((err) => {
			console.log(err)
		})
	}

	setWebcamRef = (webcam) => {
		this.webcam = webcam;
	}
	
	capture = () => {
		const imageSrc = this.webcam.captureScreenshot();
		console.log(imageSrc)
		return imageSrc
	}

	async reset() {

		// patient = Patient.objects.get(pk = int(req['patient_id'])),
		// textual_emotional = json.dumps(req['textual_emotional']),
		// textual_sentiment = json.dumps(req['textual_sentiment']),
		// facial_emotional = json.dumps(req['facial_emotional']),
		// textual_conversation = json.dumps(req['messages'])

		var data = {
			patient_id : this.state.selectedPatient,
			textual_emotional : this.state.text_emotion,
			textual_sentiment : this.state.text_sentiment,
			facial_emotional : this.state.face_emotion,
			messages : this.state.messages
		}

		console.log(data)

		await fetch('http://localhost:8000/session', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		})
		.then((response) => response.json())
		.then((json) => {
			console.log(json)
		})
		.catch((err) => console.log(err))

		this.setState({
			running : false,
			forceEnd : true,

			// text emotion analysis
			text_emotion : [
				{ name: 'No Emotion', amt: 0 },
			],

			// text sentiment analysis
			text_sentiment : [
				{ name: 'No Emotion', pos: 0, neg: 0 },
			],

			// face emotion analysis
			face_emotion : [
				{ name: 'No Emotion', amt: 0 },
			],

			//timer seconds
			seconds : 0,

			//timer minutes
			minutes : 0,

			messages : []
		})
	}

	renderWebCam(){
		return (
			<div>
				<Webcam
					audio={false}
					height={135}
					ref={this.setWebcamRef}
					captureFormat="image/jpeg"
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
					className="btn btn-warning"
					onClick={ () => {
						if (!this.state.forceEnd){
							this.setState({forceEnd: true})
						}
						this.recognition.stop()
					}}	
				>
					Pause
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
							<div className="row">
								<div className="col-lg-3">
									<span>Assitant</span>
								</div>
								<div className="col-lg-6">
									<FormGroup controlId="formControlsSelect">
										<ControlLabel><h4>Patient</h4></ControlLabel>
										<FormControl 
											componentClass="select" 
											placeholder="select"
											onChange={ (e) => {
												this.state.selectedPatient = e.target.value
											} }>
										{
											this.state.patients.map((data, i) => (
												<option value={ data.id }>{ data.name }</option>
											))
										}
										</FormControl>
									</FormGroup>
								</div>
								<div className="col-lg-3">
									<div className="pull-right">
										{ this.renderStartStopButton() }
										<button 
											className="btn btn-danger"
											onClick={ () => {
												if (!this.state.forceEnd){
													this.setState({forceEnd: true})
												}
												this.recognition.stop()
												this.reset()
											}}	
										>
											Stop
										</button>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="pull-right">
									<p>
										{ this.state.minutes } : { this.state.seconds }
									</p>
								</div>
							</div>
						</PageHeader>
					</div>
				</div>
	
				<div className="row">
	
					<div className="col-lg-3">
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
	
					<div className="col-lg-9">
						<div className="row">
							<div className="col-lg-6">
								<Panel
									header={<span>
										<i className="fa fa-bar-chart-o fa-fw" /> Textual Emotion Analysis
									</span>}
								>
									<div>
										<ResponsiveContainer width="100%" aspect={2}>
											<BarChart 
												data={ this.state.text_emotion } 
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
							<div className="col-lg-6">
								<Panel
									header={<span>
										<i className="fa fa-bar-chart-o fa-fw" /> Visual Emotional Analysis
									</span>}
								>
									<div>
										<ResponsiveContainer width="100%" aspect={2}>
											<BarChart data={ this.state.face_emotion } margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
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
						</div>
						<div className="row">
							<div className="col-lg-12">
								<Panel
									header={<span>
										<i className="fa fa-bar-chart-o fa-fw" /> Textual Sentimental Analysis
									</span>}
								>
									<div>
									<ResponsiveContainer width="100%" aspect={2}>
										<LineChart data={ this.state.text_sentiment } margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
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
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(s)(Initiate);
