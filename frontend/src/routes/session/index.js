import React from 'react';
import Session from './Session';

export default {

  path: '/session/:patientId',

  action({ path, params, query }) {
    return <Session patientId={ params.patientId } />;
  },

};
