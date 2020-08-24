import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { Header } from 'react-native-elements';
import { CheckBox } from 'react-native-elements'
import { Input, Icon } from 'react-native-elements';
import { Button } from 'react-native-elements';
import Overlay from 'react-native-modal-overlay';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { sha256 } from 'react-native-sha256';



class Inputs extends Component {
    constructor(props) {
 
        super(props)
     
        this.state = {
     
          TextInputEmail: '',
          TextInputPassword: '',
          //inputText: '',
          text: '',
        }
     
    }
    /*state = {
        email: '',
        password: '',
        text: '',
    }
    handleEmail = (text) => {
        this.setState({ email: text })
    }
    handlePassword = (text) => {
        this.setState({ password: text })
    }*/

    convertSHA(){
        //Encode SHA256 
        sha256(this.state.TextInputPassword).then(hash => {
          this.setState({ text:hash })
        });
    }

    signin = (TextInputEmail, TextInputPassword ) => {
        alert('email: ' + TextInputEmail + '\npassword: ' + TextInputPassword)
        const { navigation } = this.props;
        navigation.navigate('歷史紀錄');
        
        //const { TextInputEmail }  = this.state ;
        //const { TextInputPassword }  = this.state ;
        let formData = new FormData();
        formData.append('Email', TextInputEmail);
        //formData.append('Password', TextInputPassword);
        //formData.append('Password', sha256);
        fetch(`http://140.115.81.199:9943/PassGet`,
        {
           method: 'POST',
           headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
           },
           body: formData
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
        

    }

    regis = () => {
        const { navigation } = this.props;
        navigation.navigate('註冊頁面');
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
                        text: '登入',
                        style: {
                            fontSize: 18,
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
                    //onChangeText={this.handleEmail}
                    leftIcon={
                        <Icon
                            name='email'
                            type='fontisto'
                            color='black' />
                    }
                    errorStyle={{ color: 'red' }}
                    errorMessage='ENTER A VALID EMAIL HERE'
                    onChangeText={TextInputEmail => this.setState({TextInputEmail})}
                    value={this.state.TextInputEmail}
                />

                <Input
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="PASSWORD"
                    placeholderTextColor="#ccc"
                    autoCapitalize="none"
                    returnKeyType="next"
                    secureTextEntry={true}
                    //onChangeText={this.handlePassword}
                    leftIcon={
                        <Icon
                            name='passport'
                            type='fontisto'
                            color='black' />
                    }
                    errorStyle={{ color: 'red' }}
                    errorMessage='AT LEAST 6 WORDS OR NUMBERS '
                    onChangeText={TextInputPassword => this.setState({ TextInputPassword })}
                    value={this.state.TextInputPassword}
                />

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={
                        () => this.signin(this.state.TextInputEmail, this.state.TextInputPassword)
                    }>
                    <Text style={styles.submitButtonText}>Sign in</Text>
                </TouchableOpacity>
                <Button
                    title="沒有帳號? 註冊一個"
                    type="clear"
                    //onPress={() => navigation.navigate('註冊頁面')}
                    onPress={
                        () => this.regis()
                    }

                />

                <Text>'Please insert any value to convert in SHA 256'</Text>
                <TouchableOpacity
                    style={styles.button}
                    title="Conver sh5"
                    //onPress={this.convertSHA.bind(this)}
                    onPress={()=> this.convertSHA()}
                >
                  <Text>Conver to SHA 256</Text>
                </TouchableOpacity>
                <Text style={styles.textStyle}>{this.state.text}</Text>

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