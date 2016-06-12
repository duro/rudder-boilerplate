import React, { Component, PropTypes } from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import FormError from './FormError';

export default class RFBSInput extends Component {

  static propTypes = {
    field: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }

  render() {
    const { field, label } = this.props;
    const formGroupOptions = {};

    if (field.touched) {
      if (field.error) {
        formGroupOptions.validationState = 'error';
      } else {
        formGroupOptions.validationState = 'success';
      }
    }

    return (
      <FormGroup controlId={field.name} {...formGroupOptions}>
        <ControlLabel>{ label }</ControlLabel>
        <FormControl {...this.props} {...field} />
        <FormControl.Feedback />
        <FormError field={field} />
      </FormGroup>
    );
  }
}
