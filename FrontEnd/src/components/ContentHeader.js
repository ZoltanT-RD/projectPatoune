import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { setSearchTerm } from '../reduxStore/slices/ui';

import getClassString from '../../../helpers/HTMLClassHelper';

import { Row, Col, Icon } from 'react-materialize';


///section css
import componentCSS from './ContentHeader.scss'

class ContentHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ///todo to be fair, SearchBar should be a separate component, but it's messy if not fully reduxed. coz' it's messing with this comp's classes =S
            showSearchBar: false,
            searchDelayInMiliSec: 250 //1000ms = 1s
        };

        this.searchInput = React.createRef();

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
        return this.state.showSearchBar ? getClassString(["title", "s8"]) : getClassString(["title", "s10"]);
    }

    getSearchWrapperClasses() {
        return this.state.showSearchBar ? getClassString("search-wrapper icons s3 open") : getClassString(["search-wrapper icons s1"]);     // I know this is confusing a bit, it's just to show that the function is ok with either Array/String or a mixture
    }

    render() {

        let timeout = null;

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

                        <input id="search-field" type="text" placeholder="Try searching 'Booze for free'" ref={this.searchInput} onKeyUp={(event)=>{
                            // Clear the timeout if it has already been set.
                            // This will prevent the previous task from executing
                            // if it has been less than <MILLISECONDS>
                            clearTimeout(timeout);

                            // Make a new timeout set to go off in 1000ms (1 second)
                            timeout = setTimeout(() => {
                                this.props.setSearchTerm(this.searchInput.current.value);
                            }, this.state.searchDelayInMiliSec);
                            }
                        }/>

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

const mapStoreToProps = store => ({
    searchTerm: store.ui.searchTerm
});

const mapDispatchToProps = dispatch => ({
    setSearchTerm: (newSearchTerm) => dispatch(setSearchTerm({ newSearchTerm: newSearchTerm }))
});

export default connect(mapStoreToProps, mapDispatchToProps)(ContentHeader);