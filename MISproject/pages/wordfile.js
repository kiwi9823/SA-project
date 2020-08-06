import React, { Component } from 'react';

import { Text, View, FlatList, ActivityIndicator, SafeAreaView}from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {Icon,Header} from 'react-native-elements';
// import {DrawerActions, useNavigation, NavigationContainer} from '@react-navigation/native';


//方法1
export default class WordFile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summ: [],
      trans: [],
      isLoading: true
    };
  }

  async componentDidMount() {

    const response = await fetch('https://gist.githubusercontent.com/kiwi9823/cb99d49e9c8674d40a2378f1546a88bd/raw/705da9f5a00cf6fa6c13b2073a3a97bfe58d8703/text.json');
    const json = await response.json();
    this.setState({ summ: json.summary, trans: json.transcript, isLoading:false });

    
    // console.log('this.state.trans');
    // console.log(this.state.trans);

    // fetch('https://gist.githubusercontent.com/kiwi9823/cb99d49e9c8674d40a2378f1546a88bd/raw/705da9f5a00cf6fa6c13b2073a3a97bfe58d8703/text.json')
    //  .then((response) => response.json())
    //  .then((json) => {
    //    this.setState({ summ: json.summary,trans: json.transcript });
    //     // console.log(this.state.data);
    //     // console.log('TRANSCRIPT');
    //     // console.log(this.state.trans);
    //  })
    //  .catch((error) => console.error(error))
    //  .finally(() => {
    //    this.setState({ isLoading: false });
    //  });
  }

  Transcript = () => {
    // const { isLoading } = this.state;
    // const { trans, isLoading } = this.state;

    // console.log('TRANS');
    // console.log(this.state.trans);
    // let summ = this.state ;
  
    return (
        <SafeAreaView style={{ flex: 1, padding: 15 }}>

            <FlatList
              data={this.state.trans}
              extraData={this.state}
              keyExtractor={({ id }, index) => id}
              renderItem={({ item }) => (
                <View>
                <Text style={{fontSize:15}}>{item.text}{"\n"}</Text>              
                </View>
              )}
            />

        </SafeAreaView>
      );

  }

  Summary = () => {
    // const { isLoading } = this.state;
    // const { data } = this.state;
    // let summ = this.state ;

    // console.log('SUm');
    // console.log(this.state.data);
  
    return (
        <SafeAreaView style={{ flex: 1, padding: 15 }}>

            <FlatList
              data={this.state.summ}
              extraData={this.state}
              keyExtractor={({ id }, index) => id}
              renderItem={({ item }) => (
                <View>
                <Text style={{fontSize:15}}>{item.text}{"\n"}</Text>              
                </View>
              )}
            />

        </SafeAreaView>
      );
  }
  
  render(){
    const { navigation } = this.props;
    const Tab = createMaterialBottomTabNavigator();
    const { isLoading } = this.state;

    //當isLoading為false時
    if(!isLoading){

    return(
      
        <Tab.Navigator barStyle={{backgroundColor:'#3488C0'}}>
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
    else{
          return(<ActivityIndicator/>);
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
