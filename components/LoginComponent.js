import React, { Component } from 'react';
import { View, Text, ImageBackground, TextInput, Pressable, Platform, ActivityIndicator, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import * as Device from 'expo-device';
import { Icon } from 'react-native-eva-icons'

import styles, { relativeToScreen } from '../styles/loginStyles'
let backgroundColor = "#5926a6"
let imgURI = require('../assets/wallpaper.png')

const defaultEmotions = require('../shared/emotionsConfig')
const userScheme = {
  emotions: defaultEmotions,
  entries: [],
  layout: 'grid',
  settings: {
    backgroundColor: "#5926a6",
    backgroundImage: require('../shared/defaultWallpaper.json'),
    displayBackgroundImage: true,
    enableHighResolution: false,
    fontColorDark: false,
  }
}

// App server connection settings
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

// Email Validation settings
const falseParams = ['validateDNS', 'checkCatchAll', 'checkFree', 'checkDisposable']

async function validateEmail(email) {
  console.log('EMAIL VERIFICATION STATUS: Fetching email verification api...')
  var emailStatus = {ok: false, status: 'Email não verificado.'}
  try {
    var queryParams = {
      emailAddress: email,
    }
    falseParams.forEach(param => queryParams[param]='false')
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },    
        body: JSON.stringify({
          queryParams: queryParams
        }),
    }
    const apiResp = await fetch(appServerURI + 'api/email', fetchOptions)
  
    if (apiResp.ok) {  
      console.log('EMAIL VERIFICATION STATUS: Api fetch request successful.')
      const apiRespJson = await apiResp.json()
      if ( apiRespJson.formatCheck!='true' ) {
        emailStatus.status = 'Email inválido.'
      } else if ( apiRespJson.smtpCheck!='true' ) {
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
}

function validatePassword(password) {
  console.log('VALIDATING PASSWORD FOR SIGNUP...')
  const hasMinLength = password.length > 5
  var res
  if (!hasMinLength) {
    res = {ok: false, status: 'A senha deve ter no mínimo 6 caractéres.'}
  } else {
    res = {ok: true, status: 'Senha válida.'}
  }
  return res
}

// async function fetchUsers() {
//   var UsersResponse = await fetch( appServerURI + 'Users', { method: 'GET' });
//   const UsersStatus = 'Status: ' + UsersResponse.status + ', ' + 'Status Text: ' + UsersResponse.statusText
//   if (UsersResponse.ok) {
//     console.log('fetch GET request for users data at signin successful.');
//     console.log(UsersStatus)

//     const Users = await UsersResponse.json();
//     return Users
//   } else {
//     console.log('fetch GET request for users data at signin failed. Printing fetch response...')
//     console.log(JSON.stringify(UsersResponse))
//     console.log('Returning null...')
//     return null
//   }
// }

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
        }
      ]
    }
    await AsyncStorage.setItem('LocalAuthenticationInfo', JSON.stringify(updatedLocalAuthInfo))
    console.log('SIGNIN STATUS: Informações do usuário adicionadas no aparelho.')
  } else {
    console.log('SIGNIN STATUS: Informações do usuário já registradas nesse aparelho. Pulando registro do usuário no armazenamento local...')
  } 
}

export async function keepUserConnectionAlive(id) {
  var localAuthInfo = await AsyncStorage.getItem('LocalAuthenticationInfo')
  localAuthInfo = JSON.parse(localAuthInfo)

  if ( localAuthInfo.keepConnected.userId != id ) {
    console.log(`SIGNIN STATUS: Usuário optou por ${id ? 'manter conexão ativa. Configurando conexão ativa para o usuário...' : 'desativar conexão ativa. Desativando...' }`)
    const updatedLocalAuthInfo = {
      ...localAuthInfo,
      keepConnected: {
        status: id ? true : false,
        userId: id
      }
    }
    await AsyncStorage.setItem('LocalAuthenticationInfo', JSON.stringify(updatedLocalAuthInfo))
  } else {
    console.log('SIGNIN STATUS: Fazendo login via conexã ativa. Pulando configuração de conexão ativa para o usuário...')
  }
}

class LoginScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userInfo: {
        password: '',
        email: '',
        username: '',
        settings: null,
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
      return <Icon name='log-in-outline' animation='pulse' fill='#000' width={relativeToScreen(30)} height={relativeToScreen(30)} />
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
  return(
      <ImageBackground
      source={imgURI}
      style={[styles.login.mainView, {backgroundColor: backgroundColor, justifyContent: 'space-evenly'}]}
      >
        
        <View style={styles.login.titleView}>
          <Text style={styles.login.title}>Rastreador de humor</Text>
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
            value={this.state.userInfo.email}
            />
            <TextInput
            placeholder='Senha'
            textContentType='password'
            secureTextEntry={true}
            style={styles.login.inputField}
            onChangeText={this.onChangeText('password')}
            autoComplete='password'
            importantForAutofill='yes'
            value={this.state.userInfo.password}
            />
          </View>
          <View style={[styles.login.cardSection, {height: '33.0%'}]}>
            {this.submitButton('signin')}
            {this.submitButton('signup')}
            <View style={{flexDirection: 'row', height: relativeToScreen(48), alignSelf: 'stretch', alignItems: 'center', justifyContent: 'flex-end'}}>
              <Text style={{marginRight: Platform.OS=='web' ? relativeToScreen(10) : null }}>Manter-me conectado</Text>
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
          <View style={[styles.login.cardSection, {height: '19.04%', justifyContent: 'center'}]}>
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
        console.log('RESTORE USER TOKEN STATUS: LOCAL AUTH INFO ALREADY CONFIGURED. LOGGING CURRENT VALUE...')
        localAuthInfo = JSON.parse(localAuthInfo)

        if (localAuthInfo.keepConnected.status) {
          console.log(`RESTORE USER TOKEN STATUS: USER CONNECTION IS ALIVE FOR USER ID: ${localAuthInfo.keepConnected.userId}. PROCEDING TO SIGNIN...`)
          const user = localAuthInfo.users.filter(user => user._id == localAuthInfo.keepConnected.userId)[0]
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
          deviceBrand: Device.brand,
          deviceManufacturer: Device.manufacturer,
          deviceModelName: Device.modelName,
          deviceModelId: Device.modelId,
          deviceOsName: Device.osName,
          deviceOsVersion: Device.osVersion,
          deviceName: Device.deviceName,
          deviceType: await Device.getDeviceTypeAsync(),
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

      var UsersResult = await fetch( appServerURI + 'Users', { method: 'GET' });
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
        
        if ( user.password === info.password ) {

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
      var UsersResult = await fetch( appServerURI + 'Users', { method: 'GET' } );  
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
            ...userScheme
          })
        }

        postUserResult = await fetch( appServerURI +  'Users/' + info.username, postUserOpts );
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