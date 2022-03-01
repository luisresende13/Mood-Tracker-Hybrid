import React, { Component } from 'react';
import { ImageBackground, View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator, Switch, StatusBar, Platform } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { keepUserConnectionAlive } from './LoginComponent';
import { capitalize } from './subcomponents/EditEmotions';

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const corsURI = Platform.OS == 'web' ? 'https://morning-journey-78874.herokuapp.com/' : ''
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

const colorList = require('../shared/colorList.json')

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foreground: {
    width: 350,
    // marginTop: '10%',
    // marginBottom: '10%',
    // borderWidth: 2,
  },
  header: {
    height: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
  },
  settingsRow: {
    height: 60,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    // borderWidth: 1,
  },
  colorBox: {
    height: 300,
    paddingHorizontal: 0,
    borderColor: 'rgba(200,200,200,0.2)'
  },
  colorRow: {
    width: '100%',
    height: 60,
    paddingHorizontal: 10,
    // paddingLeft: 5,
    // paddingRight: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'rgba(200,200,200,0.2)',
    borderRadius: 10,
  },
  colorSquare: {
    // marginRight: 0,
    width: 30,
    height: 30,
    borderRadius: 6,
    borderColor: 'white'
  },
  logout: {
    height: 33,
    width: 85,
    marginTop: 0,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  h1: {
    fontSize: 25,
    color: 'white'
  },
  h2: {
    fontSize: 19,
    color: 'white',
  },
  h3: {
    fontSize: 17,
    color: 'white',
  },
  h4: {
    fontSize: 16,
    color: 'white',
  },
})

function blinkButton(setPressed, timeSpan=200) {
  setPressed(true)
  setTimeout(() => {
    setPressed(false)
  }, timeSpan);
}

