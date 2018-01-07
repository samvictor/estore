import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import styles from './Styles';

export default class SamSnack extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'showing': false,
      'msg': '',
      'duration': 0,
      'stack_counter': 0, // incase of multiple messages at once.
    };
  }

  componentWillReceiveProps(next_props){
    let for_state = {};
    // new message?
    if(next_props.app_state.snack_msg !== this.state.msg
          && next_props.app_state.snack_msg !== ''){
      for_state = {
        'showing': true,
        'msg': next_props.app_state.snack_msg,
        'duration': next_props.app_state.snack_duration,
        'stack_counter': this.state.stack_counter + 1,
      };

      this.setState(for_state);
      setTimeout(()=> {
        if(this.state.stack_counter > 1) {
          // you should only cancel your own message, not someone else's
          this.setState({'stack_counter': this.state.stack_counter - 1});
          return;
        }

        let for_local_state = {
          'showing': false,
          'msg': '',
          'duration': 0,
          'stack_counter': 0
        };
        this.setState(for_local_state);

        let for_app_state = {
          'snack_msg': '',
          'snack_duration': 0,
        };
        this.props.set_app_state(for_app_state);

      }, for_state.duration);
    }

  }

  render() {
    let snack_height = (this.state.showing ? 60 : 10);
    return (
      <View style={[styles.sam_snack, {'height': snack_height}]}>
        <Text style={{'color': 'white'}}>
          {this.state.msg}
        </Text>
      </View>
    );
  }
}
