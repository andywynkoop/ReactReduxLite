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
      reduxProps: store.getState(),
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
    const reduxProps = Object.assign(this.state.reduxProps, readProps, writeProps);
    this.setState({ reduxProps });
    return reduxProps;
  }

  render() {
    const childProps = Object.assign({}, this.props);
    delete childProps["childComp"];
    delete childProps["mstp"];
    delete childProps["mdtp"];
    const reduxProps = this.state.reduxProps;
    console.log(this.state.reduxProps)
    const allProps = Object.assign({}, childProps, reduxProps);
    const { childComp: Component } = this.props;
    return <Component {...allProps} />;
  }
}

export const connect = (mstp, mdtp) => 
  (Component) => <Connect childComp={Component} mstp={mstp} mdtp={mdtp} />;



