///section js
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import 'materialize-css';
import { Row, Col, CardPanel} from 'react-materialize';

///section css
import mainCSS from '../index.scss';

class MaterialTest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (

            <div className="materialTest">


                <Row>
                    <Col m={6} s={12}>
                        <CardPanel className="teal">
                            <span className="white-text">For a simpler card with less markup, try using a card panel which just has padding and a shadow effect</span>
                        </CardPanel>

                    </Col>
                </Row>

                </div>
        )
    }
}

MaterialTest.propTypes = {
    pageTitle: PropTypes.string //.isRequired,
};

export default MaterialTest;