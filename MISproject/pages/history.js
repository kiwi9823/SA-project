import React, { Component, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, ScrollView, RefreshControl, BackHandler } from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { ListItem, Header, Icon } from 'react-native-elements'
import RNFS from 'react-native-fs';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AudioUtils } from 'react-native-audio';
// import { ScrollView } from 'react-native-gesture-handler';

import Upload from 'react-native-background-upload'



const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}



export default class history extends Component {

    state = {
        response: [],
        refreshing: false,

    }
    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.ReadDir().then(() => {
            this.setState({ refreshing: false });
        });
    }



    componentDidMount() {


        backAction = async () => {
            this.props.navigation.navigate('歷史紀錄');
        };
        BackHandler.addEventListener("hardwareBackPress", backAction);
        this.ReadDir();
    }

    // 读取目录
    async ReadDir() {

        await RNFS.readDir(AudioUtils.DocumentDirectoryPath)
            .then((result) => {

                var reg = new RegExp("^.*awb.*$");

                let output = [];


                if (result && result.length > 0) {

                    for (let i = 0; i < result.length; i++) {

                        if (reg.test(result[i].name)) {
                            console.log(result[i].name);
                            // console.log(result[i].path);
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


    //沒有CONTENT TYPE
    _upload(datas, filename) {


        //let filename = this.filenames;
        
        let name = "testClient"
        let formData = new FormData();
        // let filename = datas;
        formData.append('userName', name)
        // formdata.append('userName',name)
        formData.append('file', { uri: `file://${datas}`, name: filename, type: 'multipart/form-data' })
        //之後要抓使用者名稱

        fetch(`http://140.115.81.199:9943/audioUpload/${name}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            })
            .then(response => {
                console.log(response.status);
            })
            .then(result => {
                console.log("success", result)
                fetch(`http://140.115.81.199:9943/bucketUpload/${name}/${filename}`,
                    {
                        method: 'POST',
                        // headers: {
                        //     Accept: 'application/json',
                        //     'Content-Type': 'multipart/form-data'
                        // },
                        // body: formData
                    })
                    .then(response => {
                        console.log(response.status);
                    })
                    .then(result => {
                        console.log("success", result)
                        fetch(`http://140.115.81.199:9943/textDown/${name}/${filename}`,
                            {
                                method: 'POST',
                                // headers: {
                                //     Accept: 'application/json',
                                //     'Content-Type': 'multipart/form-data'
                                // },
                                // body: formData
                            })
                            .then(response => {
                                console.log(response.status);
                            })
                            .then(result => {
                                console.log("success", result)
                                fetch(`http://140.115.81.199:9943/snowDown/${name}/${filename}`,
                                    {
                                        method: 'POST',
                                    })
                                    .then(response => {
                                        console.log(response.status);
                                    })
                                    .then(result => {
                                        console.log("success", result)
                                    })
                                    .catch(error => {
                                        console.log("error", error)
                                    })
                            })
                            .catch(error => {
                                console.log("error", error)
                            })
                    })
                    .catch(error => {
                        console.log("error", error)
                    })
            })
            .catch(error => {
                console.log("error", error)
            })
    }


    render() {
        let { response } = this.state;
        const { navigation } = this.props;

        return (
            <View style={{ flex: 1 }} >

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
                    < ScrollView refreshControl={
                        < RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />}>
                        {/* <ScrollView> */}
                        < View >
                            {
                                response.map((l, i) => (
                                    <ListItem
                                        key={i}
                                        leftIcon={{ name: 'mic' }}
                                        title={l.name}
                                        subtitle={l.subtitle}
                                        bottomDivider
                                        rightIcon={{
                                            name: 'cloud-upload-outline',
                                            type: 'ionicon',
                                            onPress: () => this._upload(l.path, "pythontest")
                                        }}
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
                                ))
                            }
                            {/* <Button title="read"
                        onPress={() => this.ReadDir()} /> */}

                        </View >
                    </ScrollView >

                </View >

                {/* Footer */}
                < View style={{ flex: 1, backgroundColor: '#E8E8E8' }
                }>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon raised name='controller-record' type='entypo' color='red'
                            onPress={() => navigation.navigate('錄音', { record: 0 })}
                        />
                    </View>
                </View >

            </View >


        )
    }

}