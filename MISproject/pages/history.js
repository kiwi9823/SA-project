import React, { Component, useEffect } from 'react';
// import { Provider as PaperProvider } from 'react-native-paper';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, ScrollView, RefreshControl, BackHandler } from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { ListItem, Header, Icon } from 'react-native-elements'
import RNFS from 'react-native-fs';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AudioUtils } from 'react-native-audio';
// import { ScrollView } from 'react-native-gesture-handler';

import SSHClient from 'react-native-ssh-sftp';

// const wait = (timeout) => {
//     return new Promise(resolve => {
//         setTimeout(resolve, timeout);
//     });
// }

// let client = new SSHClient('140.115.81.243', 22, 'client', 'qwerty', (error) => {
//     if (error)
//         console.warn(error);
//     else {
//         console.log("ok");
//     }
// });
// try {
//     client.connectSFTP();
// } catch (err) {
//     console.log(err)
// }


// ReadDir();


// backAction = async () => {

//   };
// useEffect(() => {
//     BackHandler.addEventListener("hardwareBackPress",backAction);
//     return () => {
//         BackHandler.removeEventListener("hardwareBackPress",backAction);
//     };
// }, [])

// const backHandler = BackHandler.addEventListener(
//     "hardwareBackPress",
//     backAction
// );




export default class history extends Component {




    // a =this.props.route.params.reload;
    // console.log()


    state = {
        response: [],

    }
    //    componentWillMount() {

    //     } 
    // componentWillUnmount() {
    //     BackHandler.removeEventListener("hardwareBackPress",backAction);
    // }


    componentDidMount() {
      

        backAction = async () => {
            this.props.navigation.navigate('歷史紀錄');
            
            // Alert.alert("警告", "確定要離開這個可愛的APP嗎?", [
            //     {
            //         text: "Cancel",
            //         onPress: () => null,
            //         style: "cancel"
            //     },
            //     { text: "YES", onPress: () => BackHandler.exitApp() }
            // ]);
            // return true;
        };
        BackHandler.addEventListener("hardwareBackPress", backAction);
        this.ReadDir();
    }

    // 读取目录
    async ReadDir() {

        await RNFS.readDir(AudioUtils.DocumentDirectoryPath)
            .then((result) => {

                var reg = new RegExp("^.*aac.*$");

                let output = [];


                if (result && result.length > 0) {

                    for (let i = 0; i < result.length; i++) {

                        if (reg.test(result[i].name)) {
                            console.log(result[i].name);
                            console.log(result[i].path);
                            let obj = { 'name': result[i].name, 'path': result[i].path };

                            output.push(obj);
                            // console.log(output[file_c].name);

                        }
                    }
                    this.setState({
                        response: output
                    })

                }
            })

            .catch((err) => {
                console.log("錯誤" + err.message + err.code);
            });

    }


    //删除文件
    async deleteFile(filePath) {

        const path = filePath;
        const res = await RNFS.unlink(path)
            .then(() => {

                console.log('FILE DELETED');
                this.ReadDir();
            })
            .catch((err) => {
                console.log(err.message);
            })
        return res;
    }

    render() {
        let { response } = this.state;
        const { navigation } = this.props;
        // var refresh_h = this.props.route.params.reload;
        // const [refreshing, setRefreshing] = React.useState(false);

        // const onRefresh = React.useCallback(() => {
        //     setRefreshing(true);

        //     wait(2000).then(() => setRefreshing(false));
        // }, []);







        return (
            <View style={{ flex: 1 }}>

                {/* Header&Body */}
                < View style={{ flex: 7, backgroundColor: 'white' }}>
                    {/* <View style={{ flex: 1, }}>                     */}
                    < Header
                        backgroundColor='transparent'
                        containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
                        leftComponent={{
                            icon: 'menu', type: 'entypo', color: '#fff', underlayColor: '#3488C0',
                            onPress: () => navigation.dispatch(DrawerActions.openDrawer())
                        }}

                        centerComponent={{
                            text: '歷史錄音',
                            style: {
                                fontSize: 20,
                                fontWeight: 'bold',
                                fontFamily: 'Fonts.Lato',
                                color: 'white'

                            }
                        }}
                    // rightComponent={{ icon: 'mic', type: 'entypo', color: '#fff', underlayColor: '#3488C0', onPress: () => { } }}
                    />
                    {/* <ScrollView refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }  > */}
                    <ScrollView>
                        <View>
                            {
                                response.map((l, i) => (
                                    <ListItem
                                        key={i}
                                        // play-circle-filled
                                        leftIcon={{ name: 'mic' }}
                                        title={l.name}
                                        subtitle={l.subtitle}
                                        bottomDivider
                                        rightIcon={{ name: 'delete' }}
                                        onPress={() => navigation.navigate('播放', { url: l.path, time: 5, name: l.name })}
                                        onLongPress={() => {

                                            Alert.alert(
                                                "提醒",
                                                "確定要刪除嗎",
                                                [
                                                    {
                                                        text: "確定",
                                                        onPress: () => this.deleteFile(l.path),
                                                        style: "cancel"
                                                    },
                                                    { text: "沒有", onPress: () => console.log("OK Pressed") }
                                                ],
                                                { cancelable: false }
                                            );
                                        }}
                                    />
                                    // this.state.currentTime
                                ))
                            }
                            <Button title="read"
                                onPress={() => this.ReadDir()} />

                        </View>
                    </ScrollView>

                </View >

                {/* Footer */}
                < View style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon raised name='controller-record' type='entypo' color='red'
                            onPress={() => navigation.navigate('錄音')}
                        />
                    </View>
                </View >

            </View >


        )
    }

}