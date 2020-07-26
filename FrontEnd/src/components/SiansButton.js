import React, { Component } from 'react';
import PropTypes from 'prop-types';

import getClassString from '../../../helpers/HTMLClassHelper';

import componentCSS from './SiansButton.scss';

class SiansButton extends Component {


    render() {

        return (<button
            onClick={() => this.props.onclick()}
            className={getClassString(["sians-button btn", "btn-" + this.props.className])}>
            {this.props.Text}
        </button>);
    };

}

SiansButton.propTypes = {
    Text: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default SiansButton;
