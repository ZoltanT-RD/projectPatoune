///section js
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

///section css
import mainCSS from '../index.scss';

///section svg


///section objects + components


class homePage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            pageTitle: this.props.pageTitle ? this.props.pageTitle : "CheckList Hub - Homepage"
        };
    }

    componentDidMount() {
        document.title = this.state.pageTitle;
    }

    render(){
        return(
            <div>
                <h1>Hi, welcome to Project Patoune!</h1>
                <p>currently available pages (none, but error pages work!):</p>
                <div className="collection">
                    <a href="#!">test</a>
                    <a href="#!">test</a>
                    <a href="#!">test</a>
                    <a href="#!">test</a>
                </div>
            </div>
        )
    }
}

homePage.propTypes = {
    pageTitle: PropTypes.string //.isRequired,
};

export default homePage;