import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { testAction1, testAction2 } from '../reduxStore/slices/test';

//import componentCSS from './ReduxExampleComponent.scss';


///info this component is a template for Comps. using Redux

class ReduxExampleComponent extends React.Component {

    constructor(props) {
        super(props);

        this.dosomething = this.dosomething.bind(this);
    }

    dosomething(id){
        console.log(id);
    }

    render() {
        return (
            <div className="toggle">
                <h2>this is a test-comp. look at the console...</h2>
            </div>
        );
    }
}

ReduxExampleComponent.defaultProps = {
    id: "test"
};

ReduxExampleComponent.propTypes = {
    someStoreData: PropTypes.array,
    someTestAction1: PropTypes.func,
    someTestAction2: PropTypes.func
};

const mapStoreToProps = store => ({
    someStoreData: store.test.testArray
});

const mapDispatchToProps = dispatch => ({
    someTestAction1: (id) => dispatch(testAction1({ test: id })),
    someTestAction2: (id) => dispatch(testAction2({ test: id }))
})

export default connect(mapStoreToProps, mapDispatchToProps)(ReduxExampleComponent)