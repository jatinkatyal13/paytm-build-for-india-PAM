
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import Pagination from 'react-bootstrap/lib/Pagination';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Well from 'react-bootstrap/lib/Well';

import { 
  Modal, 
  Form,
  FormGroup,
  FormControl,
  FormControlFeedback,
  ControlLabel,
  OverlayTrigger 
} from 'react-bootstrap'

import history from '../../core/history';

const title = 'Table';

class Patient extends Component {

  constructor(){
    super()

    this.state = {
      patients : [],

      showModal : false
    }

    this.updatePatients()
    
  }

  updatePatients() {
    fetch('http://localhost:8000/patients', {
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({ patients : responseJson })
		})
		.catch((error) => {
		})
  }

  handleClose() {
    this.setState({ showModal: false });
  }

  handleShow() {
    this.setState({ showModal: true });
  }

  renderAddPatientModal() {
    return(
      <div>
        <Modal show={this.state.showModal} onHide={ () => this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Add Patient</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
            <FormGroup controlId="formBasicText2">
              <ControlLabel>Text Input</ControlLabel>
              <FormControl
                type="text"
                placeholder="Enter Text"
                inputRef = { name => this.inputName = name }
              />
            </FormGroup>
            <Button onClick={() => {
              var formData = new FormData()
              formData.append("name", this.inputName.value)
              fetch('http://localhost:8000/patients', {
                method: 'POST',
                body: formData
              })
              .then((response) => response.json())
              .then((responseJson) => {
                console.log(responseJson)
                this.updatePatients()
                this.handleClose()
              })
              .catch((error) => {
              })
            }}>Submit</Button>
          </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.handleClose()}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }

  render() {
    return (
      <div>
        { this.renderAddPatientModal() }
        <div className="col-lg-12">
          <PageHeader>
            Patients
            <div className="pull-right">
              <button 
                className="btn btn-success"
                onClick={ () => this.handleShow() }>
                Add Patient
              </button>
            </div>
          </PageHeader>
        </div>

        <div className="col-lg-12">
          <div>
            <div className="dataTable_wrapper">
              <div
                id="dataTables-example_wrapper"
                className="dataTables_wrapper form-inline dt-bootstrap no-footer"
              >
                <div className="row">
                  <div className="col-sm-12">
                    <table
                      className="table table-striped table-bordered table-hover dataTable no-footer"
                      id="dataTables-example"
                      role="grid"
                      aria-describedby="dataTables-example_info"
                    >
                      <thead>
                        <tr role="row">
                          <th
                            className="sorting_asc"
                            tabIndex="0"
                            aria-controls="dataTables-example"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Rendering engine: activate to sort column descending"
                            aria-sort="ascending"
                            style={{ width: 265 }}
                          >
                          ID
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="dataTables-example"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Browser: activate to sort column ascending"
                            style={{ width: 321 }}
                          >
                          Name
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="dataTables-example"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Platform(s): activate to sort column ascending"
                            style={{ width: 299 }}
                          >
                          Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.patients.map((data, i) => (
                            <tr className="gradeA odd" role="row" key = {i}>
                              <td className="sorting_1">{ data.id }</td>
                              <td>{ data.name }</td>
                              <td>
                                <button 
                                  className="btn btn-success"
                                  onClick={ () => {
                                    history.push('/session/' + data.id)
                                  }}>
                                  View Sessions
                                </button>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Patient;
