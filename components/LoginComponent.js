import { Icon } from 'react-native-eva-icons'

import React, { Component } from 'react';
import { View, Text, ImageBackground, TextInput, Pressable } from 'react-native';

const cors_uri = 'https://morning-journey-78874.herokuapp.com/'

const styles = {
    login: {
      mainView: {
        flex: 1,
        // padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
      },
      card: {
        height: '60%',
        width: 280,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 20,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: 'azure',
        // justifyContent: 'start',
      },
      cardHeader: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
        paddingTop: 10,
        paddingBottom: 30,
        paddingLeft: 5,
        // borderWidth: 2,
      },
      inputField: {
        height: 40,
        marginBottom: 10, 
        paddingLeft: 10,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 0.2,
        borderColor: 'grey',
        backgroundColor: 'white'
      },
      cardBody: {
        flex: 1,
        justifyContent: 'space-between'
      },
      cardSection: {
        justifyContent: 'flex-start',
      },
      button: {
        height: 40,
        width: '100%',
        // marginBottom: 10,
        borderRadius: 5,
        borderWidth: 0.1,
        borderColor: 'black',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: 'navajowhite',        
      },
      buttonLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
      },
      changeScreenButton: {
        flexDirection: 'row',
        shrink: 1,
        // width: 135,
        alignSelf: 'center',
        backgroundColor: 'dodgerblue',
        // justifyContent: 'flex-start',
        alignItems: 'center',
        // borderWidth: 0,
      },
      text: {
        fontSize: 15,
        textAlign: 'center',
        // color: 'black',
      },
    }
  }
  
  class LoginScreen extends Component {
  
    constructor(props) {
      super(props);
  
      this.state = {
        screen: 'signin',
        userInfo: {
            username: '',
            password: '',
            email: '',    
        },
        isUserAuth: null,
        isLoading: false,
      }
      this.screenTitle = this.screenTitle.bind(this);
      this.changeScreenButton = this.changeScreenButton.bind(this);
      this.onChangeScreenButton = this.onChangeScreenButton.bind(this);
      this.onChangeText = this.onChangeText.bind(this);
      this.emailField = this.emailField.bind(this);
      this.submitButton = this.submitButton.bind(this);
      this.onSignIn = this.onSignIn.bind(this);
      this.onSignUp = this.onSignUp.bind(this);
    }
  
    screenTitle() {
      return(        
        <Text style={styles.login.cardHeader}>{this.state.screen === 'signin' ? 'Entrar' : 'Cadastre-se'}</Text>
      )
    }
      
    onChangeText(textField) {
      function setField(text) {
        this.setState( { userInfo: { ...this.state.userInfo, [textField] : text}} )
      }
      setField = setField.bind(this);
      return setField
    }
  
    emailField() {
      if (this.state.screen !=='signin') {
        return(
          <TextInput style={styles.login.inputField} placeholder='Email' onChangeText={this.onChangeText('email')}></TextInput>          
        )
      }
    }
  
    submitButton() {
      if (this.state.screen === 'signin') {
        return(
          <Pressable onPress={this.onSignIn} style={[styles.inputField, styles.login.button]}>
            <Text style={styles.login.buttonLabel}>Entrar</Text>
          </Pressable>
        )
      } else {
        return(
          <Pressable onPress={this.onSignUp} style={[styles.inputField, styles.login.button]}>
            <Text style={styles.login.buttonLabel}>Cadastre-se</Text>
          </Pressable>
        )
      }
    }

    onChangeScreenButton() {
      this.setState({screen: this.state.screen==='signin' ? 'signup' : 'signin'})
    }

    changeScreenButton() {
      const signInScreen = this.state.screen==='signin' 
      return(
          <Pressable onPress={this.onChangeScreenButton} style={[styles.login.button, styles.login.changeScreenButton]}>
            <Text style={[styles.login.buttonLabel, styles.login.changeScreenButtonLabel]}>{signInScreen ? 'Cadastre-se' : 'Entrar'}</Text>
          </Pressable>
      )
    }

    loadingIcon() {
      if (this.state.isLoading) {
        return <Text>Loading...</Text>
      } else {
        return <></>
      }
    }

    async onSignIn() {
      this.setState({ isLoading: true });
      const info = this.state.userInfo;
      try {
        const response = await fetch(`${cors_uri}https://mood-tracker-server.herokuapp.com/Users/${info.username}`, { method: 'GET' });
        
        if (response.ok) {
          console.log('fetch GET request successful.')
        } else {
          console.log('fetch GET request failed. Throwing error.')
          throw new Error(response.status + ', ' + response.statusText + '. For GET request in url: ' + response.url)
        }

        const json = await response.json();
        if (json) {
          
          if (info.password === json.password) {
            alert('Login bem sucedido! Entrando...')
            this.setState({isUserAuth: true})
            this.props.authUser()

          } else {
            const errMsg = 'Senha incorreta. Por favor insira uma senha válida.'
            alert(errMsg)
            console.log(errMsg)
            return  
          }

        } else {
          const errMsg = 'Nome de usuário não encontrado.'
          alert(errMsg)
          console.log(errMsg)
          return
        }

      } catch (error) {
        alert('Erro. Operação não concluída. Tente novamente.')
        console.log('Error catched:')
        console.log(error);

      } finally {
        this.setState({ isLoading: false });
      }
    }

    async onSignUp() {
      this.setState({ isLoading: true });
      const info = this.state.userInfo;
      try {
        var usernameResponse = await fetch(`${cors_uri}https://mood-tracker-server.herokuapp.com/Users/${info.username}`, { method: 'GET' });
        if (usernameResponse.ok) {
          console.log('fetch GET request successful.')
        } else {
          console.log('fetch GET request failed. Throwing error.')
          throw new Error(usernameResponse.status + ', ' + usernameResponse.statusText + '. For GET request in url: ' + usernameResponse.url)
        }

        const json = await usernameResponse.json();
        if (json) {          
            const errMsg = 'Esse nome de usuário já está sendo usado.'
            alert(errMsg)
            console.log(errMsg)
            return  
        
        } else {
          const emailResponse = await fetch(`${cors_uri}https://mood-tracker-server.herokuapp.com/Users`, { method: 'GET' });
          if (emailResponse.ok) {
            console.log('fetch GET request successful.')
          } else {
            console.log('fetch GET request failed. Throwing error.')
            throw new Error(emailResponse.status + ', ' + emailResponse.statusText + '. For GET request in url: ' + emailResponse.url)
          }

          const emailJson = await emailResponse.json();
          if ( emailJson.filter((user) => user.email === info.email)[0] ) {          
              const errMsg = 'Esse email já está sendo usado.'
              alert(errMsg)
              console.log(errMsg)
              return  
          } else {
            
            const postUserOpts = { 
              method: 'POST',
              // mode: 'no-cors',
              // credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                // Accept: 'application/json',
                // 'Authorization': 'Basic ' + base64.encode(info.username + ":" + info.password)
                // 'Access-Control-Allow-Origin':  'http://127.0.0.1:19006',
                // 'Access-Control-Allow-Methods': 'POST',
                // 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                // 'Access-Control-Allow-Credentials': true,
              },
              body: JSON.stringify( { entries: [], ...info } )
            }
            var postUserResponse = await fetch(`${cors_uri}https://mood-tracker-server.herokuapp.com/Users/${info.username}`, postUserOpts);

            if (postUserResponse.ok) {
              console.log('fetch POST request successful.')
              console.log('Post Response:')
              console.log(postUserResponse)
              alert('Cadastro bem sucedido. Entrando ...')
              this.onSignIn()
            } else {
              console.log('fetch POST request failed. Throwing error.')
              throw new Error(postUserResponse.status + ', ' + postUserResponse.statusText + '. For GET request in url: ' + postUserResponse.url)
            }
          }
  
        }

      } catch (error) {
        alert('Operação não concluída. Tente novamente.')
        console.log('Error catched:')
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }


    }
  
    render() {
  
      return(
        <ImageBackground source={require('../assets/wallpaper.jpg')} style={[styles.login.mainView]}>
          <View style={styles.login.card}>
            {this.screenTitle()}

            <View style={styles.login.cardBody}>
              <View style={styles.login.cardSection}>
                <TextInput placeholder='Nome de Usuário' onChangeText={this.onChangeText('username')} style={styles.login.inputField} ></TextInput>
                <TextInput placeholder='Senha' onChangeText={this.onChangeText('password')} style={styles.login.inputField}></TextInput>
                {this.emailField()}
                {this.submitButton()}
              </View>

              {this.loadingIcon()}

                {this.changeScreenButton()}

            </View>
          </View>
        </ImageBackground>
      )
    }
  }
  
export default LoginScreen;