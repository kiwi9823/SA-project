import React, { Component } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity } from 'react-native';
import { SearchBar, Header, Icon } from 'react-native-elements';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
// import Icon from 'react-native-vector-icons/Entypo';

import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';


import recordpage from './pages/record';
import soundpage from './pages/sound';
import historypage from './pages/history';
import initialpage from './pages/initial';
import registerpage from './pages/register';

import { color } from 'react-native-reanimated';



function Mainpage({ navigation }) {
  return (
    <View style={{ flex: 1 }}>

      {/* Header&Body */}
      <View style={{ flex: 7, backgroundColor: 'white' }}>
        {/* <View style={{ flex: 1, }}>                     */}
        <Header
          placement="left"
          // backgroundColor='#E8E8E8'
          backgroundColor='#3488C0'

          // containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
          leftComponent={{ icon: 'menu', type: 'entypo', color: 'white', underlayColor: '#3488C0', onPress: () => navigation.openDrawer() }}
          centerComponent={{
            text: '語音列表',
            style: {
              fontSize: 20,
              fontWeight: 'bold',
              fontFamily: 'Fonts.Lato',
              color: 'white'
            }
          }}
        />
        <ScrollView>
          <SearchBar
            searchIcon={{ size: 15, color: '#A5A5A5' }}
            placeholder="Type Here..."
            placeholderTextColor='#A5A5A5'
            platform="ios"
            inputStyle={{ fontSize: 15 }}
            inputContainerStyle={{ height: 10, backgroundColor: '#ECECEC' }}
            containerStyle={{ height: 50, backgroundColor: 'transparent' }}
          // onChangeText={this.updateSearch}
          // value={search}
          />
        </ScrollView>
        {/* </View> */}
      </View>

      {/* Footer */}
      <View style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Icon raised name='controller-record' type='entypo' color='red'
            onPress={() => navigation.navigate('錄音')}
          />
        </View>
      </View>

    </View>
  );
}

function CustomDrawerContent(props) {

  //隱藏播放
  const { state, ...rest } = props;
  const newState = { ...state }  //copy from state before applying any filter. do not change original state
  newState.routes = newState.routes.filter(item => item.name !== '播放') //replace "Login' with your route name
  // newState.routes = newState.routes.filter(item => item.name !== '初始頁面')

  return (

    <DrawerContentScrollView {...props}>
      <DrawerItemList state={newState} {...rest} />
      <DrawerItem
        label="關閉選單"
        // onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
        onPress={() => props.navigation.closeDrawer()}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();
function MyDrawer() {
  return (

    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      {/* <Drawer.Screen name="初始頁面" component={Mainpage} /> */}
      <Drawer.Screen name="登出" component={initialpage}
        options={{
          swipeEnabled: false,
        }} />
      <Drawer.Screen name="註冊頁面" component={registerpage} />
      <Drawer.Screen name="歷史紀錄" component={historypage} />
      <Drawer.Screen name="錄音" component={recordpage} />
      <Drawer.Screen name="播放" component={soundpage} />
      {/* <Drawer.Screen name="逐字稿" component={wordpage} /> */}
    </Drawer.Navigator>

  );
}
const Stack = createDrawerNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}