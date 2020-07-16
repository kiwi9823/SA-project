import React, { Component } from 'react';
import { Text, View } from 'react-native';

import {creteBottomTabNavigator,createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Icon} from 'react-native-elements';

import Screen2 from './Screen2';

class Screen1 extends Component
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

const TabNavigator=createMaterialBottomTabNavigator(
  {
    Screen1:{screen:Screen1,
        navigationOptions:{
            tabBarLabel:'全文逐字稿',
            activeColor:'white',
            inactiveColor:'black',
            barStyle:{backgroundColor:'#67baf6'},
            tabBarIcon:()=>(
                <View>
                    <Icon name={'description'} size={25} style={{color:'blue'}}/>
                </View>
            )
        }
    },
    Screen2:{screen:Screen2,
      navigationOptions:{
          tabBarLabel:'全文摘要稿',
          activeColor:'white',
          inactiveColor:'black',
          barStyle:{backgroundColor:'#67baf6'},
          tabBarIcon:()=>(
              <View>
                  <Icon name={'sort'} size={25} style={{color:'blue'}}/>
              </View>
          )
      }
  }
  }
);

export default createAppContainer(TabNavigator);