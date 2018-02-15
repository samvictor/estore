import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
} from 'react-native';

import about_text from './AboutText';
import styles from './Styles';


export default class About extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'log': 'ver 1',
    };
  }

  render() {
    return (
      <View style={[{flex: 1, width: '100%', backgroundColor: '#404040'}]}>
        <ScrollView style={[styles.scroll]}
              contentContainerStyle={styles.scroll_container}>

          <View style={{width: '100%', height:110}}></View>
          <Image source={require("../img/family_400.jpg")}
                style={{width: '100%', maxWidth: 500, height: 300,
                        borderWidth: 1, borderColor: '#222',
                        marginBottom: 20}}
                resizeMode='cover'/>
          {about_text}
          <View style={{width: '100%', height:30}}></View>
        </ScrollView>
        <View style={[styles.fixed_top, styles.banner]}>
          <Text style={[styles.h4, {color: 'white'}]}>
            About
          </Text>
          <Text style={[styles.h6, styles.red_text]}>
            { (this.props.app_state.user !== null)
              ? this.props.app_state.user.email
              : ''
            }
          </Text>
        </View>
      </View>
    );
  }
}
