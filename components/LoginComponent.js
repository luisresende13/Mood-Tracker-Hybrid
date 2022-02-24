// import Icon from 'react-native-vector-icons/FontAwesome';
// import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'react-native-eva-icons'
// import { WiDaySunny } from "weather-icons-react";

import React, { Component } from 'react';
import { View, Text, ImageBackground, TextInput, Pressable, Platform, ActivityIndicator, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

import styles from '../styles/loginStyles'
const defaultEmotions = require('../shared/emotionsConfig')
const Imgs = require('../shared/unsplash_imgs.json')
// console.log(Imgs)

// App server connection settings
const corsURI = Platform.OS == 'web' ? 'https://morning-journey-78874.herokuapp.com/' : ''
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

// Email Validation settings

// const Verifier = require('email-verifier')
const emailVerification_APIKEY = "at_TPKXmSQnStekLzTbstLO9GyHvd7or"
// let verifier = new Verifier(emailVerification_APIKEY);
const emailVerification_APIURI = (emailAddress) => `https://emailverification.whoisxmlapi.com/api/v2?apiKey=${emailVerification_APIKEY}&emailAddress=${emailAddress}`
const falseParams = ['validateDNS', 'checkCatchAll', 'checkFree', 'checkDisposable']
function appendValueToUri(uri, params, value) {
  for (let param of params) {
    uri += '&' + param + '=' + value
  }
  return uri
}

async function validateEmail(email) {

  console.log('EMAIL VERIFICATION STATUS: Fetching email verification api...')

  try {

    var uri = emailVerification_APIURI(email)
    uri = appendValueToUri(uri, falseParams, '0')
    var emailStatus = {ok: false, status: 'Email não verificado.'}
    const apiResp = await fetch( uri , { method: 'GET' } )
  
    if (apiResp.ok) {
  
      console.log('EMAIL VERIFICATION STATUS: Api fetch request successful.')
      const apiRespJson = await apiResp.json()
  
      if ( apiRespJson.formatCheck=='false' ) {
        emailStatus.status = 'Email inválido.'
      } else if ( apiRespJson.smtpCheck=='false' ) {
        emailStatus.status = 'Email não existe.'
      } else {
        emailStatus = {ok: true, status: 'Email válido.'}
      }
      
      return emailStatus
  
    } else {
      console.log('EMAIL VERIFICATION STATUS: Api fetch request failed. Throwing error...')
      throw new Error('Status: ' + apiResp.status + ', Status Text: ' + apiResp.statusText)
    }  

  } finally {
    console.log('EMAIL VERIFICATION STATUS: Concluído')

  }
  // Use the email verification api using its module...
  // verifier.verify(email, (err, data) => {
  //   if (err) throw err;
  //   console.log(data);
  // });
}

function validatePassword(password) {
  console.log('VALIDATING PASSWORD FOR SIGNUP...')

  const hasMinLength = password.length > 6
  var res
  if (!hasMinLength) {
    res = {ok: false, status: 'A senha deve ter no mínimo 6 caractéres.'}
  } else {
    res = {ok: true, status: 'Senha válida.'}
  }
  return res
}

async function registerLocallyIfUserIsNewToDevice(user) {
  var localAuthInfo = await AsyncStorage.getItem('LocalAuthenticationInfo')
  localAuthInfo = JSON.parse(localAuthInfo)  
  if ( !localAuthInfo.users.filter(localUser => localUser._id == user._id)[0] ) {
    console.log('SIGNIN STATUS: Primeiro login do usuário nesse aparelho. Adicionando informações do usuário no armazenamento local...')
    const updatedLocalAuthInfo = {
      ...localAuthInfo,
      users: [ 
        ...localAuthInfo.users,
        {
          _id: user._id,
          username: user.username,
          email: user.email,
          password: user.password,
          // settings: {
          //   backgroundColor: 'lightblue',
          //   backgroundImage: null      
          // }
        }
      ]
    }
    await AsyncStorage.setItem('LocalAuthenticationInfo', JSON.stringify(updatedLocalAuthInfo))
  } else {
    console.log('SIGNIN STATUS: Informações do usuário já registradas nesse aparelho. Pulando registro do usuário no armazenamento local...')
  } 
}

export async function keepUserConnectionAlive(userId) {
  var localAuthInfo = await AsyncStorage.getItem('LocalAuthenticationInfo')
  localAuthInfo = JSON.parse(localAuthInfo)

  console.log(`SIGNIN STATUS: Usuário optou por ${userId ? 'manter conexão ativa. Configurando conexão ativa para o usuário...' : 'desativar conexão ativa. Desativando...' }`)
  const updatedLocalAuthInfo = {
    ...localAuthInfo,
    keepConnected: {
      status: userId ? true : false,
      userId: userId
    }
  }
  await AsyncStorage.setItem('LocalAuthenticationInfo', JSON.stringify(updatedLocalAuthInfo))
}

// async function keepUserConnectionAlive(userId) {
//   var localAuthInfo = await AsyncStorage.getItem('LocalAuthenticationInfo')
//   localAuthInfo = JSON.parse(localAuthInfo)

//   console.log('SIGNIN STATUS: Usuário optou por manter conexão ativa. Configurando conexão ativa para o usuário...')
//   const updatedLocalAuthInfo = {
//     ...localAuthInfo,
//     keepConnected: {
//       status: userId ? true : false,
//       userId: userId
//     }
//   }
//   await AsyncStorage.setItem('LocalAuthenticationInfo', JSON.stringify(updatedLocalAuthInfo))
// }

class LoginScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userInfo: {
        password: '',
        email: '',
        username: '',
      },
      keepConnected: true,
      loginMsg: '',
      isUserAuth: false,
      isDataLoading: false,
    }
    this.onChangeText = this.onChangeText.bind(this);
    this.submitButton = this.submitButton.bind(this);
    this.loginMsg = this.loginMsg.bind(this);
    this.setLoginMsg = this.setLoginMsg.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.LoginScreen = this.LoginScreen.bind(this);
  }

  componentDidMount() {
    console.log('"LoginScreen" component did mount...')
    this.restoreUserToken()
  }

  componentWillUnmount() {
    console.log('"LoginScreen" component will unmount...')
  }

  LoginIcon() {  
    if (this.state.isDataLoading) {
      return <ActivityIndicator color='#000000' />
    } else {
      return <Icon name='log-in-outline' animation='pulse' fill='#000' width={30} height={30} />
    }
  }

  setLoginMsg(msg) {
    this.setState({loginMsg: msg})
    setTimeout( () => this.setState({loginMsg: ''}) , 1000 * 5 )
  }

  loginMsg() {
      return(
        <View style={[styles.login.msgBox, this.state.loginMsg ? {} : {backgroundColor: 'transparent', borderColor: 'transparent'} ]}>
          <Text style={styles.login.msg}>{this.state.loginMsg}</Text>
        </View>
      )
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
      <Pressable
      disabled={this.state.isDataLoading}
      onPress={signIn ? this.onSignIn : this.onSignUp}
      style={[styles.login.button]}
      >
        <Text style={styles.login.buttonLabel}>{ signIn ? 'Entrar' : 'Cadastrar' }</Text>
      </Pressable>
    )
  }

  LoginScreen = () => {
    var imgURI, backgroundColor
    if (this.state.isUserAuth) {
      backgroundColor = this.state.userInfo.settings.backgroundColor
      if (this.state.userInfo.settings.backgroundImage) {
        imgURI = this.state.userInfo.settings.backgroundImage.uri
      } else {
        imgURI = null
      }
    } else {
      imgURI = null
      backgroundColor = 'lightblue'     
    }

    return(
      <ImageBackground source={{uri: imgURI}} style={[styles.login.mainView ,{backgroundColor: backgroundColor, justifyContent: 'space-evenly'}]}>
        
        <View style={styles.login.titleView}>
          <Text style={styles.login.title}>Mood Tracker</Text>
        </View>

        <View style={styles.login.card}>
          <View style={styles.login.cardHeader} >
            <Text style={styles.login.cardTitle}>Entrar</Text>
          </View>
          <View style={styles.login.cardSection}>
            <TextInput
            placeholder='Email'
            textContentType='emailAddress'
            style={styles.login.inputField}
            onChangeText={this.onChangeText('email')}
            autoComplete='email'
            importantForAutofill='yes'
            >
            </TextInput>
            <TextInput
            placeholder='Senha'
            textContentType='password'
            secureTextEntry={true}
            style={styles.login.inputField}
            onChangeText={this.onChangeText('password')}
            autoComplete='password'
            importantForAutofill='yes'
            >
            </TextInput>
          </View>
          <View style={[styles.login.cardSection, {height: 138}]}>
            {this.submitButton('signin')}
            {this.submitButton('signup')}
            <View style={{flexDirection: 'row', height: 48, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'flex-end'}}>
              <Text style={{marginRight: Platform.OS=='web' ? 10 : null }}>Manter-me conectado</Text>
              <Switch
                disabled={this.state.isDataLoading}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={this.state.keepConnected ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e" 
                onValueChange={() => this.setState({keepConnected: !this.state.keepConnected})}
                value={this.state.keepConnected}
              />
            </View>
          </View>
          <View style={[styles.login.cardSection, {height: 80, justifyContent: 'center'}]}>
            {this.LoginIcon()}
          </View>
        </View>

        {this.loginMsg()}

      </ImageBackground>
    )
  }

  isInputEmpty() {
    if (!this.state.userInfo.email) {
      const errMsg = 'Insira um endereço de email.'
      this.setLoginMsg(errMsg)
      console.log('SIGNIN STATUS: ' + errMsg)
      return true
    } else if (!this.state.userInfo.password) {
      const errMsg = 'Insira uma senha.'
      this.setLoginMsg(errMsg)
      console.log('SIGNIN STATUS: ' + errMsg)
      return true
    } else return false
  }

  async restoreUserToken() {
    try {
      console.log('RESTORE USER TOKE STATUS: STARTED...')
      var localAuthInfo = await AsyncStorage.getItem('LocalAuthenticationInfo')
      
      if (localAuthInfo) {
        localAuthInfo = JSON.parse(localAuthInfo)

        console.log('RESTORE USER TOKE STATUS: LOCAL AUTH INFO ALREADY CONFIGURED.')
        // console.log(localAuthInfo)

        if (localAuthInfo.keepConnected.status) {
          console.log(`RESTORE USER TOKEN STATUS: USER CONNECTION IS ALIVE FOR USER ID: ${localAuthInfo.keepConnected.userId}. PROCEDING TO SIGNIN...`)
          const user = localAuthInfo.users.filter(user => user._id = localAuthInfo.keepConnected.userId)[0]
  
          this.setState({
            userInfo: {
              username: user.username,
              email: user.email,
              password: user.password,  
            }
          })
          this.onSignIn()
        }

        else {
          console.log('RESTORE USER TOKEN STATUS: NO USER CONNECTION ALIVE. PROCEEDING TO SIGNIN/SIGNUP ...')
        }

      } else {
        console.log('RESTORE USER TOKEN STATUS: NO LOCAL AUTH INFO CONFIGURED IN THIS DEVICE. SETTING DEVICE LOCAL AUTH INFO FOR THE FIRST TIME...')

        var DEVICE_IP_ADDRESS
        NetInfo.fetch("wifi").then(state => {
          DEVICE_IP_ADDRESS = state.details.ipAddress
          console.log("RESTORE USER TOKEN STATUS: IP ADDRESS REQUEST SUCCESSFUL. IP ADDRESS: " + DEVICE_IP_ADDRESS);
        });
        const initialLocalAuthInfo = {
          IP_ADDRESS: DEVICE_IP_ADDRESS,
          users: [],
          keepConnected: {
            status: false,
            userId: null
          }
        }
        await AsyncStorage.setItem('LocalAuthenticationInfo', JSON.stringify(initialLocalAuthInfo))
        console.log('RESTORE USER TOKEN STATUS: DEVICE LOCAL AUTH INFO CONFIGURED FOR THE FIRST TIME. PROCEEDING TO SIGNIN/SIGNUP ...')
      }

    } catch(error) {
      console.log('RESTORE USER TOKEN STATUS: ERROR. LOGGING ERROR...')
      console.log(error)
    }
  }  

  async onSignIn() {

    console.log('SIGNIN STATUS: Started...')
    var info = this.state.userInfo;
    info.email = info.email.trim()
    this.setState({ isDataLoading: true });

    try {

      if (this.isInputEmpty()) return

      var UsersResult = await fetch( corsURI + appServerURI + 'Users', { method: 'GET' });
      const UsersStatus = 'Status: ' + UsersResult.status + ', ' + 'Status Text: ' + UsersResult.statusText
      if (UsersResult.ok) {
        console.log('fetch GET request for users data at signin successful.');
        console.log(UsersStatus)
      } else {
        console.log('fetch GET request for users data at signin failed. Printing fetch response...')
        console.log(JSON.stringify(UsersResult))
        console.log('Throwing error...')
        throw new Error(UsersStatus)
      }

      const Users = await UsersResult.json();
      const user = Users.filter((user) => user.email === info.email)[0]
      
      if ( user ) {          
        
        if (user.password === info.password) {

          await registerLocallyIfUserIsNewToDevice(user)

          if (this.state.keepConnected) {
            await keepUserConnectionAlive(user._id)
          }

          this.setState( {isUserAuth: true, userInfo: user} )
          const successMsg = 'Login realizado com sucesso!'
          this.setLoginMsg(successMsg)
          console.log('SIGNIN STATUS: Sucesso.')

        } else {
          const errMsg = 'Senha incorreta.'
          this.setLoginMsg(errMsg)
          console.log('SIGNIN STATUS: ' + errMsg);
        }

      } else {
        const errMsg = 'Email não cadastrado!'
        this.setLoginMsg(errMsg)
        console.log('SIGNIN STATUS: ' + errMsg)
      }

    } catch (error) {
      const errMsg = 'Erro no servidor! Tente novamente...'
      this.setLoginMsg(errMsg)
      console.log('Error catched in fetch GET request for users data at signin. Printing Error...')
      console.log('SIGNIN STATUS:' + 'Erro capturado. Imprimindo erro...')
      console.log(error);

    } finally {
      this.setState({ isDataLoading: false });
      console.log('SIGNIN STATUS: Concluido.')
      if (this.state.isUserAuth) {
        console.log('User authenticated. Navigating to "HomeScreen"...')
        this.props.setAppState({isUserAuth: true, user: this.state.userInfo})
        // Parent class component method that authenticates the user and redirects to entrances screen.
      }
    }
  }

  async onSignUp() {

    console.log('SIGNUP STATUS: started...')
    var info = this.state.userInfo;
    info.email = info.email.trim()
    this.setState({ isDataLoading: true });
    
    try {

      var postUserResult = {ok: false}
      if (this.isInputEmpty()) return

      // Validating email and password
      const emailValidation = await validateEmail(info.email)
      console.log('SING UP STATUS: ' + emailValidation.status)
      if (!emailValidation.ok) {
          this.setLoginMsg(emailValidation.status)
          return
      }

      // Checking if email is already registerd
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
      if ( !User ) {

        // Validating Password
        const passwordCheck = validatePassword(info.password)
        if (!passwordCheck.ok) {
          console.log('SING UP STATUS: ' + passwordCheck.status)
          this.setLoginMsg(passwordCheck.status)
          return
      }

        // Registering new user by posting user identification to database
        info.username = info.email.split('@')[0]
        const postUserOpts = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            ...info,
            emotions: defaultEmotions,
            entries: [],
            layout: 'grid',
            settings: {
              backgroundColor: 'lightblue',
              backgroundImage: null,
            },
          })
        }

        postUserResult = await fetch( corsURI + appServerURI +  'Users/' + info.username, postUserOpts );
        const postUserStatus = 'Status: ' + postUserResult.status + ', ' + postUserResult.statusText

        if (postUserResult.ok) {
          const successMsg = 'Cadastro realizado com sucesso!'
          this.setLoginMsg(successMsg)
          console.log('fetch POST request for user data at signup successful.')
          console.log(postUserStatus)
          console.log('SING UP STATUS: ' + successMsg)

        } else {
          console.log('fetch POST request for user data at signup failed. Throwing error...')
          throw new Error(postUserStatus)
        }

      } else {
        const errMsg = 'Email já cadastrado.'
        this.setLoginMsg(errMsg)
        console.log('SING UP STATUS: ' + errMsg)
      }

    } catch (error) {
      const errMsg = 'Erro no servidor, tente novamente...'
      this.setLoginMsg(errMsg)
      console.log('SING UP STATUS: Erro capturado. Imprimindo erro...')
      console.log(error);

    } finally {
      this.setState({ isDataLoading: false })
      console.log('SING UP STATUS: Concluido.')
      if (postUserResult.ok)  this.onSignIn()
    }
  }

  render() {

    console.log('Rendering "LoginScreen" component...')
    return this.LoginScreen()
  
  }
}

export default LoginScreen;