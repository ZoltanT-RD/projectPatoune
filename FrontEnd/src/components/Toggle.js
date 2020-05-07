import React, { Component } from 'react';
import PropTypes from 'prop-types';

///section css
import componentCSS from './Toggle.scss'

///todo this component needs to support a read-only state!

class Toggle extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="toggle">
                {this.props.topLabel && <p>{this.props.topLabel}</p>}
                <div className="switch">
                    <label>
                        {this.props.offLabel}
                        <input type="checkbox" disabled={this.props.isDisabled ? "disabled" : ""} />
                        <span className="lever"></span>
                        {this.props.onLabel}
                    </label>
                    {this.props.bottomLabel && <p>{this.props.bottomLabel}</p>}
                </div>
            </div>
        );
    }
}

Toggle.defaultProps = {

    offLabel: "off",
    onLabel: "on",
    topLabel: null,
    bottomLabel: null,
    isDisabled: false,

    onToggle: () => { console.warn("the toggle was toggled") }

};

Toggle.propTypes = {
    id: PropTypes.string.isRequired,
    offLabel: PropTypes.string,
    onLabel: PropTypes.string,
    topLabel: PropTypes.string,
    bottomLabel: PropTypes.string,
    isDisabled: PropTypes.bool,

    onToggle: PropTypes.func.isRequired
};

export default Toggle;