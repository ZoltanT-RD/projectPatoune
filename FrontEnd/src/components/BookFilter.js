import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { connect } from 'react-redux';
import { bookFilterAdded, bookFilterRemoved } from '../reduxStore/slices/ui';

import { Row, Col } from 'react-materialize';
import CheckBoxCustom from './CheckBoxCustom';

import BookStatus from '../../../enums/BookRequestStatus';

///section css
import componentCSS from './BookFilter.scss';


class BookFilter extends React.Component {
    constructor(props) {
        super(props);

        this.updateState = this.updateState.bind(this);
        this.generateFilter = this.generateFilter.bind(this);
        this.loadFilters = this.loadFilters.bind(this);
    }

    loadFilters(){
        let filters = [];
        Object.keys(BookStatus).forEach(bs => {
                filters.push(this.generateFilter(bs, this.props.bookFilters.includes(bs)));
            });

        return filters;
    }

    generateFilter(id,isChecked){

        return (<CheckBoxCustom
            key={uuidv4()}
            id={id}
            label={id}
            value={id}
            disabled={false}
            onChange={
                () => {
                    this.updateState(id);
            }}
            checked={isChecked}
            ///fixme not sure what this was/wanted to be?
            className={"not-sure"}
        />);
    }

    updateState(id) {

        if (this.props.bookFilters.includes(id)){
            this.props.removeBookFilter(id);
        }
        else{
            this.props.addBookFilter(id);
        }
    }


    render() {
        return (
            <div className={'book-filter'}>
                <Row>
                    <Col s={12}>
                        <h6>Filter by</h6>
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <div className="filters">
                            <span>Status</span>
                            {this.loadFilters()}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

BookFilter.propTypes = {
    bookFilters: PropTypes.array,
    removeBookFilter: PropTypes.func,
    addBookFilter: PropTypes.func
};

const mapStoreToProps = store => ({
    bookFilters: store.ui.bookFilters
});

const mapDispatchToProps = dispatch => ({
    removeBookFilter: (id) => dispatch(bookFilterRemoved({ bookStatus: id })),
    addBookFilter: (id) => dispatch(bookFilterAdded({ bookStatus: id }))
})

export default connect(mapStoreToProps, mapDispatchToProps)(BookFilter)