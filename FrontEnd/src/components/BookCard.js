import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BookStatusDropdown from './BookStatusDropdown';
import { Card, Preloader } from 'react-materialize';

import ApiHub from '../services/ApiHub';

///section css
import componentCSS from './BookCard.scss'
import missingCover from '../assets/img/whooo.jpg';

import BookStatus from '../../../enums/BookRequestStatus';


class BookCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            bookCover: <Preloader size="small" />
        };

        this.getBookCover = this.getBookCover.bind(this);

    }

    componentDidMount() {
        this.getBookCover();
    }

    getBookCover() {
        ApiHub.getBookCover(this.props.bookID)
            .then(res => {
                this.setState({ bookCover: <img src={res} /> });
            })
            .catch(err => {
                this.setState({ bookCover: <img src={missingCover} /> }); //for future me; the reason I'm serving the missing image localy is to account for the backend bookcover api being unavailable
            });
    }

    render() {
        return (
            <div className={"book-card"}>
                <Card
                    actions={
                        [<BookStatusDropdown
                            key="bookStatus"
                            id={`${this.props.bookID}-status`}
                            isReadOnly={this.props.isReadOnly}
                            activeStatus={this.props.bookStatus}
                        />]
                    }
                    header={this.state.bookCover}
                >
                    <div className="book-title">{this.props.bookTitle}</div>
                    <div className="author">{this.props.bookAuthors.join(', ')}</div>
                </Card>

            </div>
        );
    }
}

BookCard.defaultProps = {
    isReadOnly: false
};

BookCard.propTypes = {
    bookID: PropTypes.string.isRequired,
    bookTitle: PropTypes.string.isRequired,
    bookAuthors: PropTypes.array.isRequired,
    bookStatus: PropTypes.oneOf(Object.values(BookStatus)).isRequired,  //a "trick" to enforce enum values! ;)
    isReadOnly: PropTypes.bool
};

export default BookCard;