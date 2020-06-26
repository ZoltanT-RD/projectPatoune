import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Pagination, Icon } from 'react-materialize';

import BookCard from './BookCard';

import BookRequestStatus from '../../../enums/BookRequestStatus';

///section css
import componentCSS from './Content.scss'


import ApiHub from '../services/ApiHub';


class Content extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            maxItemPerPage: 6,

            bookCardsArray: [],
            totalResults: 0,
            activePaginationPage: 1,
        };

        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const fromItem = this.state.activePaginationPage === 1 ? 0 : (((this.state.activePaginationPage - 1) * this.state.maxItemPerPage) + 1);
            ApiHub.getLibraryPageData(fromItem, this.state.maxItemPerPage)
            .then((res) => {
                this.setState({
                    bookCardsArray: res.data.rows,
                    totalResults: res.data.total_rows
                });
            })
            .catch(err => {
                console.log(err);
               ///fixme this should probs redirect to Server 404? not sure
            });
    }

    render() {
        return (
            <div className={"content"}>
                <div className="book-card-wrapper">
                    {this.state.bookCardsArray.map(b => (
                        <BookCard key={b.id} bookID={b.id} bookTitle={b.value.title} bookAuthors={b.value.authors} bookStatus={b.value.status} />
                    ))}
                </div>
                <div className="page-selector">
                    {this.state.totalResults ?
                        <Pagination
                            activePage={this.state.activePaginationPage}
                            items={this.state.totalResults ? Math.ceil(this.state.totalResults / this.state.maxItemPerPage) : 0}
                            maxButtons={8}
                            leftBtn={<Icon>chevron_left</Icon>}
                            rightBtn={<Icon>chevron_right</Icon>}
                            onSelect={p => {this.setState({activePaginationPage: p},()=>{this.getData()})}}
                        />
                        : null
                    }
                </div>
            </div>
        );
    }
}

Content.defaultProps = {
    ///todo this really should be true
    isReadOnly: false
};

Content.propTypes = {
    id: PropTypes.string
};

export default Content;