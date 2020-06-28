import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'react-materialize';

import ProfileCard from './ProfileCard';
import Navigation from './Navigation';

///section css
import componentCSS from './SideBar.scss'

class SideBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="side-bar full-height">

                <Row className="side-bar__profilecard">
                    <Col s={12}>
                <ProfileCard
                    userName= "testUser"
                    userProfilePicURL={"https://placekitten.com/g/250/250"}
                    actionStatusText={"some book requested"}
                />
                </Col>
                </Row>

                <Row className="side-bar__navigation full-height">
                
                    <Col s={12}>
                    <Navigation />
                
                </Col>
                </Row>

            </div>
        );
    }
}

SideBar.defaultProps = {
    id: "SideBar"
};

SideBar.propTypes = {
    id: PropTypes.string,

};

export default SideBar;