import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { Dropdown, Icon } from 'react-materialize';

///section css
import componentCSS from './DropdownCustom.scss'


class DropdownCustom extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.elements.find((e) => { return e.isSelected === true})
    };

    this.setSelected = this.setSelected.bind(this);
  }


  setSelected(element){
    this.state.selected.isSelected = false;
    element.isSelected = true;
    this.setState({
      selected: element
    });
  }

  render() {
    if(this.props.isReadOnly){
      return(
        <div className={"dropdown-custom"}>
          <span className={"selected valign-wrapper"}>{this.state.selected.text}</span>
        </div>
      )
    }

    return (
      <div className={"dropdown-custom"}>
        <Dropdown
          id={this.props.id}
          options={{
            alignment: 'left',
            autoTrigger: true,
            closeOnClick: true,
            constrainWidth: true,
            container: null,
            coverTrigger: false,
            hover: true,
            inDuration: 150,
            onCloseEnd: null,
            onCloseStart: null,
            onOpenEnd: null,
            onOpenStart: null,
            outDuration: 250
          }}
          trigger={<span className={"selected valign-wrapper " + this.state.selected.classes}><span>{this.state.selected.text}</span><Icon>arrow_drop_down</Icon></span>}
        >
          {this.props.elements.filter((e) => { return !e.isSelected }).map(e => <span key={uuidv4()} className={e.classes} onClick={() => { this.setSelected(e); e.callbackFn();}}>{e.text}</span>)
          }

        </Dropdown>
      </div>
    );
  }
}

DropdownCustom.defaultProps = {
  isDisabled: false
};

DropdownCustom.propTypes = {
  id: PropTypes.string.isRequired,
  isReadOnly: PropTypes.bool,
  elements: PropTypes.array.isRequired
};

export default DropdownCustom;