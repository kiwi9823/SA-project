import React, { Component } from 'react';

import { Text, View, FlatList, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl, PermissionsAndroid,Alert} from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Icon, Header } from 'react-native-elements';
import { FAB, Portal, Provider } from 'react-native-paper';
// import App from './sound';
// import {DrawerActions, useNavigation, NavigationContainer} from '@react-navigation/native';
import RNFS from 'react-native-fs';

//方法1
export default class WordFile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summ: [],
      summ_data:[],
      trans: [],
      isLoading: true,
      hasPermission: undefined
    };
  }


  async componentDidMount() {
    // let formData = new FormData();
    // // let filename = datas;
    // formData.append('userName', 'testClient');
    // formData.append('fileName', 'pythontest');

    // const response = await fetch('http://140.115.81.199:9943/textFetch/testClient/pythontest',
    //   {
    //     method: 'POST',
    //     // headers: {
    //     //   Accept: 'application/json',
    //     //   'Content-Type': 'multipart/form-data'
    //     // },
    //     body: formData
    //   });
    // //console.log(response)
    //   const json = await response.json();
    // this.setState({ summ: json.summary, trans: json.transcript, isLoading: false });

    const response = await fetch('https://gist.githubusercontent.com/kiwi9823/2cf7242d8f10b04e77aa72acd246462e/raw/c9349c048340d82777f885cbeda8b9f1f1794907/test.json');
    const json = await response.json();
    //Transcript
    const transSTR = JSON.stringify(json.transcript);
    const transData = transSTR.slice(1,-1); // console.log(transData.slice(1,-1));
    //Summary
    const summSTR = JSON.stringify(json.transcript);
    const summData = summSTR.slice(1,-1); // console.log(transData.slice(1,-1));
    this.setState({ summ: json.summary, summ_data: summData,trans: transData, isLoading:false });
  }

  EditText = () => {
      console.log('Pressed edit')
  }

  trans_download = () => {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      
      // create a path you want to write to
      // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
      // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
      var path = RNFS.DownloadDirectoryPath + '/transcript.txt';
      console.log(path);
      // write the file
      RNFS.writeFile(path, this.state.trans, 'utf8')
        .then((success) => {
          Alert.alert(
            "Download File",
            "Success!",
            [
              // {
              //   text: "Cancel",
              //   onPress: () => console.log("Cancel Pressed"),
              //   style: "cancel"
              // },
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
          console.log('FILE WRITTEN!');
        })
        .catch((err) => {
          console.log(err.message);
        });
  }
  Transcript = () => {
    const [state, setState] = React.useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;

    return (
      <SafeAreaView style={{ flex: 1, padding: 15, paddingBottom:50}}>
              <View>
                <Text style={{ fontSize: 15 }}>{this.state.trans}{"\n"}</Text>
              </View>
         
          <Provider>
              <Portal>
                  <FAB.Group
                      open={open}
                      icon={open ? 'close' : 'plus'}
                      fabStyle={{backgroundColor:"rgba(231,76,60,1)"}}
             
                      actions={[
                        // { icon: 'plus', onPress: () => console.log('Pressed add') },
                          {
                            icon: 'format-title',
                            label: 'Edit Text',
                            onPress: () => this.EditText(),
                          },
                          // {
                          //   icon: 'format-color-highlight',
                          //   label: 'Highlight',
                          //   onPress: () => console.log('Pressed Hightlight'),
                          // },
                          {
                            icon: 'content-save-edit',
                            label: 'Save Edit',
                            onPress: () => console.log('Pressed save edit'),
                          },
                          {
                            icon: 'download',
                            label: 'Download',
                            onPress: () => this.trans_download(),
                          },
                      ]}

                      onStateChange={onStateChange}
                      onPress={() => {
                          if (open) {
                            // do something if the speed dial is open
                          }
                      }}
                  />
              </Portal>
          </Provider>
      </SafeAreaView>
    );
  }

  summ_download = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    
    // create a path you want to write to
    // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
    // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
    var path = RNFS.DownloadDirectoryPath + '/summary.txt';
    console.log(path);
    // write the file
    RNFS.writeFile(path, this.state.summ_data, 'utf8')
      .then((success) => {
        Alert.alert(
          "Download File",
          "Success!",
          [
            // {
            //   text: "Cancel",
            //   onPress: () => console.log("Cancel Pressed"),
            //   style: "cancel"
            // },
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  Summary = () => {
    const [state, setState] = React.useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;

    return (
      <SafeAreaView style={{ flex: 1, padding: 15, paddingBottom:50}}>
          <FlatList
            data={this.state.summ}
            extraData={this.state}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (
              <View>
                <Text style={{ fontSize: 15 }}>{item.text}{"\n"}</Text>
              </View>
            )}
          />
          <Provider>
              <Portal>
                  <FAB.Group
                      open={open}
                      icon={open ? 'close' : 'plus'}
                      fabStyle={{backgroundColor:"rgba(231,76,60,1)"}}
                      
                      actions={[
                        // { icon: 'plus', onPress: () => console.log('Pressed add') },
                          {
                            icon: 'format-title',
                            label: 'Edit Text',
                            onPress: () => this.EditText(),
                          },
                          // {
                          //   icon: 'format-color-highlight',
                          //   label: 'Highlight',
                          //   onPress: () => console.log('Pressed export'),
                          // },
                          {
                            icon: 'content-save-edit',
                            label: 'Save Edit',
                            onPress: () => console.log('Pressed save edit'),
                          },
                          {
                            icon: 'download',
                            label: 'Download',
                            onPress: () => this.summ_download(),
                          },
                      ]}          
                      
                      onStateChange={onStateChange}
                      onPress={() => {
                          if (open) {
                            // do something if the speed dial is open
                          }
                      }}
                  />
              </Portal>
          </Provider>
      </SafeAreaView>
    );
  }

  //refresh control
  state = {
    response: [],
    refreshing: false,
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.componentDidMount().then(() => {
        this.setState({ refreshing: false });
    });
  }

  render() {
    const { navigation } = this.props;
    const Tab = createMaterialBottomTabNavigator();
    const { isLoading } = this.state;

    //當isLoading為false時
    if (!isLoading) {

      return (
        <Tab.Navigator barStyle={{ backgroundColor: '#3488C0' }}>
          <Tab.Screen
            name="逐字稿"
            component={this.Transcript}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="text-document" type="entypo" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="摘要稿"
            component={this.Summary}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="text" type="entypo" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>    
      );
    }
    else {
      return (
        < ScrollView refreshControl={
          < RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
          />}
        >
          <ActivityIndicator/>
        </ ScrollView>
      );
    }
    
  }
}


// //方法2
// function Transcript () {
//     return (
//       <ScrollView>
//         <Text style={{fontSize:15, padding:15}}>
// 2019年12月以來，湖北省武漢市展開呼吸道疾病及相關疾病監測，發現不明原因病毒性肺炎病例。個案臨床表現主要為發熱，少數病人呼吸困難，胸部X光片呈雙肺浸潤性病灶。衛生福利部中華民國 109 年 1 月 15 日衛授疾字第 1090100030 號公告，新增「嚴重特殊傳染性肺炎」為第五類法定傳染病。
// 疾病介紹
// ◆致病源 
// 冠狀病毒(CoV)為一群有外套膜之RNA病毒，外表為圓形，在電子顯微鏡下可看到類似皇冠的突起因此得名。已知會感染人類的冠狀病毒包括alpha CoV的HCoV-229E , HCoV-NL63以及beta CoV的HCoV-HKU1, HCoV-OC43, MERS-CoV, SARS-CoV, 和最新發現的2019-nCoV。 
// ◆傳播途徑
// 大部分的人類冠狀病毒以直接接觸帶有病毒的分泌物或飛沫傳染為主。有部分動物的冠狀病毒會讓動物出現腹瀉症狀，可以在糞便當中找到病毒，可能藉此造成病毒傳播。  
// ◆診斷與治療
// 冠狀病毒不容易以組織培養方式分離出來。PCR 為人類冠狀病毒之檢驗首選，且可研究其流行病學與病毒演化。也可採行免疫螢光抗原染色法。目前所有的冠狀病毒並無特定推薦的治療方式，多為採用支持性療法。SARS流行期間曾有許多抗病毒藥物被使用來治療病人，但其效果均未被確認。 
// 冠狀病毒(CoV)為一群有外套膜之RNA病毒，外表為圓形，在電子顯微鏡下可看到類似皇冠的突起因此得名。大部分的人類冠狀病毒以直接接觸帶有病毒的分泌物或飛沫傳染為主。
//         </Text>
//       </ScrollView>
//     );
//   }

// function Summary () {
//     return (
//       <ScrollView>
//         <Text style={{fontSize:15, padding:15}}>Second</Text>
//       </ScrollView>
//     );
// }

// const Tab = createMaterialBottomTabNavigator();

// function MyTabs() {
//   return (
//       <Tab.Navigator barStyle={{backgroundColor:'#3488C0'}}>
//         <Tab.Screen name="逐字稿" component={Transcript} 
//                   options={{
//                     tabBarIcon: ({ color, size }) => (
//                       <Icon name="text-document" type="entypo" color={color} size={size} />
//                     ),
//                     // tabBarIcon: ({ tintColor }) => (<Icon name="text-document" type="entypo" size={23} color={tintColor} />
//                     // ),
//                   }}
//         />
//         <Tab.Screen name="摘要稿" component={Summary} 
//                   options={{
//                     tabBarIcon: ({ color, size }) => (
//                       <Icon name="text" type="entypo" color={color} size={size} />
//                     ),
//                     // tabBarIcon: ({ tintColor }) => (<Icon name="text" type="entypo" size={23} color={tintColor} />
//                     // ),
//                   }}
//         />
//       </Tab.Navigator>
//   );
// }

// export default function WordFile() {
//   return (
//       <MyTabs />
//   );
// }