import React, { Component } from 'react';
import { ImageBackground, View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator, Switch } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { keepUserConnectionAlive } from './LoginComponent';
import { UserContext } from '../App'

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const corsURI = Platform.OS == 'web' ? 'https://morning-journey-78874.herokuapp.com/' : ''
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

const colorList = [
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen'
]

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  settingsRow: {
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderWidth: 1
  },
  settingsText: {
    fontSize: 20,
    color: 'white',
  },
  settingsTextSecondary: {
    paddingLeft: 10,
    fontSize: 18,
    color: 'white',
  },
})

export default class SettingsScreen extends Component {

  // static contextType = UserContext

  constructor(props) {
    super(props);
    this.state = {
      selectedColor: null,
      selectedImage: null,
      displayImage: true,
      isScreenSettingsOpen: false,
      isBackgroundColorSettingsOpen: false,
      isBackgroundImageSettingsOpen: false,

      isSaveColorLoading: false,
      isLogoutButtonPressed: false,
    }
    this.SettingsScreen = this.SettingsScreen.bind(this);
    this.onLogoutButtonPress = this.onLogoutButtonPress.bind(this);
    this.onColorButtonPressFor = this.onColorButtonPressFor.bind(this);
    this.onSaveColorButtonPress = this.onSaveColorButtonPress.bind(this);
    this.initializeSettings = this.initializeSettings.bind(this);
    this.ScreenSettings = this.ScreenSettings.bind(this);
  }

  componentDidMount() {
    console.log('"SettingsScreen" component did mount')
    this.initializeSettings()
  }

