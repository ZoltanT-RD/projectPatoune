///section js
import React from 'react';
import PropTypes from 'prop-types';

import ServerError from '../components/ServerError';


///section objects + components


class notFoundPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            pageTitle: this.props.pageTitle
        };
    }

    componentDidMount() {
        document.title = this.state.pageTitle;
    }

    render(){
        return(
            <div>
                <ServerError errorCode={404} message={"page not found"}/>
            </div>
        )
    }
}

notFoundPage.propTypes = {
    pageTitle: PropTypes.string.isRequired
};

export default notFoundPage;