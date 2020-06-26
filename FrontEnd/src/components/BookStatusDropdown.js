import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DropdownCustom from './DropdownCustom';
import DropdownElement from '../objects/DropdownElement';

///section css
import componentCSS from './BookStatusDropdown.scss'

import BookStatus from '../../../enums/BookRequestStatus';


class BookStatusDropdown extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            elements: [
                new DropdownElement({ text: "Requested", isSelected: this.props.activeStatus === BookStatus.requested, classes: "requested", callbackFn: () => { console.log('call API to change status to "REQUESTED"') } }),
                new DropdownElement({ text: "Ordered", isSelected: this.props.activeStatus === BookStatus.ordered, classes: "ordered", callbackFn: () => { console.log('call API to change status to "ORDERED"') } }),
                new DropdownElement({ text: "Available", isSelected: this.props.activeStatus === BookStatus.available, classes: "available", callbackFn: () => { console.log('call API to change status to "AVAILABLE"') } }),
                new DropdownElement({ text: "Declined", isSelected: this.props.activeStatus === BookStatus.declined, classes: "declined", callbackFn: () => { console.log('call API to change status to "DECLINED') } }),

                new DropdownElement({ text: "Unconfirmed", isSelected: this.props.activeStatus === BookStatus.unconfirmed, classes: "unconfirmed", callbackFn: () => { console.log('call API to change status to "unconfirmed') } }),
                new DropdownElement({ text: "Missing", isSelected: this.props.activeStatus === BookStatus.missing, classes: "missing", callbackFn: () => { console.log('call API to change status to "missing') } }),
            ]
        };

        //this.fn = this.fn.bind(this);
    }

    render() {
        return (
            <div className={"book-status-dropdown"}>
                <DropdownCustom
                    id={this.props.id}
                    isReadOnly={this.props.isReadOnly}
                    elements={this.state.elements}
                />
            </div>
        );
    }
}

BookStatusDropdown.defaultProps = {
    isReadOnly: false
};

BookStatusDropdown.propTypes = {
    id: PropTypes.string.isRequired,
    isReadOnly : PropTypes.bool,
    activeStatus: PropTypes.oneOf(Object.values(BookStatus)).isRequired  //a "trick" to enforce enum values! ;)
};

export default BookStatusDropdown;