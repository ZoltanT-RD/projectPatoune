///section js
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import 'materialize-css';
import { Row, Col} from 'react-materialize';

import TitleBar from '../components/TitleBar';
import SideBar from '../components/SideBar';
import PageContent from '../components/PageContent';

///section css
import mainCSS from '../index.scss';


///section objects + components

class homePage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            pageTitle: this.props.pageTitle ? this.props.pageTitle : "PP",
            testBox : ""
        };
    }

    componentDidMount() {
        document.title = this.state.pageTitle;  ///todo this will have to append the current navigationelement (try Redux?)
    }

    render(){
        return(
            <div className="homePage container page">
                <Row className="full-height">
                    <Col s={3} style={{ backgroundColor: "red" }} className="full-height"><SideBar/></Col>
                    <Col s={9} className="full-height">
                        <Row>
                            <Col style={{ backgroundColor: "lightgreen" }} s={12}><TitleBar title="Project Patoune"/></Col>
                        </Row>
                        <Row>
                            <Col style={{ backgroundColor: "blue" }} s={12}><PageContent /></Col>
                        </Row>
                    </Col>
                </Row>
            </div >

        )
    }
}

homePage.propTypes = {
    pageTitle: PropTypes.string //.isRequired,
};

export default homePage;