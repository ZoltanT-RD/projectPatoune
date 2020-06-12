import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DropdownCustom from './DropdownCustom';
import DropdownElement from '../objects/DropdownElement';


///section css
import componentCSS from './BookStatusDropdown.scss'


class BookStatusDropdown extends React.Component {

    constructor(props) {
        super(props);

        this.buildElements = this.buildElements.bind(this);
    }

    buildElements(){
        return [
            new DropdownElement({ text: "Requested", isSelected: true, classes: "requested", callbackFn: () => {console.log('call API to change status to "REQUESTED"')} }),
            new DropdownElement({ text: "Ordered", classes: "ordered", callbackFn: () => { console.log('call API to change status to "ORDERED"') } }),
            new DropdownElement({ text: "Available", classes: "available", callbackFn: () => { console.log('call API to change status to "AVAILABLE"') } }),
            new DropdownElement({ text: "Declined", classes: "declined", callbackFn: () => { console.log('call API to change status to "DECLINED') } }),
        ];
    }


    render() {
        return (
            <div className={"book-status-dropdown"}>
                <DropdownCustom
                    id={this.props.id}
                    isReadOnly={this.props.isReadOnly}
                    elements={this.buildElements()}
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
    isReadOnly : PropTypes.bool
};

export default BookStatusDropdown;