import { Icon } from 'react-native-eva-icons'

import React, { Component } from 'react';
import { View, Text, ImageBackground, TextInput, Pressable, Platform } from 'react-native';

const cors_uri = 'https://morning-journey-78874.herokuapp.com/'

const styles = {
  login: {
    mainView: {
      flex: 1,
      // padding: 30,
      justifyContent: 'center',
      alignItems: 'center',
      // paddingHorizontal: Platform.OS != 'web' ? '5%' : '5%',
    },
    card: {
      height: '70%',
      width: 380,
      paddingHorizontal: 10,
      paddingVertical: 10,
      // paddingBottom: 20,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: 'azure',
      // justifyContent: 'start',
    },
    cardHeader: {
      height: '30%',
      fontSize: 25,
      fontWeight: 'bold',
      color: 'black',
      paddingTop: 30,
      paddingBottom: 50,
      paddingLeft: 15,
      // borderWidth: 2,
    },
    cardSection: {
      height: '25%',
      // width: '100%',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      // borderWidth: 1,
    },
    inputField: {
      height: 40,
      width: '100%',
      // marginBottom: 10, 
      paddingLeft: 10,
      fontSize: 14,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'grey',
      backgroundColor: 'white'
    },
    button: {
      height: 40,
      width: '100%',
      // marginBottom: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'grey',
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: 'dodgerblue',        
    },
    buttonLabel: {
      fontSize: 15,
      fontWeight: 'bold',
      color: 'black',
    },
    text: {
      fontSize: 15,
      textAlign: 'center',
      // color: 'black',
    },
    loadingIcon: {
      alignSelf: 'center'
  },
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
        },
        isUserAuth: false,
        isLoading: false,
      }
      this.onChangeText = this.onChangeText.bind(this);
      this.submitButton = this.submitButton.bind(this);
      this.onSignIn = this.onSignIn.bind(this);
      this.onSignUp = this.onSignUp.bind(this);
    }

    loadingIcon() {
      if (this.state.isLoading) {
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

      var info = this.state.userInfo;
      this.setState({ isLoading: true });

      try {
        var UsersResult = await fetch(`${cors_uri}https://mood-tracker-server.herokuapp.com/Users`, { method: 'GET' });
        
        if (UsersResult.ok) {
          console.log('fetch GET request successful.')
        } else {
          console.log('fetch GET request failed. Throwing error...')
          throw new Error(UsersResult.status + ', ' + UsersResult.statusText + '. For GET request in url: ' + UsersResult.url)
        }

        const Users = await UsersResult.json();
        const user = Users.filter((user) => user.email === info.email)[0]
        
        if ( user ) {          
          
          if (user.password === info.password) {
            alert('Login realizado com sucesso!')
            this.setState({isUserAuth: true, userInfo: { ...info, username: info.email.split('@')[0]} })
            this.props.authUser(this.state.userInfo)  // Father class component method that authenticates the user.

          } else {
            const errMsg = 'Senha incorreta'
            alert(errMsg)
            console.log(errMsg)
            return  
          }

        } else {
          const errMsg = 'Email não cadastrado.'
          alert(errMsg)
          console.log(errMsg)
          return
        }

      } catch (error) {
        alert('Operação não concluída, tente novamente.')
        console.log('Erro capturado:')
        console.log(error);

      } finally {
        this.setState({ isLoading: false });
      }
    }

    async onSignUp() {
      this.setState({ isLoading: true });
      var info = this.state.userInfo;
      try {
        var UsersResult = await fetch(`${cors_uri}https://mood-tracker-server.herokuapp.com/Users`, { method: 'GET' });
        if (UsersResult.ok) {
          console.log('fetch GET request successful.')
        } else {
          console.log('fetch GET request failed. Throwing error.')
          throw new Error(UsersResult.status + ', ' + UsersResult.statusText + '. For GET request in url: ' + UsersResult.url)
        }

        const Users = await UsersResult.json();
        if ( Users.filter((user) => user.email === info.email)[0] ) {          
            const errMsg = 'Email já cadastrado.'
            alert(errMsg)
            console.log(errMsg)
            return  

        } else { // ready to post user info and create new user account.
          info.username = info.email.split('@')[0]
          const postUserOpts = { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify( { entries: [], ...info } )
          }
          var postUserResult = await fetch(`${cors_uri}https://mood-tracker-server.herokuapp.com/Users/${info.username}`, postUserOpts);

          if (postUserResult.ok) {
            console.log('fetch POST request successful.')
            console.log('Status: ' + postUserResult.status + ', ' + postUserResult.statusText + '. For POST request in url: ' + postUserResult.url)
            this.onSignIn()
            alert('Cadastro realizado com sucesso. Fazendo login...')

          } else {
            console.log('fetch POST request failed. Throwing error...')
            throw new Error('Status: ' + postUserResult.status + ', ' + postUserResult.statusText + '. For GET request in url: ' + postUserResult.url)
          }
        }

      } catch (error) {
        alert('Erro no servidor, não foi possível realizar o cadastro. Por favor, tente novamente.')
        console.log('Erro capturado:')
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
    }
  
    render() {
  
      return(
        <ImageBackground source={require('../assets/wallpaper.jpg')} style={[styles.login.mainView]}>
          <View style={styles.login.card}>

            <Text style={styles.login.cardHeader}>Entrar</Text>
            {/* <View style={styles.login.cardBody}> */}
              <View style={styles.login.cardSection}>
                {/* <TextInput placeholder='Nome de Usuário' onChangeText={this.onChangeText('username')} style={styles.login.inputField} ></TextInput> */}
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
            {/* </View> */}

          </View>
        </ImageBackground>
      )
    }
  }
  
export default LoginScreen;