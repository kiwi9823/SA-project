import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity ,BackHandler} from 'react-native';
import { Header, Slider } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';

import Sound from 'react-native-sound'
import { DrawerActions, useNavigation } from '@react-navigation/native';
import WordFile,{helper} from './wordfile';

let whoosh;

// helper("sdfsd");
export default class App extends Component {


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
            resume: false
        }

    }
    componentDidMount() {
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

    }
    componentWillUnmount() {
        this.time && clearTimeout(this.time);

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
    render() {

        let time = this.state;
        const { navigation } = this.props;
        let { play, pause } = this.state;
        return (
            <View style={{ flex: 1 }} >

                <Header
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
                    rightComponent={{ icon: 'export', type: 'entypo', color: '#fff', underlayColor: '#3488C0', onPress: () => { } }}
                />
                <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-around' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
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
                    <View>


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
                    <WordFile />
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