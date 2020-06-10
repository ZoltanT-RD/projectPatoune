import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from 'react-materialize';

import componentCSS from './CheckBoxCustom.scss';

class CheckBoxCustom extends React.Component {

  render() {
    return (
      
      <div class="check-box">
        <Checkbox
        filledIn
        id={this.props.id}
        label={this.props.label}
        value={this.props.value}
        disabled={(this.props.isDisabled) ? true : undefined}
        onChange={(this.props.onChange) ? this.props.onChange : undefined}
        checked={(this.props.checked) ? this.props.checked : undefined}
        />
      </div>
    );
  }

};


CheckBoxCustom.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func
};

export default CheckBoxCustom;
