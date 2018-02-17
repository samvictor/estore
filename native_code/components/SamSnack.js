import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import styles from './Styles';

export default class SamSnack extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'showing': false,
      'msg': '',
      'duration': 0,
      'snack_height': new Animated.Value(0),
      'curr_snack_id': 0,
    };
  }

  componentWillReceiveProps(next_props){
    let for_state = {};
    let snack_msg;
    let snack_duration;
    let snack_id;

    snack_msg = next_props.app_state.snack_msg;
    snack_duration = next_props.app_state.snack_duration;
    snack_id = next_props.app_state.snack_id + 1;

    // new message?
    if(snack_msg !== this.state.msg
          && snack_msg !== ''){
      for_state = {
        'showing': true,
        'msg': snack_msg,
        'duration': snack_duration,
        'curr_snack_id': snack_id,
      };

      // make sure snack not showing before animate.
      if(!this.state.showing){
        Animated.timing(                  // Animate over time
          this.state.snack_height,            // The animated value to drive
          {
            toValue: 60,                   // Animate to opacity: 1 (opaque)
            duration: 500,              // Make it take a while
          }
        ).start();                        // Starts the animation
      }

      this.setState(for_state);
      next_props.set_app_state({'snack_id': snack_id});

      setTimeout(function(my_snack_id) {
        if(my_snack_id !== this.props.app_state.snack_id) {
          // you should only cancel your own message, not someone else's
          return;
        }

        let for_local_state = {
          'showing': false,
          'duration': 0,
          'stack_counter': 0
        };
        this.setState(for_local_state);

        let for_app_state = {
          'snack_msg': '',
          'snack_duration': 0,
        };
        this.props.set_app_state(for_app_state);

        Animated.timing(
          this.state.snack_height,
          {
            toValue: 0,
            duration: 500,
          }
        ).start(() => this.setState({'msg': ''}));

      }.bind(this, snack_id), for_state.duration);
    }
  }

  render() {
    let snack_height = this.state.snack_height;

    return (
      <Animated.View
        style={[{
          'height': snack_height,
        },
        styles.sam_snack]}
      >
        <Text style={{'color': 'white', 'textAlign': 'center'}}>
          {this.state.msg}
        </Text>
      </Animated.View>
    );
  }
}
