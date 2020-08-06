import React, { Component } from 'react';
import { Text, View } from 'react-native';

import {creteBottomTabNavigator,createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Icon, Header} from 'react-native-elements';

export default class Transcript extends Component
{
  render()
  {
    return(
       <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>       
          <Text style={{fontSize:50}}>First</Text>
       </View>
    )
  };
}

