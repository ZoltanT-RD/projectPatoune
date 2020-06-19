import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'react-materialize';

import ProfileCard from './ProfileCard';

///section css
import componentCSS from './SideBar.scss'

class SideBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="side-bar">

                <Row>
                    <Col s={3} style={{ backgroundColor: "red" }}></Col>
                <ProfileCard
                    userName= "testUser"
                    userProfilePicURL={"https://placekitten.com/g/250/250"}
                    actionStatusText={"some book requested"}
                />
                <div>
                    "Navigation" will come here, once it's implemented
                    {
                        ///todo <Navigation> will come here, once it's implemented
                    }
                </div>

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