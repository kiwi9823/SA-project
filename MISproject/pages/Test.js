import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity ,BackHandler} from 'react-native';
import { Header, Slider, Input, Button} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { BottomNavigation } from 'react-native-paper';

import Sound from 'react-native-sound'
import { DrawerActions, useNavigation } from '@react-navigation/native';

let whoosh;

// helper("sdfsd");
export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            //音檔
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
            //文字
            summ: [],
            summ_data:[],
            trans: [],
            isLoading: true,
            // hasPermission: undefined
        }
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
        })
        backAction = async () => {
            this.props.navigation.navigate('歷史紀錄');
            this.setState({
                play:false,
                pause: false,
                resume: false,
                nowMin: 0,
                nowSec: 0,
                seconds: 0
            })
            clearInterval(this.time);
           
            console.log("pause"+this.state.resume)
            whoosh.pause();
        };
        BackHandler.addEventListener("hardwareBackPress", backAction);

            //文件
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

        const response = await fetch('https://gist.githubusercontent.com/kiwi9823/2cf7242d8f10b04e77aa72acd246462e/raw/c9349c048340d82777f885cbeda8b9f1f1794907/test.json')
        .then(response => {
            console.log(response.status);
        })
        .then(result => {
            console.log("response.status");
        });
        const json = await response.json();
        //Transcript
        const transSTR = JSON.stringify(json.transcript);
        const transData = transSTR.slice(1,-1); // console.log(transData.slice(1,-1));
        //Summary
        const summSTR = JSON.stringify(json.transcript);
        const summData = summSTR.slice(1,-1); // console.log(transData.slice(1,-1));
        this.setState({ summ: json.summary, summ_data: summData,trans: transData, isLoading:false });
    }

    componentWillUnmount() {
        this.time && clearTimeout(this.time);
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
        index: 0,
        routes: [
          { key: 'music', title: 'Music', icon: 'queue-music', color: "#BADA55" },
          { key: 'albums', title: 'Albums', icon: 'album', color: "tomato" },
          { key: 'recents', title: 'Recents', icon: 'history', color: "brown" },
        ],
    }
    _onRefresh = () => {
      this.setState({ refreshing: true });
      this.componentDidMount().then(() => {
          this.setState({ refreshing: false });
      });
    }

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
                    } else {
                        console.log('fail - 播放失败')
                    }
                })
    
            });
    
            console.log("play" + url);
        }else{
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
    MusicRoute = () => {return(<Text>Music</Text>);}

    AlbumsRoute = () => {return(<Text>Albums</Text>);}
    
    RecentsRoute = () => {return(<Text>Recents</Text>);}


    
      _handleIndexChange = index => this.setState({ index });
    
      _renderScene = BottomNavigation.SceneMap({
        music: this.MusicRoute(),
        albums: this.AlbumsRoute(),
        recents: this.RecentsRoute(),
      });

  

    render() {

        let time = this.state;
        const { navigation } = this.props;
        let { play, pause } = this.state;
        const { isLoading } = this.state; //文件
        return (
            <View style={{ flex: 1 }} >
                <Header
                    placement="left"
                    backgroundColor='transparent'
                    containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
                    leftComponent={{
                        icon: 'menu', type: 'entypo', color: '#fff', underlayColor: '#3488C0',
                        onPress: () => navigation.dispatch(DrawerActions.openDrawer())
                    }}

                    centerComponent={{
                        text: this.props.route.params.name,
                        style: {
                            fontSize: 20,
                            fontWeight: 'bold',
                            fontFamily: 'Fonts.Lato',
                            color: 'white'
                        }
                    }}
                    // rightComponent={{ icon: 'export', type: 'entypo', color: '#fff', underlayColor: '#3488C0', onPress: () => { } }}
                />
                <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-around' }}>
                    <View style={{ flex: 2,flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View>
                            <Text>{time.nowMin}:{time.nowSec}/{time.totalMin}:{time.totalSec}</Text>
                        </View>
                        {/* play&pause icon */}
                        <View>{
                            play ?
                                <TouchableOpacity
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 50,
                                        height: 50,
                                        backgroundColor: 'black',
                                        borderRadius: 10,
                                    }}
                                    onPress={this._pause}

                                // onPress= {this.onPress(this,'foo')}
                                >
                                    <Icon name={"pause"} size={25} color="white" />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 50,
                                        height: 50,
                                        backgroundColor: 'black',
                                        borderRadius: 10,
                                    }}

                                    onPress={this._play}
                                >
                                    <Icon name={"play"} size={25} color="white" />
                                </TouchableOpacity>
                        }
                        </View>
                    </View>
                    <View style={{ flex: 1}}>
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
                <View style={{ flex: 4, backgroundColor: 'white' }}>

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
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});