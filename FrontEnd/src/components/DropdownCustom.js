import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown } from 'react-materialize';

///section css
import componentCSS from './DropdownCustom.scss'

class DropdownCustom extends React.Component {

    render() {
        return (
            <div>

                

                <Dropdown
  id="Dropdown_6"
  options={{
    alignment: 'left',
    autoTrigger: true,
    closeOnClick: true,
    constrainWidth: true,
    container: null,
    coverTrigger: true,
    hover: false,
    inDuration: 150,
    onCloseEnd: null,
    onCloseStart: null,
    onOpenEnd: null,
    onOpenStart: null,
    outDuration: 250
  }}
  trigger={<Button node="button">Drop Me!</Button>}
>
  <a href="#">
    one
  </a>
  <a href="#">
    two
  </a>
  <Divider />
  <a href="#">
    three
  </a>
  <a href="#">
    <Icon>
      view_module
    </Icon>
    four
  </a>
  <a href="#">
    <Icon>
      cloud
    </Icon>
    {' '}five
  </a>
</Dropdown>
            </div>
        );
    }
}

DropdownCustom.propTypes = {

    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    isDisabled: PropTypes.bool,
    isPassword: PropTypes.bool,
    isEmail: PropTypes.bool,
    maxLength: PropTypes.number,
    isValidationOn: PropTypes.bool,
    validationSuccessMessage: PropTypes.string,
    validationErrorMessage: PropTypes.string,
    onChange: PropTypes.func

};

export default DropdownCustom;