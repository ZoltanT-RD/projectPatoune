import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TextInput } from 'react-materialize';

///section css
import componentCSS from './TextBox.scss'

class TextBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className={(this.props.isValidationOn) ? "text-box validate" : "text-box"}>

                <TextInput
                    id={this.props.id}
                    label={(this.props.label) ? this.props.label : undefined}
                    disabled={(this.props.isDisabled) ? true : undefined}
                    placeholder={(this.props.placeholder) ? this.props.placeholder : undefined}
                    password={(this.props.isPassword) ? this.props.isPassword : undefined}
                    email={(this.props.isEmail) ? this.props.isEmail : undefined}
                    data-length={(this.props.maxLength) ? this.props.maxLength : undefined}
                    validate={(this.props.isValidationOn) ? true : undefined}
                    error={(this.props.validationSuccessMessage) ? this.props.validationSuccessMessage : undefined}
                    success={(this.props.validationErrorMessage) ? this.props.validationErrorMessage : undefined}
                    onChange={(this.props.onChange) ? this.props.onChange : undefined}
                />
            </div>
        );
    }
}

TextBox.defaultProps = {
    isDisabled: false
};

TextBox.propTypes = {

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

export default TextBox;