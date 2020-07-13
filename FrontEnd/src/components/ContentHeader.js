import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Icon } from 'react-materialize';


///section css
import componentCSS from './ContentHeader.scss'

class ContentHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showSearchBar: false
        };

        this.showHide = this.showHide.bind(this);
        this.getTitleWrapperClasses = this.getTitleWrapperClasses.bind(this);
        this.getSearchWrapperClasses = this.getSearchWrapperClasses.bind(this);
    }

    showHide() {
        // this is the way to Correct State overwrite
        this.setState((state) => ({
            showSearchBar: !state.showSearchBar
        }));
    }

    getTitleWrapperClasses() {
        return this.state.showSearchBar ? "title s8" : "title s10";
    }

    getSearchWrapperClasses() {
        return this.state.showSearchBar ? "search-wrapper icons s3 open" : "search-wrapper icons s1";
    }

    render() {
        return (
            <div className="content-header">
                <Row>
                    <Col className={this.getTitleWrapperClasses()}>
                        {this.props.title}
                    </Col>

                    <Col className={this.getSearchWrapperClasses()}>
                        <span onClick={() => { this.showHide() }}>
                            <Icon>search</Icon>
                        </span>

                        <input id="search-field" type="text" placeholder="Try searching 'Booze for free'" />

                    </Col>

                    <Col s={1} className={"icons"}>
                        <span onClick={() => {this.props.toggleFilterBar()}}>
                            <Icon>filter_list</Icon>
                        </span>
                    </Col>



                </Row>

            </div>
        );
    }
}

ContentHeader.defaultProps = {
    id: "ContentHeader"
};

ContentHeader.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    toggleFilterBar: PropTypes.func.isRequired

};

export default ContentHeader;