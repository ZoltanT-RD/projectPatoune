import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { Row, Col } from 'react-materialize';

///section css
import componentCSS from './Navigation.scss';

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            pages: [
                {
                    icon: 'book',
                    text: 'Library',
                    class: 'valign-wrapper active',
					isSelected: true,
					callbackFn: () => {this.switchSelected(this.state.pages[0].text);},
                },
                {
                    icon: 'settings',
                    text: 'Settings',
                    class: 'valign-wrapper',
					isSelected: false,
					callbackFn: () => {this.switchSelected(this.state.pages[1].text);},
                },
                {
                    icon: 'face',
                    text: 'Admin',
                    class: 'valign-wrapper',
					isSelected: false,
					callbackFn: () => {this.switchSelected(this.state.pages[2].text);},
                },
            ],

        };

        this.switchSelected = this.switchSelected.bind(this);
    }

    render() {
        return (
            <div className={'navigation'}>
                <Row>
                    <Col s={12}>
                        <ul className="mt0 mb0">
                            {this.state.pages.map((page) => (
                                <li key={uuidv4()} className={page.class} onClick={page.callbackFn}>
                                        <span className="material-icons md-18">{page.icon}</span>
                                        <span className="link-text">{page.text}</span>
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            </div>
        );
    }
    
    switchSelected(id) {
        this.setState(prevState => {
            let selectedNew = prevState.pages.find(e => e.text === id);
            let selectedCurrent = prevState.pages.find(e => e.isSelected === true);

            selectedCurrent.class = 'valign-wrapper';
            selectedCurrent.isSelected = false;

            selectedNew.class = 'valign-wrapper active';
            selectedNew.isSelected = true;          
        
            return [ selectedCurrent, selectedNew ];
            })
    }
}

///todo currently defaults to library as active automatically. may need to be fixed.
///todo classes could be handled better. cba.

export default Navigation;
