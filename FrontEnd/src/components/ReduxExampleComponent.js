import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StoreContext from '../contexts/storeContext';
import { bugAdded } from '../reduxStore/slices/test';


//import componentCSS from './ReduxExampleComponent.scss';


///info this component is a template for Comps. using Redux

class ReduxExampleComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

///redux testbox start
    componentDidMount() {
        const store = this.context;
        console.log(store);

        //subscribe to Store, to get updates
        this.unsubscribe = store.subscribe(() => {
            console.log(store.getState());
        });

        //dispatch actions to the Store
        store.dispatch(bugAdded({ description: "test from Tester comp." }));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
///redux testblock end

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
    id: PropTypes.string
};

ReduxExampleComponent.contextType = StoreContext;
export default ReduxExampleComponent;