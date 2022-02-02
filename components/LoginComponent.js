import { Icon } from 'react-native-eva-icons'

import React, { Component } from 'react';
import { View, Text, ImageBackground, TextInput, Pressable } from 'react-native';
import styles from '../styles/loginStyles'

const corsURI = 'https://morning-journey-78874.herokuapp.com/'
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

class LoginScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userInfo: {
        password: '',
        email: '',    
        username: '',
      },
      isUserAuth: false,
      isDataLoading: false,
    }
    this.onChangeText = this.onChangeText.bind(this);
    this.submitButton = this.submitButton.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  }

  loadingIcon() {
    if (this.state.isDataLoading) {
      return  <Icon name='loader-outline' animation='pulse' width={25} height={25}></Icon>// <Text>Loading...</Text>
    } else {
      return <></>
    }
  }

  onChangeText(textField) {
    function setField(text) {
      this.setState( { userInfo: { ...this.state.userInfo, [textField] : text}} )
    }
    setField = setField.bind(this);
    return setField
  }

  submitButton(sign) {
    const signIn = sign == 'signin'
    return(
      <Pressable onPress={signIn ? this.onSignIn : this.onSignUp} style={[styles.login.button]}>
        <Text style={styles.login.buttonLabel}>{ signIn ? 'Entrar' : 'Cadastrar-se' }</Text>
      </Pressable>
    )
  }

  async onSignIn() {

    console.log('SIGNIN STATUS: started...')
    var info = this.state.userInfo;
    this.setState({ isDataLoading: true });

    try {

      var UsersResult = await fetch(corsURI + appServerURI + 'Users', { method: 'GET' });
      const UsersStatus = 'Status: ' + UsersResult.status + ', ' + UsersResult.statusText
      if (UsersResult.ok) {
        console.log('fetch GET request for users data at signin successful.');
        console.log(UsersStatus)
      } else {
        console.log('fetch GET request for users data at signin failed. Throwing error...')
        throw new Error(UsersStatus)
      }

      const Users = await UsersResult.json();
      const user = Users.filter((user) => user.email === info.email)[0]
      
      if ( user ) {          
        
        if (user.password === info.password) {
          const userInfo = { ...info, username: info.email.split('@')[0]}
          this.setState( {isUserAuth: true, userInfo} )
          console.log('SIGNIN STATUS: Sucesso.')

        } else {
          const errMsg = 'Senha incorreta.'
          alert(errMsg) ; console.log('SIGNIN STATUS: ' + errMsg)
        }

      } else {
        const errMsg = 'Email não cadastrado.'
        alert(errMsg) ; console.log('SIGNIN STATUS: ' + errMsg)
      }

    } catch (error) {
      alert('Erro no servidor. Tente novamente.')
      console.log('Error catched in fetch GET request for users data at  signin. Printing Error...')
      console.log('SIGNIN STATUS:' + 'Erro capturado. Imprimindo erro...')
      console.log(error);

    } finally {
      console.log('SIGNIN STATUS: Concluido.')
      this.setState({ isDataLoading: false });
      if (this.state.isUserAuth) this.props.authUser(this.state.userInfo)        // Father class component method that authenticates the user and redirects to entrances screen.
    }
  }

  async onSignUp() {

    console.log('SIGNUP STATUS: started...')
    var info = this.state.userInfo;
    this.setState({ isDataLoading: true });
    
    try {
      var UsersResult = await fetch( corsURI + appServerURI + 'Users', { method: 'GET' } );
      
      const reqStatus = 'Status: ' + UsersResult.status + ', ' + UsersResult.statusText
      if (UsersResult.ok) {
        console.log('fetch GET request for users data at signup successful.')
        console.log(reqStatus)
      } else {
        console.log('fetch GET request for users data at signup failed. Throwing error...')
        throw new Error(reqStatus)
      }

      const Users = await UsersResult.json();
      const User = Users.filter((user) => user.email === info.email)[0]
      var postUserResult = {ok: false}
      if ( !User ) {

        info.username = info.email.split('@')[0]
        const postUserOpts = { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify( { entries: [], ...info } )
        }
        
        postUserResult = await fetch( corsURI + appServerURI +  'Users/' + info.username, postUserOpts );
        const postUserStatus = 'Status: ' + postUserResult.status + ', ' + postUserResult.statusText

        if (postUserResult.ok) {
          console.log('fetch POST request for user data at signup successful.')
          console.log(postUserStatus)
          const successMsg = 'Cadastro realizado com sucesso!'
          console.log('SING UP STATUS: ' + successMsg)
          alert(successMsg)

        } else {
          console.log('fetch POST request for user data at signup failed. Throwing error...')
          throw new Error(postUserStatus)
        }

      } else { // ready to post user info and create new user account.
        const errMsg = 'Email já cadastrado.'
        console.log('SING UP STATUS: ' + errMsg)
        alert(errMsg)
      }

    } catch (error) {
      console.log('SING UP STATUS: Erro capturado. Imprimindo erro...')
      console.log(error);
      alert('Erro no servidor, não foi possível realizar o cadastro. Por favor, tente novamente.')

    } finally {
      this.setState({ isDataLoading: false })
      console.log('SING UP STATUS: Concluido.')
      if (postUserResult.ok)  this.onSignIn()
    }
  }

  render() {

    return(
      <ImageBackground source={require('../assets/wallpaper.jpg')} style={[styles.login.mainView]}>
        <View style={{alignContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center'}}>Mood Tracker</Text>        
        </View>
        <View style={styles.login.card}>
          <Text style={styles.login.cardHeader}>Entrar</Text>
          <View style={styles.login.cardSection}>
            <TextInput placeholder='Email' onChangeText={this.onChangeText('email')} style={styles.login.inputField}></TextInput>
            <TextInput placeholder='Senha' onChangeText={this.onChangeText('password')} style={styles.login.inputField}></TextInput>
          </View>
          <View style={styles.login.cardSection}>
            {this.submitButton('signin')}
            {this.submitButton('signup')}
          </View>
          <View style={styles.login.cardSection}>
            {this.loadingIcon()}
          </View>
        </View>
      </ImageBackground>
    )
  }
}

export default LoginScreen;