export default class SettingsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedColor: null,
      selectedImage: null,
      displayBackgroundImage: false,
      isBackgroundColorSettingsOpen: false,

      isSaveColorLoading: false,
      isDisplayBackgroundImageLoading: false,
      isLogoutButtonPressed: false,
    }
    this.SettingsScreen = this.SettingsScreen.bind(this);
    this.onLogoutButtonPress = this.onLogoutButtonPress.bind(this);
    this.onColorButtonPressFor = this.onColorButtonPressFor.bind(this);
    this.onSaveColorButtonPress = this.onSaveColorButtonPress.bind(this);
    this.syncUserSettings = this.syncUserSettings.bind(this);
    this.ColorRow = this.ColorRow.bind(this);
    this.ScreenSettings = this.ScreenSettings.bind(this);
    this.logoutPressable = this.logoutPressable.bind(this);
  }

  componentDidMount() {
    console.log('"SettingsScreen" component did mount')
    this.syncUserSettings()
  }

  syncUserSettings() {
    console.log('INITIALIZE SETTINGS STATUS: INITIALIZING...')

    this.setState({
      selectedColor: this.props.appState.user.settings.backgroundColor,
      // selectedImage: this.props.appState.user.settings.backgroundImage
      // displayBackgroundImage: this.props.appState.user.settings.displayBackgroundImage
    })
    this.props.navigation.setParams({selectedColor: this.props.appState.user.settings.backgroundColor})  // Necessary to change the tab bar color dinamically in App.js
  }

  SettingsScreen() {
    const settings = this.props.appState.user.settings
    const backgroundImage = settings.backgroundImage
    const imgURI = settings.displayBackgroundImage ? (backgroundImage ? backgroundImage.urls.regular : null) : null
    return(
      <ImageBackground
      source={{uri : imgURI}}
      style={[ styles.background, {backgroundColor: this.state.selectedColor} ]}
      >
        <ScrollView style={styles.foreground}>
          
          <View style={styles.header}>
            <Text style={styles.h1}>Configurações</Text>
          </View>
          <this.ScreenSettings />
          <this.logoutPressable />

        </ScrollView>

      </ImageBackground>
    )
  }

  async onLogoutButtonPress() {
    this.setState({isLogoutButtonPressed: true});
    setTimeout(() => {
      this.setState({isLogoutButtonPressed: false});
    }, 400);
    await keepUserConnectionAlive(null); // kills user connection
    this.props.route.params.logout();
  }

  logoutPressable() {
    const isLoading = this.state.isSaveColorLoading
    const logoutColor = isLoading ? 'rgba(255,255,255,0.4)' : 'red'
    return(
      <Pressable   // logout pressable
      onPress={this.onLogoutButtonPress}
      disabled={isLoading}
      style={[ styles.settingsRow, {
        justifyContent: 'flex-start',
        marginBottom: 50,
        backgroundColor: this.state.isLogoutButtonPressed ? '0004' : null
      }]}
      >
        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}> */}
          <Icon name='log-out' width={30} height={30} fill={logoutColor} />
          <Text
          style={[styles.h2, { marginLeft: 10, color: logoutColor }]}
          >
          Logout
          </Text>
        {/* </View> */}
      </Pressable>
    )
  }

  onColorButtonPressFor(color) {
    function onColorButtonPress() {
      this.setState({ selectedColor: color })
      this.props.navigation.setParams({selectedColor: color}) // Necessary to change the tab bar color dinamically in App.js
    }
    return onColorButtonPress.bind(this);
  }

  ColorRow({color}) {
    const [isColorRowPressed, setIsColorRowPressed] = React.useState(false)

    return(
      <Pressable
      // android_ripple={{}}
      onPressIn={() => {
        blinkButton(setIsColorRowPressed, 200)
      }}
        onPress={() => {
        this.onColorButtonPressFor(color)()
        }}
      style={[styles.colorRow, {backgroundColor: isColorRowPressed ? 'rgba(0,0,0,0.2)' : null }]}>
        <Text style={[
          styles.h3,
          this.state.selectedColor == color
          ? {fontStyle: 'italic', textDecorationLine: 'underline' }
          : {fontStyle: 'italic', textDecorationLine: 'none' }
        ]}>{ capitalize(color) }</Text>
        <View style={[ styles.colorSquare, { backgroundColor: color, borderWidth: this.state.selectedColor==color ? 3 : 0 }]} />
      </Pressable>
    )
  }

  ScreenSettings() {
    const [isColorButtonPressed, setIsColorButtonPressed] = React.useState(false)
    const [isChooseImageButtonPressed, setIsChooseImageButtonPressed] = React.useState(false)
    const [isExposeImageButtonPressed, setIsExposeImageButtonPressed] = React.useState(false)
    const [isRestoreColorButtonPressed, setIsRestoreColorButtonPressed] = React.useState(false)


    const newColorUnselected = this.state.selectedColor == this.props.appState.user.settings.backgroundColor
    const isLoading = this.state.isSaveColorLoading | this.state.isDisplayBackgroundImageLoading
    return (
              <>
                <Pressable
                onPress={() => {
                  blinkButton(setIsChooseImageButtonPressed)
                  this.props.navigation.navigate('WallpaperTopics')
                }}
                style={[styles.settingsRow, {backgroundColor: isChooseImageButtonPressed ? 'rgba(0,0,0,0.2)' : null }]}
                >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name='image-outline' width={30} height={30} fill='white' />
                    <Text style={[styles.h2, {marginLeft: 10}]}>Escolher fundo</Text>
                  </View>
                  
                  <Icon
                  width={30} height={30}
                  name='arrow-ios-forward-outline'
                  fill={isChooseImageButtonPressed ? 'rgba(255,255,255,1)' : 'rgb(200,200,200)' } />
                </Pressable>

                <Pressable
                onPress={ () => {
                  blinkButton(setIsExposeImageButtonPressed)
                  // this.onDisplayBackgroundImageSwitch()
                }}
                style={[styles.settingsRow, {backgroundColor: isExposeImageButtonPressed ? 'rgba(0,0,0,0.2)' : null }]}
                >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name='eye-outline' width={30} height={30} fill='white' />
                    <Text style={[styles.h2, {marginLeft: 10}]}>Habilitar fundo</Text>
                  </View>

                  <Switch
                  disabled={isLoading}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={this.state.keepConnected ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onPress={() => {}}
                  onValueChange={() => {
                    blinkButton(setIsExposeImageButtonPressed)
                    this.onDisplayBackgroundImageSwitch()
                  }}
                  value={this.props.appState.user.settings.displayBackgroundImage}
                  />
                </Pressable>

            <Pressable
            onPressIn={() => {
              blinkButton(setIsColorButtonPressed)
            }}
            onPress={() => {
              // blinkButton(setIsColorButtonPressed)
              this.setState({
                isBackgroundColorSettingsOpen: !this.state.isBackgroundColorSettingsOpen,
              })
              if (!newColorUnselected) this.syncUserSettings()
            }}
            style={[styles.settingsRow, {backgroundColor: isColorButtonPressed ? 'rgba(0,0,0,0.2)' : null }]}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'} }>
                <Icon name='color-palette-outline' height={30} width={30} fill='white' style={{marginRight: 0}} />
                <Text style={[styles.h2, {marginLeft: 10}]}>Tema</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'} }>
                {/* <View style={{ width: 25, height: 25, borderRadius: 6, marginRight: 15, backgroundColor: this.props.appState.user.settings.backgroundColor }} /> */}
                <Icon
                width={30} height={30}
                name={this.state.isBackgroundColorSettingsOpen ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline' }
                fill={this.state.isBackgroundColorSettingsOpen ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)' } />
              </View>
            </Pressable>


            { this.state.isBackgroundColorSettingsOpen ? (
              <>
                <ScrollView nestedScrollEnabled style={styles.colorBox}>
                  { colorList.map(color => {
                    return (
                      <this.ColorRow color={color} key={'color-' + color} />
                    )
                  })}
                </ScrollView>

                <View style={[styles.settingsRow, {justifyContent: 'space-between'}]}>
                  <Pressable
                  disabled={this.state.isSaveColorLoading | newColorUnselected}
                  style={{ justifyContent: 'center', alignItems: 'center', width: 95 }}
                  onPressIn={() => setIsRestoreColorButtonPressed(true)}
                  onPress={() => {
                    this.syncUserSettings()
                    setIsRestoreColorButtonPressed(false)
                  }}
                  >
                    <Text
                      style={[styles.h2, { 
                        textAlign: 'center',
                        color: newColorUnselected ? '#fff4' : '#ffff'
                      }]}
                    >
                      { isRestoreColorButtonPressed ? <ActivityIndicator color='white' /> :  'Restaurar' }
                    </Text>
                  </Pressable>

                  <Pressable
                  disabled={this.state.isSaveColorLoading | newColorUnselected}
                  onPress={this.onSaveColorButtonPress}
                  style={{ justifyContent: 'center', alignItems: 'center', width: 75 }}
                  >
                    <Text style={[styles.h2, {width: 63, textAlign: 'center', color: newColorUnselected ? '#fff4' : 'white'}]}>
                      { this.state.isSaveColorLoading ? <ActivityIndicator color='white' /> : 'Aplicar' }
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              null
            )}
          </>
    )
  }

  async onDisplayBackgroundImageSwitch() {
       // fetch post display background image value to user settings in server
       try {
        console.log('POST DISPLAY BACKGROUND IMAGE STATUS: Started...')
        this.setState({ isDisplayBackgroundImageLoading: true });
        const displaySetting = {
          displayBackgroundImage: !this.props.appState.user.settings.displayBackgroundImage
        }
        var postDisplayResult = {ok: false, status: '999', statusText: 'Post not fetched yet.'}
        const postDisplaySettingOpts = { 
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify( displaySetting ),
        }
        // var postDisplayResult = await fetch('http://localhost:3000/Users/' + this.context.username + '/settings', postColorSettingOpts);
        postDisplayResult = await fetch( `${corsURI + appServerURI}Users/${this.props.appState.user.username}/settings`, postDisplaySettingOpts);
        const postDisplayStatus = 'Status: ' + postDisplayResult.status + ', ' + postDisplayResult.statusText
  
        if (postDisplayResult.ok) {
          console.log('POST DISPLAY BACKGROUND IMAGE STATUS: Successful.')
          console.log(postDisplayStatus)
              
        } else {
          console.log('POST DISPLAY BACKGROUND IMAGE STATUS: Failed. Throwing error...')
          throw new Error(postDisplayStatus)
        }
  
      } catch (error) {
        alert('Erro no servidor. Tente novamente...')
        console.log('Erro capturado:')
        console.log(error);
  
      } finally {
        console.log('POST DISPLAY BACKGROUND IMAGE STATUS: Finished.')
        if (postDisplayResult.ok) {
          // sync user data with app or entries component
          await this.props.route.params.syncUserData()
          // initialize settings
          // this.syncUserSettings()
        }
        this.setState({ isDisplayBackgroundImageLoading: false });
      } 
  
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
      if (postColorResult.ok) {
        // sync user data with app or entries component
        await this.props.route.params.syncUserData()
        // initialize settings
        this.syncUserSettings()
        this.setState({
          isBackgroundColorSettingsOpen: !this.state.isBackgroundColorSettingsOpen,
        })
      }
      this.setState({ isSaveColorLoading: false });
    } 
  }

  render() {
    console.log('Rendering "SettingsScreen" component...')
    return (
      <this.SettingsScreen />
    );  
  }
}
