import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import styles from './Styles';


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
    let text_style = {textAlign: 'center'};
    let tab_style = {
      flex: 1,
      paddingVertical: 10,
    };

    function tab_pressed(this_tab) {
      this.setState({'log': 'tab pressed, '+nextProps.set_app_state.toString()});
      nextProps.set_app_state({'path': this_tab.path});
    }

    for (var i = 0; i < nextProps.tabs.length; i++){
      this_tab = nextProps.tabs[i];
      for_tabs[i] =
      <TouchableOpacity
            style={tab_style}
            onPress={tab_pressed.bind(this, this_tab)}>
        <Text style={text_style}>{this_tab.name}</Text>
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
        <View style={{flex: 1, backgroundColor: 'blue', width: '100%'}}>
          {this.state.render_me}
        </View>
        {(show_tabs === 'true')
          ?<View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.state.tabs}
          </View>
          :null
        }
      </View>
    );
  }
}
