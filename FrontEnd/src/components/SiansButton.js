import React, { Component } from 'react';
import PropTypes from 'prop-types';

import componentCSS from './SiansButton.scss';

class SiansButton extends Component {


    render() { 

    return ( <button onClick={() => this.props.onclick()} className={this.getButtonClass()}>{this.props.Text}</button> );
    };

    getButtonClass() {
        let classes = "sians-button btn btn-";
        classes+= (this.props.className);
        return classes;
    };
}

SiansButton.propTypes = {
    Text: PropTypes.string.isRequired
};

export default SiansButton;
