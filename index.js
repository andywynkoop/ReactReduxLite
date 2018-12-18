import React, { Component } from 'react-lite';

let store = null;

export class Provider extends Component {
  constructor(props) {
    super(props);
    store = props.store;
  }

  render() {
    const { Component } = this.props;
    return <Component />;
  }
}

class Connect extends Component {
  constructor(props) {
    super(props);
    const _store = store.getState();
    this.state = {
      store: _store
    }
    store.subscribe(this.setReduxState.bind(this));
  }

  setReduxState(nextState) {
    this.setState({ store: nextState });
  }

  render() {
    const newProps = this.props.newProps || {};
    const childProps = Object.assign({}, newProps, this.props);
    
    const { mstp, mdtp } = this.props;
    let readProps = {};
    if (mstp) readProps = mstp(this.state.store);
    let writeProps = {};
    if (mdtp) writeProps = mdtp(store.dispatch);
    
    const allProps = Object.assign({}, childProps, readProps, writeProps);
    
    delete allProps["childComp"];
    delete allProps["mstp"];
    delete allProps["mdtp"];
    delete allProps["Component"];
    delete allProps["newProps"];
    const { Component } = this.props;
    return <Component {...allProps} />;
  }
}

export const connect = (mstp, mdtp) => 
  Component => newProps => <Connect Component={Component} mstp={mstp} mdtp={mdtp} newProps={newProps} />;