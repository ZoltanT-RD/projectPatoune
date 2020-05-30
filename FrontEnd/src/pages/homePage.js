///section js
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import 'materialize-css';
import { Row, Col } from 'react-materialize';

///section css
import mainCSS from '../index.scss';

///section svg


///section objects + components

import ApiHub from '../services/ApiHub';

class homePage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            pageTitle: this.props.pageTitle ? this.props.pageTitle : "CheckList Hub - Homepage",
            testBox : ""
        };
    }

    componentDidMount() {
        document.title = this.state.pageTitle;

    }

    render(){
        return(
            <div className="homePage container">
                <h1>Hi, welcome to Project Patoune!</h1>
                <p>currently available pages (none, but error pages work!):</p>
                <div className="collection">
                    <a href="#!">test</a>
                    <a href="#!">test</a>
                    <a href="#!">test</a>
                    <a href="#!">test</a>
                </div>
{
    ///todo this is here just to test the Mat.-framework
}
                <Row>
                    <Col className="teal white-text" s={1}>test 1 </Col>
                    <Col className="teal white-text" s={1}>test 2 </Col>
                </Row>

            </div>
        )
    }
}

homePage.propTypes = {
    pageTitle: PropTypes.string //.isRequired,
};

export default homePage;