import React from 'react';
import ReactDOM from 'react-dom';


//css
import materializeCSS from '../../node_modules/materialize-css/dist/css/materialize.min.css';
import mainCSS from './index.scss';
import { Link } from 'react-router-dom';

///fixme this needed to be implemented properly
const content = (

    <div>
        <p>please log in first</p>
        <a href="/auth/googleAuth">LOGIN</a> {/*DON'T CHANGE THE LINK!*/}
    </div>

);

ReactDOM.render(
    content,
    document.getElementById("app")
);