  SettingsScreen() {
    const isLoading = this.state.isSaveColorLoading
    const imgURI = this.state.displayImage ? this.props.appState.user.settings.backgroundImage.uri : null
    return(
      <ImageBackground
      source={{uri : imgURI}}
      style={[ styles.background, {backgroundColor: this.state.selectedColor} ]}
      >
        <View style={{ width: 350, height: '90%', marginTop: 25, paddingHorizontal: 5, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)', borderRadius: 10 }}>
          
          <View style={{ height: 110, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 22, color: 'white', marginRight: 10}}>Configurações</Text>
            <Icon name='settings' width={30} height={30} fill='rgb(255,255,255)' />
          </View>

          <this.ScreenSettings />
  
          <Pressable   // logout pressable
          onPress={this.onLogoutButtonPress}
          disabled={isLoading}
          style={{
            position: 'absolute',
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            height: 33,
            width: 100,
            borderWidth: 1,
            borderColor: isLoading ? 'rgba(255,255,255,0.3)' : 'red',
            borderRadius: 6,
            paddingHorizontal: 12,
            backgroundColor: this.state.isLogoutButtonPressed ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)'
          }}
          >
            <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: isLoading ? 'rgba(255,255,255,0.4)' : 'red',
            }}
            >
            LOGOUT
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    )
  }

  ScreenSettings() {
    const [isApplyColorButtonPressed, setIsApplyColorButtonPressed] = React.useState(false)
    const [isImageButtonPressed, setIsImageButtonPressed] = React.useState(false)
    const [isExposeImageButtonPressed, setIsExposeImageButtonPressed] = React.useState(false)
    const [isChooseImageButtonPressed, setIsChooseImageButtonPressed] = React.useState(false)

    const imageSettingsOpen = this.state.isBackgroundImageSettingsOpen
    const screenSettingsOpen = this.state.isScreenSettingsOpen

    return (
      <View style={{width: '100%', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 15}}>
        <Pressable
        onPress={() => this.setState({ isScreenSettingsOpen: !screenSettingsOpen })}
        style={styles.settingsRow}>
          <Text style={styles.settingsText}>Tela</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'} }>
            <Text style={{fontSize: 15, color: 'white', marginRight: 15}}>Cor e imagem do fundo</Text>
            <Icon
            width={30} height={30}
            name={screenSettingsOpen ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline' }
            fill={screenSettingsOpen ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)' } />
          </View>
        </Pressable>

        { screenSettingsOpen ? (

          <View style={{ width: '100%', paddingLeft: 0, justifyContent: 'flex-start', alignItems: 'center'}}>

            <Pressable
            onPress={() => {
              setIsImageButtonPressed(true)
              setTimeout(() => {
                setIsImageButtonPressed(false)
              }, 200);
              this.setState({
                isBackgroundImageSettingsOpen: !imageSettingsOpen,
                isBackgroundColorSettingsOpen: false
              })
            }}
            style={[styles.settingsRow]}
            >
              <Text style={styles.settingsTextSecondary}>Imagem</Text>
                <Icon
                width={30} height={30}
                name={imageSettingsOpen ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline' }
                fill={imageSettingsOpen ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)' } />
                </Pressable>

            { imageSettingsOpen ? (

              <>
                <Pressable
                onPress={() => {
                  setIsChooseImageButtonPressed(true)
                  setTimeout(() => {
                    setIsChooseImageButtonPressed(false)
                  }, 200);
                  this.props.navigation.navigate('Wallpapers')
                }}
                style={[styles.settingsRow]}
                >
                  <Text style={[styles.settingsTextSecondary, {paddingLeft: 20}]}>Escolher</Text>
                  <Icon
                  width={30} height={30}
                  name='arrowhead-right'
                  fill={isChooseImageButtonPressed ? 'rgba(255,255,255,1)' : 'rgb(200,200,200)' } />
                </Pressable>
                <Pressable
                onPress={() => {
                  setIsExposeImageButtonPressed(true)
                  setTimeout(() => {
                    setIsExposeImageButtonPressed(false)
                  }, 200);
                }}
                style={[styles.settingsRow]}
                >
                  <Text style={[styles.settingsTextSecondary, {paddingLeft: 20}]}>Exibir</Text>
                  <Switch
                  // disabled={this.state.isDataLoading}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={this.state.keepConnected ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e" 
                  onValueChange={() => this.setState({displayImage: !this.state.displayImage})}
                  value={this.state.displayImage}
                  />
                </Pressable>
              </>

            ) : (
              null
            )}

            <Pressable
            onPress={() => this.setState({
              isBackgroundColorSettingsOpen: !this.state.isBackgroundColorSettingsOpen,
              isBackgroundImageSettingsOpen: false
            })}
            style={[styles.settingsRow]}
            >
              <Text style={styles.settingsTextSecondary}>Cor</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'} }>
                <View style={{ width: 25, height: 25, borderRadius: 6, marginRight: 15, backgroundColor: this.props.appState.user.settings.backgroundColor }} />
                <Icon
                width={30} height={30}
                name={this.state.isBackgroundColorSettingsOpen ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline' }
                fill={this.state.isBackgroundColorSettingsOpen ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)' } />
              </View>
            </Pressable>


            { this.state.isBackgroundColorSettingsOpen ? (
              <>
                <View style={{width: '100%', height: 314, paddingVertical: 0}}>
                  <ScrollView style={{width: '100%', height: '100%', paddingHorizontal: 10, paddingVertical: 0, borderRadius: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
                    { colorList.map(color => {
                      return (
                        <Pressable
                        key={'color-' + color}
                        onPress={this.onColorButtonPressFor(color)}
                        style={{width: '100%', height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: 'rgba(200,200,200,0.3)'}}>
                          <Text style={{ paddingLeft: 10, fontSize: 16, color: 'white' }}>{color}</Text>
                          <View style={{ marginRight: 10, width: 25, height: 25, borderRadius: 6, backgroundColor: color }} />
                        </Pressable>
                      )
                    })}
                  </ScrollView>
                </View>

                <View style={[styles.settingsRow, {justifyContent: 'flex-end'}]}>
                  <Pressable
                  onPress={() => {
                    setIsApplyColorButtonPressed(true)
                    setTimeout(() => {
                      setIsApplyColorButtonPressed(false)
                    }, 200);
                    this.onSaveColorButtonPress()
                  }}
                  style={{  marginRight: 10, justifyContent: 'center', alignItems: 'center'}}
                  >
                    { this.state.isSaveColorLoading
                      ? <ActivityIndicator color='white' />
                      : <Text style={{color: isApplyColorButtonPressed ? 'rgba(0,0,0,0)' : 'white', fontSize: 19}}>Aplicar cor</Text>
                    }
                  </Pressable>
                </View>
              </>
            ) : (
              null
            )}
          </View>
        ) : (
          null
        )}
      </View>
    )
  }

  initializeSettings() {
    // const user = this.context;
    console.log('INITIALIZE SETTINGS STATUS: INITIALIZING. PRINTING CURRENT SETTINGS...')
    console.log(this.props.appState.user.settings)

    this.setState({
      selectedColor: this.props.appState.user.settings.backgroundColor,
      // selectedImage: this.props.appState.user.settings.backgroundImage
    })
    this.props.navigation.setParams({selectedColor: this.props.appState.user.settings.backgroundColor})
  }

  async onLogoutButtonPress() {
    this.setState({isLogoutButtonPressed: true});
    setTimeout(() => {
      this.setState({isLogoutButtonPressed: false});
    }, 400);
    await keepUserConnectionAlive(null); // kills user connection
    this.props.route.params.logout();
  }

  onColorButtonPressFor(color) {
    function onColorButtonPress() {
      this.setState({ selectedColor: color })
      this.props.navigation.setParams({selectedColor: color})

    }
    return onColorButtonPress.bind(this);
  }

  async onSaveColorButtonPress() {
    // fetch post selected color to user settings in server
    try {
      console.log('POST COLOR STATUS: Started...')
      this.setState({ isSaveColorLoading: true });
      const colorSetting = {
        backgroundColor: this.state.selectedColor
      }
      var postColorResult = {ok: false, status: '999', statusText: 'Post not fetched yet.'}
      const postColorSettingOpts = { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( colorSetting ),
      }
      // var postColorResult = await fetch('http://localhost:3000/Users/' + this.context.username + '/settings', postColorSettingOpts);
      postColorResult = await fetch( `${corsURI + appServerURI}Users/${this.props.appState.user.username}/settings`, postColorSettingOpts);
      const postColorStatus = 'Status: ' + postColorResult.status + ', ' + postColorResult.statusText

      if (postColorResult.ok) {
        console.log('POST COLOR STATUS: Successful.')
        console.log(postColorStatus)
            
      } else {
        console.log('POST COLOR STATUS: Failed. Throwing error...')
        throw new Error(postColorStatus)
      }

    } catch (error) {
      alert('Erro no servidor. Tente novamente...')
      console.log('Erro capturado:')
      console.log(error);

    } finally {
      console.log('POST COLOR STATUS: Finished.')
      this.setState({ isSaveColorLoading: false });
      if (postColorResult.ok) {
        // sync user data with app or entries component
        await this.props.route.params.syncUserData()
        // initialize settings
        this.initializeSettings()
      }
    } 
  }

  render() {
    console.log('Rendering "SettingsScreen" component...')
    return (
      <this.SettingsScreen />
    );  
  }
}
