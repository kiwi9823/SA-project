import React, { Component } from 'react';
import {useIsFocused,StyleSheet, View, BackHandler, Modal, TouchableHighlight, SafeAreaView,TextInput, FlatList, ActivityIndicator, ScrollView, RefreshControl, PermissionsAndroid,Alert} from 'react-native';
import { Header, Slider, Icon, Input, Button} from 'react-native-elements'
import Sound from 'react-native-sound'
import { DrawerActions, useNavigation } from '@react-navigation/native';
import {BottomNavigation, Text, FAB, Portal, Provider} from 'react-native-paper';
import RNFS from 'react-native-fs';
import { cos } from 'react-native-reanimated';



let whoosh;

export default class App extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            volume: 0.5,
            seconds: 0, //秒數
            totalMin: '', //總分鐘
            totalSec: '', //總秒數
            nowMin: 0, //目前分鐘
            nowSec: 0, //目前秒鐘
            maximumValue: 0, //滑輪直
            play: false,
            pause: false,
            resume: false,

          summ: [],
          summ_data:[],
          trans: [],
          trans_data:[],
          isLoading: true,
          // hasPermission: undefined,
          index: 0,
          routes: [
            { key: 'trans', title: 'Transcript', icon: 'text-to-speech',color:'#5C9FCC'},
            { key: 'summ', title: 'Summary', icon: 'text-short',color:'#296C99'},
          ],
          response: [],
          numberOfsummary: '',
          text:'',
          OldnumberOfsummary:'5',
        };
    }
        
    async componentDidMount() {

        //音檔位置
        let url = this.props.route.params.url;
        //初始化
        whoosh = new Sound(url, '', (err) => {
            if (err) {
                return console.log("??" + err)
            }
            let totalTime = whoosh.getDuration();
            //let totalTime = time + 1;
            console.log("時間" + totalTime);
            totalTime = Math.ceil(totalTime);
            let totalMin = parseInt(totalTime / 60); //总分钟数
            let totalSec = totalTime - totalMin * 60; //秒钟数并判断前缀是否 + '0'
            totalSec = totalSec > 9 ? totalSec : '0' + totalSec;
            this.setState({
                totalMin,
                totalSec,
                maximumValue: totalTime,
            })
        });

        BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this));

    /*用server資料的時候*/
        let formData = new FormData();
        // let filename = datas;
        formData.append('userName', 'testClient');
        formData.append('fileName', this.props.route.params.name);

        const response = fetch('http://140.115.81.199:9943/textFetch/5',
          {
            method: 'POST',
            // headers: {
            //   Accept: 'application/json',
            //   'Content-Type': 'multipart/form-data'
            // },
            body: formData
          })
          .then((resp)=>{ return resp.json() })
          .then((json)=>{ 
              console.log(json) 

            //Transcript
            // const transSTR = JSON.stringify(json.transcript);
            // const transdata = transSTR.replace(/\\/g, ""); 
            // const joinT = transdata.split("n"); 
            // const replaceT=joinT.join(`\n`);
            // const transData = replaceT.slice(1,-1); 

            const transSTR = JSON.stringify(json.transcript).replace(/\\/g, "").split("n").join(`\n`);
            const transData = transSTR.slice(1,-1);

            //Summary
            // const summSTR = JSON.stringify(json.summary);     //"我n愛n你"
            // const summdata = summSTR.split("n");              //“我，愛，你”
            // const joinS = summdata.join(`\n`);                //“我    愛     你”
            // const summData = joinS.slice(1,-1);               //我    愛     你
            const summSTR = JSON.stringify(json.summary).replace(/\\/g, "").split("n").join(`\n`+"- ");
            const summData = summSTR.replace(/['"]+/g, "- ").slice(0,-4);

            this.setState({summ:json.summary, summ_data: summData, trans:json.transcript, trans_data: transData, isLoading:false, visible:true});
            });

        //   console.log(response)    
        // const json = await response.json(); 

    /*用假資料的時候*/
    //     const response = await fetch('https://gist.githubusercontent.com/kiwi9823/2cf7242d8f10b04e77aa72acd246462e/raw/25cc4626632c65cea58499e58d6b005eac4bb366/test.json');
    //     const json = await response.json();
    //    //Transcript
    //         const transSTR = JSON.stringify(json.transcript);console.log("11"+transSTR);
    //         const transdata = transSTR.replace("n","");console.log("22"+transdata);
    //         const transData = transdata.slice(1,-1); console.log("33"+transData);
    //         //Summary
    //         const summSTR = JSON.stringify(json.summary);console.log("11"+summSTR);
    //         const summdata = summSTR.split("n");console.log("22"+summdata);
    //         const joinS = summdata.join("");console.log("2"+joinS);

    //         const summdata2 = joinS.slice("'\'");console.log("33"+summdata2);
    //         const joinS2 = summdata2.join("");console.log("3"+joinS2);
    //         const summData = joinS2.slice(1,-1);console.log("44"+summData);
    //         this.setState({summ:json.summary, summ_data: summData, trans:json.transcript, trans_data: transData, isLoading:false, visible:true});


        // const response = await fetch('https://gist.githubusercontent.com/kiwi9823/14334bca028cebadde46437052504410/raw/eab818df1a12784ca8229613cba35a43af59cce2/22test.json');
        // const json = await response.json();
        // //Transcript
        // const transSTR = JSON.stringify(json.transcript);
        // const transData = transSTR.slice(1,-1); console.log(transSTR.slice(1,-1));
        // //Summary
        // const summSTR = JSON.stringify(json.summary);
        // const summData = summSTR.slice(19,-3); console.log(summSTR.slice(19,-3));
        // this.setState({ summ: json.summary, summ_data: summData,trans_data: transData, isLoading:false, visible:true});
    }

    componentWillUnmount() {
        this.time && clearTimeout(this.time);
    }

    backAction = async () => {
        this.props.navigation.navigate('歷史紀錄');
        this.setState({
            play:false,
            pause: false,
            resume: false,
            nowMin: 0,
            nowSec: 0,
            seconds: 0,

            summ: [],
            summ_data:[],
            trans: [],
            trans_data:[],
            isLoading: true,
            // hasPermission: undefined,
            index: 0,
            routes: [
              { key: 'trans', title: 'Transcript', icon: 'text-to-speech',color:'#5C9FCC'},
              { key: 'summ', title: 'Summary', icon: 'text-short',color:'#296C99'},
            ],
            response: [],
            numberOfsummary: '',
            text:'',
        })
        clearInterval(this.time);
       
        console.log("pause"+this.state.summ_data)
        whoosh.pause();
    };

      // 播放
    _play = () => {
        this.setState({ pause: false, play: true })

        if(this.state.resume==false){
            let url = this.props.route.params.url;
            whoosh = new Sound(url, '', (err) => {
    
                let totalTime = whoosh.getDuration();
                //let totalTime = time + 1;
                console.log("時間" + totalTime);
                totalTime = Math.ceil(totalTime);
                let totalMin = parseInt(totalTime / 60); //总分钟数
                let totalSec = totalTime - totalMin * 60; //秒钟数并判断前缀是否 + '0'
                totalSec = totalSec > 9 ? totalSec : '0' + totalSec;
                this.setState({
                    totalMin,
                    totalSec,
                    maximumValue: totalTime,
                })   
                if (err) {
                    return console.log(+err)
                }   
                whoosh.play(success => {
                    if (success) {
                        console.log('success - 播放成功')
                        this._stop();
                    } 
                    else {
                        console.log('fail - 播放失败')
                    }
                })   
            });   
            console.log("play" + url);
        }
        else{
            whoosh.play();
            console.log("resume")
            this.setState({resume:false,pause: false, play: true})
            console.log("play"+this.state.resume)
        }
        this.time = setInterval(() => {
            whoosh.getCurrentTime(seconds => {
                seconds = Math.ceil(seconds);
                this._getNowTime(seconds)
            })
        }, 1000)
        // if (this.state.pause) {
        //     whoosh.pause();
        //     console.log("pasue");
        // }         
    }

    // 暂停
    _pause = () => {
        clearInterval(this.time);
        this.setState({ pause: true, play: false,resume:true })
        console.log("pause"+this.state.resume)
        whoosh.pause();
    }

    //恢復
    _stop = () => {
        clearInterval(this.time);
        this.setState({
            nowMin: 0,
            nowSec: 0,
            seconds: 0,
        })
        this.setState({ pause: true, play: false })
    }

    _getNowTime = (seconds) => {
        let nowMin = this.state.nowMin,
            nowSec = this.state.nowSec;
        if (seconds >= 60) {
            nowMin = parseInt(seconds / 60); //当前分钟数
            nowSec = seconds - nowMin * 60;
            nowSec = nowSec < 10 ? '0' + nowSec : nowSec;
        } else {
            nowSec = seconds < 10 ? '0' + seconds : seconds;
        }
        this.setState({
            nowMin,
            nowSec,
            seconds
        })
    }

    Transcript = () => {
        const [state, setState] = React.useState({ open: false });
        const onStateChange = ({ open }) => setState({ open });
        const { open } = state;

        return (
            <SafeAreaView style={{ flex: 1, padding: 15, paddingBottom:50}}>
                <View>
                    <Text style={{ fontSize: 16}}>{this.state.trans_data}{"\n"}</Text>
                </View> 

                {/* <FlatList
                    data={this.state.trans}
                    extraData={state}
                    keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => (
                      <View>
                        <Text style={{ fontSize: 15 }}>{item.text}{"\n"}</Text>
                      </View>
                    )}
                /> */}

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
 
    Summary = () => {
        const [state, setState] = React.useState({ open: false });
        const onStateChange = ({ open }) => setState({ open });
        const { open } = state;

        const styles = StyleSheet.create({
            centeredView: {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 22,
            },
            modalView: {
              margin: 20,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 30,
              alignItems: "center",
              shadowColor: "blue",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 5,
              shadowRadius: 3.84,
              elevation: 100
            },
            openButton: {
              backgroundColor: "#F194FF",
              borderRadius: 10,
              padding: 10,
              elevation: 2
            },
            textStyle: {
              color: "white",
              fontWeight: "bold",
              textAlign: "center"
            },
            modalText: {
              marginBottom: 15,
              textAlign: "center",
              color: "black",
              fontSize: 18,
              fontWeight: "bold",
            }
          });

          const [modalVisible, setModalVisible] = React.useState(false);
        //   const [value, onChangeText] = React.useState('');

        return (
            <SafeAreaView style={{ flex: 1, padding: 15, paddingBottom:50}}>
                < ScrollView refreshControl={
                    < RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />}
                >

                <Text style={{textAlign:"center", color:'grey',paddingBottom:10}}>** 可在右下功能鍵中自由設定摘要句數</Text>
                
                <View>
                    <Text style={{ fontSize: 16}}>{this.state.summ_data}{"\n"}</Text>
                </View> 

                </ScrollView>
                {/* <FlatList
                    data={this.state.summ}
                    extraData={state}
                    keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => (
                      <View>
                        <Text style={{ fontSize: 15 }}>{item.text}{"\n"}</Text>
                      </View>
                    )}
                />  */}

                <Provider>
                    <Portal>
                        <FAB.Group
                            open={open}
                            icon={open ? 'close' : 'plus'}
                            fabStyle={{backgroundColor:"rgba(231,76,60,1)"}}
                            
                            actions={[
                                { icon: 'sort', 
                                  label:'Setting',
                                  onPress: () => setModalVisible(true),
                                },
                                {
                                //   icon: 'format-title',
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
                                  onPress: () => console.log('Pressed save ssedit'),
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
        <View style={styles.centeredView}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Place a Number</Text>
                        <TextInput
                        keyboardType = 'numeric'
                        style={{ height: 40, width:130, backgroundColor:'lightgray', marginBottom:15, paddingHorizontal:10}}
                        onChangeText={(text)=> this.onChanged(text)}
                        placeholder={this.state.OldnumberOfsummary}
                        maxLength={100}  //setting limit of input
                        />
                        <View style={{flexDirection: 'row'}}>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#2196F3", marginRight:10}}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    this.getNumofSummary(this.state.numberOfsummary)
                                    // this._onRefresh();
                                }}
                            >
                                <Text style={styles.textStyle}>Submit</Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                onPress={() => {
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </TouchableHighlight>
                        </View>
                </View>
              </View>
            </Modal>
        </View>
            </SafeAreaView>
        );
    }

    onChanged(text){
        let newText = '';
        let numbers = '0123456789';
    
        for (var i=0; i < text.length; i++) {
            if(numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                alert("please enter numbers only");
            }
        }
        this.setState({ numberOfsummary: newText});
    }

    getNumofSummary = (numberOfsummary) => {

        this.setState({OldnumberOfsummary: numberOfsummary});
        console.log(numberOfsummary);
        
        let formData = new FormData();
        // let filename = datas;
        formData.append('userName', 'testClient');
        formData.append('fileName', this.props.route.params.name);

        const response = fetch(`http://140.115.81.199:9943/sumSet/${numberOfsummary}`,
          {
            method: 'POST',
            // headers: {
            //   Accept: 'application/json',
            //   'Content-Type': 'multipart/form-data'
            // },
            body: formData
          }).then(response => {
            console.log(response.status);
         })
          .then((resp)=>{ return resp.json() })
          .then((json)=>{ 
              console.log(json) 

            //Summary
            const summSTR = JSON.stringify(json.summary);
            const summData = summSTR.slice(1,-1);
            this.setState({summ:json.summary, summ_data: summData});

            });
        
    }

    EditText = () => {
        console.log('Pressed edit')
    }
  
    trans_download = () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        // create a path you want to write to
        // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
        // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
        var date = new Date().getDate(); //To get the Current Date
        var month = new Date().getMonth() + 1; //To get the Current Month
        var year = new Date().getFullYear(); //To get the Current Year
        var hours = new Date().getHours(); //To get the Current Hours
        var min = new Date().getMinutes(); //To get the Current Minutes

        var path = RNFS.DownloadDirectoryPath + `/trans${this.props.route.params.name}_${year}${month}${date}_${hours}${min}.txt`;
        console.log(path);
        // write the file
        RNFS.writeFile(path, this.state.trans_data, 'utf8')
        // RNFS.writeFile(path, this.state.tran, 'utf8')
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

    summ_download = () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)        
        // create a path you want to write to
        // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
        // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
        var date = new Date().getDate(); //To get the Current Date
        var month = new Date().getMonth() + 1; //To get the Current Month
        var year = new Date().getFullYear(); //To get the Current Year
        var hours = new Date().getHours(); //To get the Current Hours
        var min = new Date().getMinutes(); //To get the Current Minutes

        var path = RNFS.DownloadDirectoryPath + `/summ${this.props.route.params.name}_${year}${month}${date}_${hours}${min}.txt`;
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

    _onRefresh = () => {
        console.log("refresh")
        this.setState({ refreshing: true });
        this.componentDidMount()
        .then(() => {
            this.setState({ refreshing: false });                    
        });
        this.wait(5000).then(() => {
          this.setState({ refreshing: false });
          //Alert message
        });
    }
  
    wait = (timeout) => {
      return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
    }

    _handleIndexChange = index => this.setState({ index });
    
    _renderScene = BottomNavigation.SceneMap({
        trans: this.Transcript,
        summ: this.Summary,
    });

//   _goBack = () => console.log('Went back');
//   _onSearch = () => console.log('Searching');
//   _onMore = () => console.log('Shown more');


    render() {
        let time = this.state;
        const { navigation } = this.props;
        let { play, pause } = this.state;
        const { isLoading } = this.state; //文件

         //當isLoading為false時
        if (!this.state.isLoading) {

            return (
                <View style={{flex:1}}>
                    <Header
                        placement="left"
                        backgroundColor='transparent'
                        containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
                        leftComponent={{
                            icon: 'close', color: '#fff', underlayColor: '#3488C0',size:30,
                            onPress: () => this.backAction()
                        }}

                        centerComponent={{
                            text: this.props.route.params.name,
                            style: {
                                fontSize: 22,
                                alignContent:'space-around',
                                fontWeight: 'bold',
                                fontFamily: 'Fonts.Lato',
                                color: 'white'
                            }
                        }}
                        // rightComponent={{ 
                        //     icon: 'cw', type: 'entypo', color: '#fff', underlayColor: '#3488C0', 
                        //     onPress: () => {this._onRefresh()} 
                        // }}
                    />

                    <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-around' }}>
                                {/* time&icon */}
                        <View style={{ flex: 1, paddingTop:10, marginHorizontal:30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <View>
                                <Text style={{fontSize:18}}>{time.nowMin}:{time.nowSec}/{time.totalMin}:{time.totalSec}</Text>
                            </View>
                                {/* play&pause icon */}
                            <View>
                                {
                                play ?
                                    <Icon name='controller-paus' type='entypo' size={25} color="black" onPress={this._pause}/>
                                     :
                                    <Icon  name='controller-play' type='entypo' size={30} color="black" onPress={this._play}/>
                                }
                            </View>
                        </View>
                                {/* Slider */}
                        <View style={{ flex: 1, paddingHorizontal:10, justifyContent: 'space-around'}}>
                            <Slider                      
                                // disabled //禁止滑动
                                maximumTrackTintColor={'#ccc'} //右侧轨道的颜色
                                minimumTrackTintColor={'skyblue'} //左侧轨道的颜色
                                maximumValue={this.state.maximumValue} //滑块最大值
                                minimumValue={0} //滑块最小值
                                value={this.state.seconds}
                                onSlidingComplete={(value) => { //用户完成更改值时调用的回调（例如，当滑块被释放时）
                                    value = parseInt(value);
                                    this._getNowTime(value)
                                    // 设置播放时间
                                    whoosh.setCurrentTime(value);
                                }} />
                        </View>
                    </View>

                    <View style={{ flex: 7, backgroundColor: 'white' }}>
                        <BottomNavigation
                            navigationState={this.state}
                            onIndexChange={this._handleIndexChange}
                            renderScene={this._renderScene}
                            shifting={true}
                        />
                    </View>                            
                </View>
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
                  <View style={{flex:1}}>
                    <Header
                        placement="left"
                        backgroundColor='transparent'
                        containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
                        leftComponent={{
                            icon: 'close', color: '#fff', underlayColor: '#3488C0',size:30,
                            onPress: () => this.backAction()
                        }}

                        centerComponent={{
                            text: this.props.route.params.name,
                            style: {
                                fontSize: 22,
                                fontWeight: 'bold',
                                fontFamily: 'Fonts.Lato',
                                color: 'white'
                            }
                        }}
                        // rightComponent={{ icon: 'export', type: 'entypo', color: '#fff', underlayColor: '#3488C0', onPress: () => { } }}
                    />

                    <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-around' }}>
                                {/* time&icon */}
                        <View style={{ flex: 1, paddingTop:10, marginHorizontal:30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <View>
                                <Text style={{fontSize:18}}>{time.nowMin}:{time.nowSec}/{time.totalMin}:{time.totalSec}</Text>
                            </View>
                                {/* play&pause icon */}
                            <View>
                                {
                                play ?
                                    <Icon name='controller-paus' type='entypo' size={25} color="black" onPress={this._pause}/>
                                     :
                                    <Icon  name='controller-play' type='entypo' size={30} color="black" onPress={this._play}/>
                                }
                            </View>
                        </View>
                                {/* Slider */}
                        <View style={{ flex: 1, paddingHorizontal:10, justifyContent: 'space-around'}}>
                            <Slider                      
                                // disabled //禁止滑动
                                maximumTrackTintColor={'#ccc'} //右侧轨道的颜色
                                minimumTrackTintColor={'skyblue'} //左侧轨道的颜色
                                maximumValue={this.state.maximumValue} //滑块最大值
                                minimumValue={0} //滑块最小值
                                value={this.state.seconds}
                                onSlidingComplete={(value) => { //用户完成更改值时调用的回调（例如，当滑块被释放时）
                                    value = parseInt(value);
                                    this._getNowTime(value)
                                    // 设置播放时间
                                    whoosh.setCurrentTime(value);
                                }} />
                        </View>
                    </View>
                    
                    <View >
                        {/* <Text style={{textAlign:'center', fontSize:20, fontWeight:"bold", padding:30}}>Network Error!!!</Text> */}
                        <Text style={{textAlign:'center', marginTop:30, fontSize:15, color:"grey"}}>pull down to refresh</Text>
                    </View>   

                        {/* {isLoading && 
                            (
                            <ActivityIndicator
                                style={{ height: 80 }}
                                color="#C00"
                                size="large"
                            />
                            )}   */}
                  
                  </View>
                 </ ScrollView>
            );
        }
    }
}