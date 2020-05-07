//js
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import componentCSS from './ServerError.scss';


import FourOFour from '../assets/img/server-404.jpg';

import FiveH1 from '../assets/img/server500-1.jpg';
import FiveH2 from '../assets/img/server500-2.jpg';
import FiveH3 from '../assets/img/server500-3.jpg';
import FiveH4 from '../assets/img/server500-4.jpg';
import FiveH5 from '../assets/img/server500-5.jpg';

import UnknownError1 from '../assets/img/server-unknown-1.jpg';
import UnknownError2 from '../assets/img/server-unknown-2.jpg';
import UnknownError3 from '../assets/img/server-unknown-3.jpg';


class ServerError extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fourOfour: [FourOFour],
            fiveHundred: [FiveH1,FiveH2,FiveH3,FiveH4,FiveH5],
            unknown: [UnknownError1,UnknownError2,UnknownError3]
        };
    }

    componentDidMount() {
    }

    getErrorImage(){
        switch (this.props.errorCode) {
            case 404:
                return this.pickImage(this.state.fourOfour);
            case 500:
                return this.pickImage(this.state.fiveHundred);
        
            default:
                return this.pickImage(this.state.unknown);
        }
    }

    pickImage(array){
        return array[Math.floor((Math.random()*array.length))];
    }

    render() {
        return (
            <div className="server-error">
                <img src={this.getErrorImage()} alt={"server error"} />
                {this.props.message && <p className="details">details: <code>{this.props.message}</code></p>}
            </div>
        )
    }
}

ServerError.propTypes = {
    errorCode: PropTypes.number.isRequired,
    message: PropTypes.string
};

export default ServerError;
