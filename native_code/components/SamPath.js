import React, { Component } from 'react';
import {
} from 'react-native';

import styles from './Styles';


export default class SamPath extends Component<{}> {
  constructor(props){
    super(props);
  }

  render() {
    return (
      this.props.children
    );
  }
}
