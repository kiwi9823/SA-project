import React, { Component } from 'react'

import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { Header } from 'react-native-elements';
import { CheckBox } from 'react-native-elements'
import { Input, Icon } from 'react-native-elements';
import { Button } from 'react-native-elements';
import Overlay from 'react-native-modal-overlay';
import { DrawerActions, useNavigation } from '@react-navigation/native';



class Inputs extends Component {

    state = {
        email: '',
        password: '',
    }
    handleEmail = (text) => {
        this.setState({ email: text })
    }
    handlePassword = (text) => {
        this.setState({ password: text })
    }

    handleIntro = (text) => {
        this.setState({ intro: text })
    }

    register = (email, pass) => {
        const { navigation } = this.props;
        alert('email: ' + email + '\npassword: ' + pass)
        navigation.navigate('歷史紀錄');
    }

    state = {
        modalVisible: true,
    }

    onClose = () => this.setState({ modalVisible: false });

    render() {
        // DrawerActions.setDrawerLockMode(DrawerActions.LOCK_MODE_LOCKED_CLOSED);

        return (
            <View style={styles.container}>
                <Overlay visible={this.state.modalVisible} onClose={this.onClose} closeOnTouchOutside>
                    <Icon
                        name='book-open'
                        type='feather'
                        color='black' />
                    <Text h4>Instructions</Text>

                </Overlay>

                <Header
                    backgroundColor='transparent'
                    containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
                    // leftComponent={{
                    //     icon: 'menu', type: 'entypo', color: '#fff', underlayColor: '#3488C0',
                    //     onPress: () => navigation.dispatch(DrawerActions.openDrawer())
                    // }}

                    centerComponent={{
                        text: '註冊頁面',
                        style: {
                            fontSize: 20,
                            fontWeight: 'bold',
                            fontFamily: 'Fonts.Lato',
                            color: 'white'

                        }
                    }}
                // rightComponent={{ icon: 'mic', type: 'entypo', color: '#fff', underlayColor: '#3488C0', onPress: () => { } }}
                />

                <Input
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder='email@address.com'
                    placeholderTextColor="#ccc"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onChangeText={this.handleEmail}
                    leftIcon={
                        <Icon
                            name='email'
                            type='fontisto'
                            color='black' />
                    }
                    errorStyle={{ color: 'red' }}
                    errorMessage='ENTER A VALID EMAIL HERE'
                />

                <Input
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="PASSWORD"
                    placeholderTextColor="#ccc"
                    autoCapitalize="none"
                    returnKeyType="next"
                    secureTextEntry={true}
                    onChangeText={this.handlePassword}
                    leftIcon={
                        <Icon
                            name='passport'
                            type='fontisto'
                            color='black' />
                    }
                    errorStyle={{ color: 'red' }}
                    errorMessage='AT LEAST 6 WORDS OR NUMBERS '
                />

                <CheckBox
                    title='商務會議'
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={this.state.checked}
                    onPress={() => this.setState({ checked: !this.state.checked })} />
                <CheckBox
                    title='校園會議'
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={this.state.checked}
                    onPress={() => this.setState({ checked: !this.state.checked })} />

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={
                        () => this.register(this.state.email, this.state.password)
                    }>
                    <Text style={styles.submitButtonText}>確認資料</Text>
                </TouchableOpacity>

            </View>
        )
    }
}
export default Inputs

const styles = StyleSheet.create({
    container: {
        paddingTop: 23
    },
    input: {
        margin: 15,
        paddingLeft: 8,
        height: 40,
        borderColor: '#eeeeee',
        borderWidth: 1
    },
    submitButton: {
        backgroundColor: '#7a42f4',
        padding: 10,
        alignItems: 'center',
        margin: 15,
        height: 40,
    },
    submitButtonText: {
        color: 'white'
    }
})