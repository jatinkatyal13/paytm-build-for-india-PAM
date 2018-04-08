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

class Scheduling extends Component {

  constructor(){
    super()

    this.state = {
    }

    
  }

  render() {
    return (
      <div>
        <p>
          Hello 
        </p>
      </div>

    );
  }
}

export default Scheduling;
