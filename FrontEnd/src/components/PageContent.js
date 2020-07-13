import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'react-materialize';

import ContentHeader from './ContentHeader';
import Content from './Content';


///section css
import componentCSS from './PageContent.scss'
import BookFilter from './BookFilter';

class PageContent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showFilterBar: false
        };

        this.showHide = this.showHide.bind(this);
        this.getContentWrapperClasses = this.getContentWrapperClasses.bind(this);
        this.getFilterBarClasses = this.getFilterBarClasses.bind(this);
    }

    showHide() {
        // this is the way to Correct State overwrite
        this.setState((state) => ({
            showFilterBar: !state.showFilterBar
        }));
    }

    getContentWrapperClasses() {
        return this.state.showFilterBar ? "content-wrapper s9" : "content-wrapper s12";
    }

    getFilterBarClasses() {
        return this.state.showFilterBar ? "filter-wrapper s3" : "filter-wrapper s3 collapsed";
    }

    render() {
        return (
            <div className="page-content">

                <Row>
                    {
                        ///fixme title is hardcoded here... think about trying Redux for global value sharing!
                    }
                    <Col s={12}> <ContentHeader title={"Library (hardcoded)"} toggleFilterBar={this.showHide} /></Col>
                </Row>
                <Row className={"slide-wrapper"}>
                    <Col className={this.getContentWrapperClasses()}><Content /></Col>
                    <Col className={this.getFilterBarClasses()}><BookFilter /></Col>
                </Row>
            </div>
        );
    }
}

PageContent.defaultProps = {
    id: "PageContent"
};

PageContent.propTypes = {
    id: PropTypes.string,

};

export default PageContent;