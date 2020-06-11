import React, { Component } from 'react';
import PropTypes from 'prop-types';

///section css
import componentCSS from './ToastCustom.scss'

import M from "materialize-css";

class ToastCustom extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};

        this.getOptions = this.getOptions.bind(this);
        this.getHtmlContent = this.getHtmlContent.bind(this);
    }

    getOptions(){
        let options= {
            classes: "toast-custom",
            completeCallback: this.props.completeCallbackFn ? this.props.completeCallbackFn : null,

            html: this.getHtmlContent()
        }

        if (this.props.displayLengthInSec){
            options["displayLength"] = this.props.displayLengthInSec * 1000;
        }

        if (this.props.inTransitionDurationInSec) {
            options["inDuration"] = this.props.inTransitionDurationInSec * 1000;
        }

        if (this.props.outTransitionDurationInSec) {
            options["outDuration"] = this.props.outTransitionDurationInSec * 1000;
        }

        return options;
    }

    getHtmlContent(){
        return this.props.message;    //this also could be HTML
    }

    render() {
        if(this.props.isTriggered){
            M.toast(this.getOptions());
        }
        return null;
    }
}

ToastCustom.defaultProps = {
    isTriggered: true
};

ToastCustom.propTypes = {
    id: PropTypes.string.isRequired,
    isTriggered: PropTypes.bool,    // pass in false, and the Toast won't trigger until it gets true!
    message: PropTypes.string.isRequired,
    displayLengthInSec: PropTypes.number, //default 4s (4000ms) Length in ms the Toast stays before dismissal.
    inTransitionDurationInSec: PropTypes.number, //default 0.3s (300ms) Transition in duration in milliseconds.
    outTransitionDurationInSec: PropTypes.number, //default 0.375s (375ms) Transition out duration in milliseconds.
    completeCallbackFn: PropTypes.func //default null Callback function called when toast is dismissed.
};

export default ToastCustom;