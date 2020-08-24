import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet} from 'react-native'
import { Header } from 'react-native-elements';
import { CheckBox } from 'react-native-elements'
import { Input,Icon } from 'react-native-elements';
import { Button } from 'react-native-elements';
//import Overlay from 'react-native-modal-overlay';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { sha256 } from 'react-native-sha256';

class Inputs extends React.Component {
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
   }
   handleEmail = (text) => {
      this.setState({ email: text })
   }
   handlePassword = (text) => {
      this.setState({ password: text })
   }*/

   
   /*async componentDidMount(){
      const { TextInputEmail }  = this.state ;
      const { TextInputPassword }  = this.state ;
      let formData = new formData();
      formData.append('Email',TextInputEmail);
      formData.append('Password',TextInputPassword);
      //formData.append('Email','myemail@gmail.com');
      //formData.append('Password','mypassword');
      try{
         await fetch('http://140.115.81.199:9943/signUp',
         {
            method: 'POST',
            //mode: 'no-cors',
            headers:{
               'Accept': 'application/json',
               'Content-Type': 'multipart/form-data',
            },
            body: formData
         })
      }catch(e){
         console.log(e);
      }
   }*/
   uploadData(){
      const { TextInputEmail }  = this.state ;
      //const { TextInputPassword }  = this.state ;
      const{ text } = this.state ;

      let formData = new FormData();
      formData.append('Email', TextInputEmail);
      //formData.append('Password', TextInputPassword);
      formData.append('Password', text);
      fetch(`http://140.115.81.199:9943/signUp`,
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

  convertSHA(){
   //Encode SHA256 
   sha256(this.state.TextInputPassword).then(hash => {
     this.setState({ text:hash })
   });
  }

  /* 
   register = (email, pass) => {
      const { navigation } = this.props;
      alert('email: ' + email + '\npassword: ' + pass)
      navigation.navigate('歷史紀錄');
   }
   */
   InsertDataToServer = () =>{
 
      /*
      const { TextInputEmail }  = this.state ;
      const { TextInputPassword }  = this.state ;
      
      
      
     fetch('140.115.81.238/home/testDB/submit_user_info.php', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
      
         email: TextInputEmail,
      
         password: TextInputPassword
      
       })
      
     }).then((response) => response.json())
           .then((responseJson) => {
      
     // Showing response message coming from server after inserting records.
             Alert.alert(responseJson);
      
           }).catch((error) => {
             console.error(error);
           });*/

         const { navigation } = this.props;
         navigation.navigate('歷史紀錄');
      
       }
      

   state = {
      modalVisible: true, 
    }

   onClose = () => this.setState({ modalVisible: false});
    
   render() {

      return (
         <View style = {styles.container}>

            <Header
               leftComponent={{ icon: 'menu', color: '#fff' }}
               centerComponent={{ text: '註冊', style: { fontSize: 18, color: '#fff' } }}
               rightComponent={{ icon: 'home', color: '#fff' }}/>

            <Input 
               style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder='email@address.com'
               placeholderTextColor = "#ccc"
               autoCapitalize = "none"
               keyboardType = "email-address"
               returnKeyType = "next"
               //onChangeText = {this.handleEmail}
               onChangeText={TextInputEmail => this.setState({TextInputEmail})}
               //value={this.state.TextInputEmail}

               leftIcon={
               <Icon
                   name='email'
                   type='fontisto'
                   color='black'/>
               }
               errorStyle={{ color: 'red' }}
               errorMessage='ENTER A VALID EMAIL HERE'
                />

            <Input 
               style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "PASSWORD"
               placeholderTextColor = "#ccc"
               autoCapitalize = "none"
               returnKeyType = "next"
               secureTextEntry = {true}
               //onChangeText = {this.handlePassword}
               onChangeText={TextInputPassword => this.setState({ TextInputPassword })}
               value={this.state.TextInputPassword}

               leftIcon={
                <Icon
                    name='passport'
                    type='fontisto'
                    color='black'/>
                }
               errorStyle={{ color: 'red' }}
               errorMessage='AT LEAST 6 WORDS OR NUMBERS '
            />
          
           <CheckBox
               title='商務會議'
               checkedIcon='dot-circle-o'
               uncheckedIcon='circle-o'
               checked={this.state.checked}
               onPress={() => this.setState({checked: !this.state.checked})}/>
           <CheckBox
               title='校園會議'
               checkedIcon='dot-circle-o'
               uncheckedIcon='circle-o'
               checked={this.state.checked}
               onPress={() => this.setState({checked: !this.state.checked})}/>

            <TouchableOpacity
               style = {styles.submitButton}
               onPress = {
                  //() => this.register(this.state.email, this.state.password)
                  this.InsertDataToServer}>
               <Text style = {styles.submitButtonText}>送出註冊資料</Text>
            </TouchableOpacity>

            
            <TouchableOpacity
               style = {styles.submitButton}
               onPress={()=> this.uploadData()}
               >
               <Text style = {styles.submitButtonText}>測試post</Text>
            </TouchableOpacity>
            
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
      paddingLeft:8,
      height: 40,
      borderColor: '#eeeeee',
      borderWidth: 1
   },
   submitButton: {
      backgroundColor: '#7a42f4',
      padding: 10,
      alignItems:'center',
      margin: 15,
      height: 40,
   },
   submitButtonText:{
      color: 'white'
   }
})

//To-do list: 
//第一頁email,pw alert(可參照input下面的style explanation)
//註冊模組: +Firebase(不用，存到server的db即可)
//第一頁instruction(可用overlay)
//切換頁面功能
//第二頁面進入錄音介面(含建立錄音檔)
//第二頁下拉式選單
//yarn add react-native-modal-overlay
/*<Overlay visible={this.state.modalVisible} onClose={this.onClose} closeOnTouchOutside>
               <Icon
                   name='book-open'
                   type='feather'
                   color='black'/>
               <Text h4>Instructions</Text>
            </Overlay>*/
//() => this.register(this.state.email, this.state.password)