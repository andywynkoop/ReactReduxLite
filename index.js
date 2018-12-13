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
    this.state = {
      reduxProps: {},
      storeState: {}
    }
    this.getReduxProps = this.getReduxProps.bind(this);
  }
  
  componentDidMount() {
    store.subscribe(this.getReduxProps);
    this.getReduxProps(store.getState());
  }

  getReduxProps(nextState) {
    const { mstp, mdtp } = this.props;
    let readProps = {};
    if (mstp) readProps = mstp(nextState);
    let writeProps = {};
    if (mdtp) writeProps = mdtp(store.dispatch);
    const reduxProps = Object.assign({}, readProps, writeProps);
    this.setState({ reduxProps });
    return reduxProps;
  }

  render() {
    const newProps = this.props.newProps || {};
    const childProps = Object.assign({}, newProps, this.props);
    delete childProps["childComp"];
    delete childProps["mstp"];
    delete childProps["mdtp"];
    const reduxProps = this.state.reduxProps;
    const allProps = Object.assign({}, childProps, reduxProps);
    const { Component } = this.props;
    return <Component {...allProps} />;
  }
}

export const connect = (mstp, mdtp) => 
  Component => newProps => <Connect Component={Component} mstp={mstp} mdtp={mdtp} newProps={newProps} />;