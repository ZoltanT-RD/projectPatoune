import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'react-materialize';


import LibraryPage from '../pages/sub/Library';


///section css
import componentCSS from './PageContent.scss'
import BookFilter from './BookFilter';

class PageContent extends React.Component {

    constructor(props) {
        super(props);
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