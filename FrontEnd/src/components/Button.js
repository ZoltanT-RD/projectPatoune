import React, { Component } from 'react';

import componentCSS from './Button.scss';

class Button extends Component {


    render() { 

        console.log(this.props);

    return ( <button onClick={() => this.props.onclick()} className={this.buttonClass()}>{this.props.Text}</button> );
    };

    buttonClass() {
        let classes = "btn btn-";
        classes+= (this.props.Name);
        return classes;
    };
}

export default Button;