import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'react-materialize';

import ContentHeader from './ContentHeader';
import Content from './Content';

import getClassString from '../../../helpers/HTMLClassHelper';

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
    }

    showHide() {
        // this is the way to Correct State overwrite
        this.setState((state) => ({
            showFilterBar: !state.showFilterBar
        }));
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
                    <Col className={getClassString(["content-wrapper", this.state.showFilterBar ? "s9": "s12"])}><Content /></Col>
                    <Col className={getClassString(["filter-wrapper", "s3", this.state.showFilterBar ? "" : "collapsed"])}><BookFilter /></Col>
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