import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'react-materialize';
import { Pagination, Icon } from 'react-materialize';

import { connect } from 'react-redux';
import { loadBooks, getBooksFilteredByStatus } from '../reduxStore/slices/books';
import { changeCurrentPageNumber } from '../reduxStore/slices/ui';

import BookCard from './BookCard';

import BookRequestStatus from '../../../enums/BookRequestStatus';

///section css
import componentCSS from './Content.scss'


class Content extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            maxItemPerPage: 12
        };

    }

    componentDidMount() {
        this.props.loadBooks();
    }

    render() {

        let requestObj = {
            allBooks: this.props.books.books,
            selectedFilters: this.props.selectedBookFilters,
            maxItemPerPage: this.state.maxItemPerPage,
            pageNumber: this.props.currentPage
        }

        const { pagedResults, totalResultsCount} = getBooksFilteredByStatus(requestObj);

        return (
            <div className={"content"}>

                {this.props.books.isLoading ?
                    <h1> sorry, I'm still loading stuff here ...</h1>
                    :
                    this.props.books.books.length == 0 ?
                        <h1> nothing to see here ...{
                            ///fixme this is  needs proper loading / empty state man ....
                        }</h1>
                        :
                        <Fragment>

                            <div className="book-card-wrapper">
                                <Row>
                                    {
                                        pagedResults.map(b => (
                                            <Col xl={3} l={4} m={6} s={12} key={b.id}>
                                                <BookCard bookID={b.id} bookTitle={b.value.title} bookAuthors={b.value.authors} bookStatus={b.value.status} />
                                            </Col>
                                        ))
                                    }

                                </Row>

                            </div>
                            <div className="page-selector">
                                {
                                    <Pagination
                                        activePage={this.props.currentPage}
                                        items={totalResultsCount ? Math.ceil(totalResultsCount / this.state.maxItemPerPage) : 0}
                                        maxButtons={8}
                                        leftBtn={<Icon>chevron_left</Icon>}
                                        rightBtn={<Icon>chevron_right</Icon>}
                                        onSelect={p => { this.props.changePageNumber(p) }}
                                    />
                                }
                            </div>
                        </Fragment>
                }
            </div>

        );
    }
}

const mapStoreToProps = store => ({
    selectedBookFilters: store.ui.bookFilters,
    books: store.books,
    currentPage: store.ui.currentPage
});

const mapDispatchToProps = dispatch => ({
    loadBooks: () => dispatch(loadBooks()),
    changePageNumber: (pageNo) => dispatch(changeCurrentPageNumber({ newPageNumber: pageNo }))
});

export default connect(mapStoreToProps, mapDispatchToProps)(Content);