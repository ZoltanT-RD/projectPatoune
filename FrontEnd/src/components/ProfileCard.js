import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Card, Icon, Row, Col } from 'react-materialize';
import SiansButton from './SiansButton';

///section css
import componentCSS from './ProfileCard.scss'

class ProfileCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className={"profile-card"}>

                <Row>
                    <Col m={4} s={12}>
                        <Card
                            actions={[
                                <div className="valign-wrapper status-row"><Icon className="icon" small>hourglass_empty</Icon><span>{this.props.actionStatusText}</span></div>,
                                <Row className="mb0 button-wrapper">
                                    <Col s={6}> <SiansButton Text={"replace"}></SiansButton> </Col>
                                    <Col s={6}> <SiansButton Text={"cancel"}></SiansButton> </Col>
                                </Row>
                            ]}
                            //className="blue-grey darken-1"
                            //textClassName="white-text"
                        >
                            <Row className="valign-wrapper mb0">
                                <Col s={3}>
                                    <img className="user-profile-pic" src={this.props.userProfilePicURL} />
                                </Col>
                                <Col s={9}>
                                    <p className="user-name">{this.props.userName}</p>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

ProfileCard.defaultProps = {
    isDisabled: false
};

ProfileCard.propTypes = {
    id: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    userProfilePicURL: PropTypes.string.isRequired,
    actionStatusText: PropTypes.string
    ///todo this probs have to take in a "state" enum, to see if user's replacing a request, or adds a new, or whatever else
};

export default ProfileCard;