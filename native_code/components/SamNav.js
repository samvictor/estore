import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  PixelRatio
} from 'react-native';

import styles from './Styles';
import SamSnack from './SamSnack';


export default class SamNav extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'path': '',
      'render_me': null,
      'tabs': [],
      'log': 'log: ',
    };
  }

  componentWillReceiveProps(nextProps){
    let children = [<Text>Nothing Here</Text>];
    if (typeof nextProps.children !== 'undefined'){
      if (Array.isArray(nextProps.children))
        children = nextProps.children;
      else // single node
        children = [nextProps.children];
    }
    else {
      this.setState({'render_me': children[0]});
      return;
    }

    let for_state = {'render_me': children[0]};
    let found = false;
    let this_node = null;
    for(var i = 0; i < children.length; i++){
      this_node = children[i];
      if (typeof this_node.props.default !== 'undefined'
            && this_node.props.default === 'true') {
        for_state.render_me = this_node;
      }
      if (typeof this_node.props.path !== 'undefined'
            && this_node.props.path === nextProps.path){
        for_state.render_me = this_node;
        break;
      }
    }

    let this_tab = null;
    let for_tabs = [];
    let tab_style = {
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'column',
      alignItems: 'center',
      height: 45,
    };
    let text_style = {
      textAlign: 'center',
      flex: 1,
      paddingTop: 10,
    };
    let active_style = {
      fontWeight: 'bold',
      fontSize: 17,
      paddingTop: 8,
    }
    let bar_color = '';

    function tab_pressed(this_tab) {
      this.setState({'log': 'tab pressed, '+nextProps.set_app_state.toString()});
      nextProps.set_app_state({'path': this_tab.path});
    }

    for (var i = 0; i < nextProps.tabs.length; i++){
      this_tab = nextProps.tabs[i];
      if(this_tab.path === nextProps.path)
        bar_color = '#d61010';
      else
        bar_color = 'white';

      for_tabs[i] =
      <TouchableOpacity
            style={tab_style}
            onPress={tab_pressed.bind(this, this_tab)}>
        <View style={{width: '100%', height: 2, backgroundColor: bar_color}}></View>
        <Text style={[
              text_style,
              (this_tab.path === nextProps.path)? active_style :'',
            ]}>
          {this_tab.name}
        </Text>
        <View></View>
      </TouchableOpacity>;
    }

    for_state['tabs'] = for_tabs;

    this.setState(for_state);
  }


  render() {
    let show_tabs = 'true';
    if(this.state.render_me !== null
          && typeof this.state.render_me.props !== 'undefined'
          && typeof this.state.render_me.props.show_tabs !== 'undefined'
          && this.state.render_me.props.show_tabs === 'false')
      show_tabs = 'false';

    return (
      <View style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <View style={{flex: 1, width: '100%'}}>
          {this.state.render_me}

          <SamSnack app_state={this.props.app_state}
                    set_app_state={this.props.set_app_state}/>
        </View>
        {(show_tabs === 'true')
          ?[<View style={{backgroundColor: '#202020', height: 1/PixelRatio.get(),
                            width: '100%'}}>
            </View>,
            <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.state.tabs}
          </View>]
          :null
        }
      </View>
    );
  }
}
