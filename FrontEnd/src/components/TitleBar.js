import React, { Component } from 'react';
import PropTypes from 'prop-types';

///section css
import componentCSS from './TitleBar.scss'

class TitleBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="title-bar">
                {this.props.title}
            </div>
        );
    }
}

TitleBar.defaultProps = {
    id: "TitleBar"
};

TitleBar.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string.isRequired
};

export default TitleBar;