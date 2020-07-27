import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Card, Icon } from 'react-materialize';
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

                        <Card
                            actions={[
                                <div key="top" className="valign-wrapper status-row"><Icon className="icon">hourglass_empty</Icon><span>{this.props.actionStatusText}</span></div>,
                                <div key="bottom" className="mb0 button-wrapper">
                                    <div className="profile-card__button-container"> <SiansButton Text={"Replace"} className={"primary"}></SiansButton> </div>
                                    <div className="profile-card__button-container"> <SiansButton Text={"Cancel"} className={"secondary"}></SiansButton> </div>
                                </div>
                            ]}
                            //className="blue-grey darken-1"
                            //textClassName="white-text"
                        >
                            <div className="valign-wrapper mb0">

                                    <img className="user-profile-pic" src={this.props.userProfilePicURL} />
                                    <p className="user-name">{this.props.userName}</p>

                            </div>
                        </Card>


            </div>
        );
    }
}

ProfileCard.defaultProps = {
    id: "ProfileCard",
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