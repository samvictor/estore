import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  Animated,
  TextInput,
  Button,
} from 'react-native';
import TextInputState from 'react-native/lib/TextInputState'

import styles from './Styles';
import gen_items from './ShowItems';


export default class Home extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'log': 'ver 1',
      scroll_y: new Animated.Value(0),
    };
  }

  render() {
    const scroll_height = 145;
    const view_opacity = this.state.scroll_y.interpolate({
      inputRange: [0, scroll_height*3],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    const view_top = this.state.scroll_y.interpolate({
      inputRange: [0, scroll_height*4],
      outputRange: [0, 0-scroll_height],
      extrapolate: 'clamp',
    });

    return (
      <View style={{flex: 1, width: '100%'}}>
        <ScrollView style={[styles.scroll]}
              contentContainerStyle={styles.scroll_container}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: this.state.scroll_y}}}]
              )}>
          <View style={{width: '80%', height: 170, backgroundColor: 'white'}}>
          </View>
          {gen_items(this, this.props.app_state)}
        </ScrollView>
        <Animated.View style={[home_styles.ani_view,
                {opacity: view_opacity, top: view_top}]}>
          <View style={styles.banner}>
            <Image source={require("../img/open.png")}
                  style={{width: '30%', height: 80}}
                  resizeMode='contain'/>
            <Text style={[styles.h5, {color: 'white'}]}>
              Welcome to our Store
            </Text>
            <Text style={[styles.h6, styles.red_text]}>
              { (this.props.app_state.user !== null)
                ? this.props.app_state.user.email
                : ''
              }
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  }
}


const home_styles = StyleSheet.create({
  ani_view: {
    position: 'absolute',
    left: 0,
    right: 0,
  }
});
