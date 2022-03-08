import React, { Component } from 'react';
import { ImageBackground, View, Text, Pressable, ScrollView, ActivityIndicator, Switch, StatusBar, Platform } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { keepUserConnectionAlive } from './LoginComponent';
import { capitalize } from './subcomponents/EditEmotions';

import NativeIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

const colorList = require('../shared/colorList.json')

// var styles = StyleSheet.create({
var styles = {
    background: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foreground: {
    width: 350,
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
    fontSize: 20,
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
}

function blinkButton(setPressed, timeSpan=200) {
  setPressed(true)
  setTimeout(() => {
    setPressed(false)
  }, timeSpan);
}

export async function postSettings(settings, username) {
  // fetch post display background image value to user settings in server
  try {
   console.log('POST SETTINGS STATUS: Started...')
   console.log('POST SETTINGS STATUS: LOGGING NEW SETTING VALUES... ')
   console.log(JSON.stringify(settings))
   var postSettingsResult = {ok: false, status: '999', statusText: 'Post not fetched yet.'}
   const postSettingsOpts = { 
     method: 'POST',
     headers: {
         'Content-Type': 'application/json',
     },
     body: JSON.stringify( settings ),
   }
   // var postDisplayResult = await fetch('http://localhost:3000/Users/' + this.context.username + '/settings', postColorSettingOpts);
   postSettingsResult = await fetch( `${appServerURI}Users/${username}/settings`, postSettingsOpts);
   const postSettingsStatus = 'Status: ' + postSettingsResult.status + ', ' + postSettingsResult.statusText

   if (postSettingsResult.ok) {
     console.log('POST SETTINGS STATUS: Successful.')
     console.log(postSettingsStatus)
         
   } else {
     console.log('POST SETTINGS STATUS: Failed. Throwing error...')
     throw new Error(postSettingsStatus)
   }
 } catch (error) {
   alert('Erro no servidor. Tente novamente...')
   console.log('Erro capturado:')
   console.log(error);

 } finally {
   console.log('POST DISPLAY BACKGROUND IMAGE STATUS: Finished.')
   return postSettingsResult
 }
} 

export default class SettingsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isBackgroundColorSettingsOpen: false,
      selectedColor: null,

      isDisplayBackgroundImageLoading: false,
      isChangeFontColorLoading: false,
      isEnableHighResolutionLoading: false,
      isRestoreColorLoading: false,
      isSaveColorLoading: false,
    }
    this.syncUserSettings = this.syncUserSettings.bind(this);
    this.setFontColor = this.setFontColor.bind(this);
    this.setBackgroundColor = this.setBackgroundColor.bind(this);
    this.SettingsScreen = this.SettingsScreen.bind(this);
    this.ScreenSettings = this.ScreenSettings.bind(this);
    this.ChooseImageSection = this.ChooseImageSection.bind(this);
    this.DisplayBackgroundImageSection = this.DisplayBackgroundImageSection.bind(this);
    this.ChangeFontColorSection = this.ChangeFontColorSection.bind(this);
    this.EnableHighResolutionSection = this.EnableHighResolutionSection.bind(this);
    this.ChangeBackgroundColorSection = this.ChangeBackgroundColorSection.bind(this);
    this.ColorOptions = this.ColorOptions.bind(this);
    this.ColorControl = this.ColorControl.bind(this);
    this.onLogoutButtonPress = this.onLogoutButtonPress.bind(this);
    this.onColorButtonPressFor = this.onColorButtonPressFor.bind(this);
    this.onSaveColorButtonPress = this.onSaveColorButtonPress.bind(this);
    this.onChangeFontColorSwitch = this.onChangeFontColorSwitch.bind(this);
    this.ColorRow = this.ColorRow.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.logoutPressable = this.logoutPressable.bind(this);
  }

  componentDidMount() {
    console.log('"SettingsScreen" component did mount')
    this.syncUserSettings()
  }
  componentWillUnmount() {
    console.log('"SettingsScreen" component will unmount...')
  }

  syncUserSettings() {
    console.log('SYNC SETTINGS STATUS: INITIALIZING...')
    this.setFontColor()
    this.setBackgroundColor()
  }

  setFontColor() {
    const settings = this.props.appState.user.settings
    const fontColor = settings.fontColorDark ? '#000' : '#fff'
    for (let h of ['h1', 'h2', 'h3', 'h4']) {
      styles[h] = { ...styles[h], color: fontColor }
    }
  }

  setBackgroundColor() {
    const settings = this.props.appState.user.settings
    this.setState({
      selectedColor: settings.backgroundColor,
    })
    this.props.navigation.setParams({selectedColor: settings.backgroundColor})  // Necessary to change the tab bar color dinamically in App.js
  }

  SettingsScreen() {
    const settings = this.props.appState.user.settings
    const backgroundImage = settings.backgroundImage
    const backgroundColor = this.state.selectedColor
    const imgURI = settings.displayBackgroundImage ? (backgroundImage ? ( settings.enableHighResolution ? backgroundImage.urls.raw : backgroundImage.urls.regular ) : null) : null
    return(
      <ImageBackground
      source={{uri : imgURI}}
      style={[ styles.background, {backgroundColor: backgroundColor} ]}
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

  ScreenSettings() {
    const [isHighResulotionButtonPressed, setIsHighResulotionButtonPressed] = React.useState(false)
    // const isLoading = this.state.isSaveColorLoading | this.state.isDisplayBackgroundImageLoading | this.state.isChangeFontColorLoading
    return (
      <>
        <this.ChooseImageSection />
        <this.DisplayBackgroundImageSection />
        <this.EnableHighResolutionSection />
        <this.ChangeFontColorSection />
        <this.ChangeBackgroundColorSection />
        <this.ColorOptions />
      </>
    )
  }

  ChooseImageSection() {
    const [isChooseImageButtonPressed, setIsChooseImageButtonPressed] = React.useState(false)
    let fontColor = styles.h1.color
    let fontColorTransp = fontColor + '8'
    return(
      <Pressable
      onPressIn={() => blinkButton(setIsChooseImageButtonPressed)}
      onPress={() => this.props.navigation.navigate('WallpaperTopics')}
      style={[styles.settingsRow, {backgroundColor: isChooseImageButtonPressed ? '#0003' : null }]}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name='image-outline' width={30} height={30} fill={fontColor} />
          <Text style={[styles.h2, {marginLeft: 10}]}>Papel de parede</Text>
        </View>
        
        <Icon
        width={30} height={30}
        name='arrow-ios-forward-outline'
        fill={ fontColor } />
      </Pressable>
    )
  }

  DisplayBackgroundImageSection() {
    const [isExposeImageButtonPressed, setIsExposeImageButtonPressed] = React.useState(false)
    const displayBackgroundImageValue = this.props.appState.user.settings.displayBackgroundImage
    const isLoading = this.state.isDisplayBackgroundImageLoading
    return(
      <Pressable
      onPressIn={ () => blinkButton(setIsExposeImageButtonPressed) }
      style={[styles.settingsRow, {backgroundColor: isExposeImageButtonPressed ? '#0003' : null }]}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name='eye-outline' width={30} height={30} fill={styles.h1.color} />
          <Text style={[styles.h2, {marginLeft: 10, marginRight: 20}]}>Ver papel de parede</Text>
          { isLoading ? <ActivityIndicator color='blue' /> : null }
        </View>
        <Switch
        disabled={isLoading}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={displayBackgroundImageValue ? "#f4f3f4" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => {
          blinkButton(setIsExposeImageButtonPressed)
          this.onDisplayBackgroundImageSwitch(!displayBackgroundImageValue)
        }}
        value={displayBackgroundImageValue}
        />
      </Pressable>
    )
  }

  EnableHighResolutionSection() {
    const [isEnableHighResolutionButtonPressed, setIsEnableHighResolutionButtonPressed] = React.useState(false)
    const enableHighResolutionValue = this.props.appState.user.settings.enableHighResolution
    const isLoading = this.state.isEnableHighResolutionLoading
    return(
      <Pressable
      onPressIn={ () => blinkButton(setIsEnableHighResolutionButtonPressed)}
      style={[styles.settingsRow, {backgroundColor: isEnableHighResolutionButtonPressed ? '#0003' : null }]}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* <Icon name='camera-outline' width={30} height={30} fill={styles.h1.color} /> */}
          <NativeIcon name='high-definition' size={30} color={styles.h1.color} />
          <Text style={[styles.h2, {marginLeft: 10, marginRight: 20}]}>Alta definição</Text>
          { isLoading ? <ActivityIndicator color='blue' /> : null }
        </View>
        <Switch
        disabled={isLoading}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={enableHighResolutionValue ? "#f4f3f4" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => {
          blinkButton(setIsEnableHighResolutionButtonPressed)
          this.onEnableHighResolutionSwitch(!enableHighResolutionValue)
        }}
        value={enableHighResolutionValue}
        />
      </Pressable>    
    )
  }

  ChangeFontColorSection() {
    const [isChangeFontColorButtonPressed, setIsChangeFontColorButtonPressed] = React.useState(false)
    const changeFontColorValue = this.props.appState.user.settings.fontColorDark
    const isLoading = this.state.isChangeFontColorLoading
    return(
      <Pressable
      onPressIn={ () => blinkButton(setIsChangeFontColorButtonPressed)}
      style={[styles.settingsRow, {backgroundColor: isChangeFontColorButtonPressed ? '#0003' : null }]}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name='moon-outline' width={30} height={30} fill={styles.h1.color} />
          <Text style={[styles.h2, {marginLeft: 10, marginRight: 20}]}>Texto escuro</Text>
          { isLoading ? <ActivityIndicator color='blue' /> : null }
        </View>
        <Switch
        disabled={isLoading}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={changeFontColorValue ? "#f4f3f4" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => {
          blinkButton(setIsChangeFontColorButtonPressed)
          this.onChangeFontColorSwitch(!changeFontColorValue)
        }}
        value={changeFontColorValue}
        />
      </Pressable>    
    )
  }

  ChangeBackgroundColorSection() {
    const [isColorButtonPressed, setIsColorButtonPressed] = React.useState(false)
    const newColorUnselected = this.state.selectedColor == this.props.appState.user.settings.backgroundColor
    let fontColor = styles.h1.color
    let fontColorTransp = fontColor + '8'

    return(
      <Pressable
      onPressIn={() => blinkButton(setIsColorButtonPressed)}
      onPress={() => {
        this.setState({ isBackgroundColorSettingsOpen: !this.state.isBackgroundColorSettingsOpen })
        if (!newColorUnselected) this.syncUserSettings()
      }}
      style={[styles.settingsRow, {backgroundColor: isColorButtonPressed ? '#0003' : null }]}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'} }>
          <Icon name='color-palette-outline' height={30} width={30} fill={styles.h1.color} style={{marginRight: 0}} />
          <Text style={[styles.h2, {marginLeft: 10}]}>Tema</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'} }>
          <Icon
          width={30} height={30}
          name={this.state.isBackgroundColorSettingsOpen ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline' }
          fill={ fontColor } />
        </View>
      </Pressable>    
    )
  }

  ColorOptions() {
    return(
      this.state.isBackgroundColorSettingsOpen ? (
        <>
          <ScrollView
          nestedScrollEnabled
          style={styles.colorBox}
          >
            { colorList.map(color => {
              return (
                <this.ColorRow color={color} key={'color-' + color} />
              )
            }) }
          </ScrollView>
          <this.ColorControl />
        </>
      ) : (
        null
      )
    )
  }

  ColorRow({color}) {
    const [isColorRowPressed, setIsColorRowPressed] = React.useState(false)
    const isLoading = this.state.isRestoreColorLoading | this.state.isSaveColorLoading
    return(
      <Pressable
      onPressIn={ () => blinkButton(setIsColorRowPressed, 300) }
      onPress={ this.onColorButtonPressFor(color) }
      disabled={isLoading}
      style={[styles.colorRow, {backgroundColor: isColorRowPressed ? '#0003' : null }]}>
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

  ColorControl() {
    const newColorUnselected = this.state.selectedColor == this.props.appState.user.settings.backgroundColor
    const isLoading = this.state.isRestoreColorLoading | this.state.isSaveColorLoading
    return(
      <View style={[styles.settingsRow, {justifyContent: 'space-between'}]}>
        <Pressable
        disabled={isLoading | newColorUnselected}
        style={{ justifyContent: 'center', alignItems: 'center', width: 95 }}
        // onPressIn={() => blinkButton((bool) => this.setState({isRestoreColorLoading: bool}))}
        onPress={() => {
          this.setState({isRestoreColorLoading: true})
          this.syncUserSettings()
          this.setState({isRestoreColorLoading: false})
        }}
        >
          <Text
            style={[styles.h2, { 
              textAlign: 'center',
              color: isLoading | newColorUnselected ? styles.h1.color + '6' : styles.h1.color
            }]}
          >
            { this.state.isRestoreColorLoading ? <ActivityIndicator color='blue' /> :  'Restaurar' }
          </Text>
        </Pressable>

        <Pressable
        disabled={isLoading | newColorUnselected}
        onPress={this.onSaveColorButtonPress}
        style={{ justifyContent: 'center', alignItems: 'center', width: 75 }}
        >
          <Text style={[styles.h2, {width: 63, textAlign: 'center', color: isLoading | newColorUnselected ? styles.h1.color + '6' : styles.h1.color}]}>
            { this.state.isSaveColorLoading ? <ActivityIndicator color='blue' /> : 'Aplicar' }
          </Text>
        </Pressable>
      </View>
    )
  }

  isLoading() {
    return (
      this.state.isDisplayBackgroundImageLoading | 
      this.state.isChangeFontColorLoading |
      this.state.isRestoreColorLoading |
      this.state.isEnableHighResolutionLoading |
      this.state.isSaveColorLoading
    )
  }

  logoutPressable() {
    const [ isLogoutButtonPressed, setIsLogoutButtonPressed ] = React.useState(false)
    const isLoading = this.isLoading()
    const logoutColor = isLoading ? styles.h1.color+'8' : 'red'
    return(
      <Pressable   // logout pressable
      onPress={() => {
        blinkButton(setIsLogoutButtonPressed)
        this.onLogoutButtonPress()
      }}
      disabled={isLoading}
      style={[ styles.settingsRow, {
        justifyContent: 'flex-start',
        marginBottom: 30,
        backgroundColor: isLogoutButtonPressed ? styles.h1.color+'8' : null
      }]}
      >
        <Icon name='log-out' width={30} height={30} fill={logoutColor} />
        <Text style={[styles.h2, { marginLeft: 10, color: logoutColor }]}>Logout</Text>
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

  async onDisplayBackgroundImageSwitch(value) {
    this.setState({ isDisplayBackgroundImageLoading: true });
    const newSettings = {displayBackgroundImage: value}
    const postDisplayResult = await postSettings(newSettings, this.props.appState.user.username)
    if (postDisplayResult.ok) {
      // sync user data with app or entries component
      await this.props.appState.syncUserData()
    }
    this.setState({ isDisplayBackgroundImageLoading: false });
  }

  async onChangeFontColorSwitch(value) {
    this.setState({ isChangeFontColorLoading: true });
    const newSettings = {fontColorDark: value}
    const postDisplayResult = await postSettings(newSettings, this.props.appState.user.username)
    if (postDisplayResult.ok) {
      // sync user data with app or entries component
      await this.props.appState.syncUserData()
      // update style variable with new data
      this.setFontColor()
    }
    this.setState({ isChangeFontColorLoading: false });
  }

  async onEnableHighResolutionSwitch(value)  {
    this.setState({ isEnableHighResolutionLoading: true });
    const newSettings = {enableHighResolution: value}
    const postHighResolutionResult = await postSettings(newSettings, this.props.appState.user.username)
    if (postHighResolutionResult.ok) {
      // sync user data with app or entries component
      await this.props.appState.syncUserData()
      // update style variable with new data
    }
    this.setState({ isEnableHighResolutionLoading: false });
  }

  async onSaveColorButtonPress() {
    // fetch post selected color to user settings in server
    console.log('POST COLOR STATUS: Started...')
    this.setState({ isSaveColorLoading: true });
    const colorSetting = {
      backgroundColor: this.state.selectedColor
    }
    const postColorResult = await postSettings(colorSetting, this.props.appState.user.username)
    if (postColorResult.ok) {
      if (this.props.appState.user.settings.displayBackgroundImage) {
        await this.onDisplayBackgroundImageSwitch(false)
      } else {
        // sync user data with app or entries component
        await this.props.appState.syncUserData()
      }
      // initialize settings
      this.syncUserSettings()
    }
    console.log('POST COLOR STATUS: Finished.')
    this.setState({ isSaveColorLoading: false });
  }

  async onLogoutButtonPress() {
    await keepUserConnectionAlive(null); // kills user connection
    // this.props.route.params.logout();
    this.props.appState.logout()
  }

  render() {
    console.log('Rendering "SettingsScreen" component...')
    return (
      <this.SettingsScreen />
    );  
  }
}
