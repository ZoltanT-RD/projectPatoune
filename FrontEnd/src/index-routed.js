import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

//redux
import configureStore from './reduxStore/configureStore';
import {Provider} from 'react-redux';

import NotFoundPage from './pages/notFoundPage';
import HomePage from './pages/homePage';

//css
import materializeCSS from '../../node_modules/materialize-css/dist/css/materialize.min.css';
import mainCSS from './index.scss';

///redux
const store = configureStore();

const home = () => { return (
    <Provider store={store}>
        <HomePage pageTitle={"Project Patoune - Homepage"} />
    </Provider>
    )}
const notFound = () => { return (<NotFoundPage pageTitle={"404 page"} />) }

const routing = (
    <Router>
            <Switch>
                <Route exact path="/" component={home} />
                {
                    //<Route path="/template/:id" render={(props) => <TeamplateDetailsPage route={props.match} /*idd={"465465"}*/ />} />}
                    //<Route path="/template" component={teamplateSummary} />
                }
                <Route component={notFound} />
            </Switch>
    </Router>
);



ReactDOM.render(
    routing,
    document.getElementById("app")
);

//use TODO TREE
///todo this is a todo
///idea this is an idea
///fixme this is broken...
///section this is a section separator