import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BookCard from './BookCard';

///section css
import componentCSS from './Content.scss'


class Content extends React.Component {

    constructor(props) {
        super(props);

        //this.buildElements = this.buildElements.bind(this);
    }

    render() {
        return (
            <div className={"content"}>
                <BookCard bookID={"book::aed6b7de-07e3-40c2-b8a3-432f19a6765a"} bookTitle={"test book title 1"} bookAuthors={["tester1"]} />
                <BookCard bookID={"book::63228030-0280-4c91-9a1a-b5a80e958cb7ZZZ"} bookTitle={"test book title 2"} bookAuthors={["tester1"]} isReadOnly={false}/>
                <BookCard bookID={"book::e8bcb2b4-097b-44c7-b860-cb68d6f6c005"} bookTitle={"test book title 3"} bookAuthors={["tester2"]} />
                <BookCard bookID={"book::bdbb2e85-268d-403f-98eb-ed1bf608e23f"} bookTitle={"test book title 4"} bookAuthors={["tester2"]} />
                <BookCard bookID={"book::f57038f4-d349-4370-8e4f-debec1e548cc"} bookTitle={"test book title 5"} bookAuthors={["tester1", "tester2"]} isReadOnly={false}/>
            </div>
        );
    }
}

Content.defaultProps = {
    isReadOnly: false
};

Content.propTypes = {
    id: PropTypes.string,
    isReadOnly: PropTypes.bool
};

export default Content;