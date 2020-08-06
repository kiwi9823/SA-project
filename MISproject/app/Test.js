import React from 'react';
import { Text, View, ScrollView,} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {Icon,Header} from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';

function Transcript () {
    return (
      <ScrollView>
        <Text style={{fontSize:15, padding:15}}>
2019年12月以來，湖北省武漢市展開呼吸道疾病及相關疾病監測，發現不明原因病毒性肺炎病例。個案臨床表現主要為發熱，少數病人呼吸困難，胸部X光片呈雙肺浸潤性病灶。衛生福利部中華民國 109 年 1 月 15 日衛授疾字第 1090100030 號公告，新增「嚴重特殊傳染性肺炎」為第五類法定傳染病。
疾病介紹
◆致病源 
冠狀病毒(CoV)為一群有外套膜之RNA病毒，外表為圓形，在電子顯微鏡下可看到類似皇冠的突起因此得名。已知會感染人類的冠狀病毒包括alpha CoV的HCoV-229E , HCoV-NL63以及beta CoV的HCoV-HKU1, HCoV-OC43, MERS-CoV, SARS-CoV, 和最新發現的2019-nCoV。 
◆傳播途徑
大部分的人類冠狀病毒以直接接觸帶有病毒的分泌物或飛沫傳染為主。有部分動物的冠狀病毒會讓動物出現腹瀉症狀，可以在糞便當中找到病毒，可能藉此造成病毒傳播。  
◆診斷與治療
冠狀病毒不容易以組織培養方式分離出來。PCR 為人類冠狀病毒之檢驗首選，且可研究其流行病學與病毒演化。也可採行免疫螢光抗原染色法。目前所有的冠狀病毒並無特定推薦的治療方式，多為採用支持性療法。SARS流行期間曾有許多抗病毒藥物被使用來治療病人，但其效果均未被確認。 
冠狀病毒(CoV)為一群有外套膜之RNA病毒，外表為圓形，在電子顯微鏡下可看到類似皇冠的突起因此得名。大部分的人類冠狀病毒以直接接觸帶有病毒的分泌物或飛沫傳染為主。
        </Text>
      </ScrollView>
    );
  }

function Summary () {
    return (
      <ScrollView>
        <Text style={{fontSize:15, padding:15}}>Second</Text>
      </ScrollView>
    );
}

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
      <Tab.Navigator barStyle={{backgroundColor:'#3488C0'}}>
        <Tab.Screen name="逐字稿" component={Transcript} 
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <Icon name="text-document" type="entypo" color={color} size={size} />
                    ),
                    // tabBarIcon: ({ tintColor }) => (<Icon name="text-document" type="entypo" size={23} color={tintColor} />
                    // ),
                  }}
        />
        <Tab.Screen name="摘要稿" component={Summary} 
                  options={{

                    tabBarIcon: ({ color, size }) => (
                      <Icon name="text" type="entypo" color={color} size={size} />
                    ),
                    // tabBarIcon: ({ tintColor }) => (<Icon name="text" type="entypo" size={23} color={tintColor} />
                    // ),
                  }}
        />
      
      </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer >
      <FileHeader/>
      <MyTabs />
    </NavigationContainer>
  );
}

// /*Tab的設計*/
// const TabNavigator = createMaterialBottomTabNavigator(
//     {
//       Transcript:{screen:Transcript,
//         //   options:{
//         //   tabBarLabel: 'Home',
//         //   tabBarIcon: ({ color, size }) => (
//         //     <MaterialCommunityIcons name="home" color={color} size={size} />
//         //   ),
//         // }

//           navigationOptions:{
//               tabBarLabel:'逐字稿',
//               // activeColor:'black',
//               // inactiveColor:'white',
//               barStyle:{backgroundColor:'#3488C0'},
//               tabBarIcon: ({ tintColor }) => <Icon name="text-document" type="entypo" size={23} color={tintColor} />
//               // tabBarIcon:()=>(
//               //     <View>
//               //         <Icon name={'description'} size={25} color={'#fff'}/>
//               //     </View>
//               // )
//           }
//       },
//       Summary:{screen:Summary,
//           navigationOptions:{
//               tabBarLabel:'摘要稿',
//               // activeColor:'black',
//               // inactiveColor:'white',
//               barStyle:{backgroundColor:'#3488C0'},
//               tabBarIcon: ({ tintColor }) => <Icon name="text" type="entypo" size={23} color={tintColor} />
//               // tabBarIcon:()=>(
//               //     <View>
//               //         <Icon name={'sort'} size={25} color={'#fff'} onPress={() => color='black'} />
//               //     </View>
//               // )
//           }
//       }
//     }
//   );
// const Appcontainer = createAppContainer(TabNavigator);

function FileHeader(){
  return(
        <Header
          backgroundColor='transparent'
          containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
          leftComponent={{ icon: 'menu', type:'entypo', color: '#fff', underlayColor: '#3488C0', onPress:() => this.openMenu() }}
          centerComponent={{
            text: '20200203 錄音一',
            style: {
              fontSize: 20,
              fontWeight: 'bold',
              fontFamily: 'Fonts.Lato',
              color: 'white'
            }
          }}
          rightComponent={{ icon: 'export', type:'entypo', color: '#fff', underlayColor: '#3488C0', onPress: () => this.exportFile() }}
        />
     );
}
function openMenu(){
  navigation.openDrawer();
};
function exportFile(){
  
}

// /*主要code*/
// function App() {
//   return (
//     <NavigationContainer /*tabBarOptions={{activeTintColor: '#e91e63'}}*/>
//         <FileHeader/>
//         <Appcontainer/>     
//     </NavigationContainer>
//   );
// }
// export default App;

