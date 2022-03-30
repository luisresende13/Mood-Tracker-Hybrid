import React, { Component } from 'react';
import { ImageBackground, View, Text, Pressable, ScrollView, ActivityIndicator, Switch, StatusBar } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { keepUserConnectionAlive } from './LoginComponent';
import { relativeToScreen } from '../styles/loginStyles';
import { capitalize } from './subcomponents/EditEmotions';
import NativeIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

const colorList = require('../shared/colorList.json')

var styles = {
  background: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingBottom: relativeToScreen(55),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollView: {
    width: '100%',
    // alignItems: 'center',
  },
  foreground: {
    width: relativeToScreen(350),
    alignSelf: 'center'
  },
  header: {
    height: relativeToScreen(120),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
  },
  settingsRow: {
    height: relativeToScreen(60),
    paddingHorizontal: relativeToScreen(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: relativeToScreen(10),
    // borderWidth: 1,
  },
  colorBox: {
    height: relativeToScreen(225),
    paddingHorizontal: 0,
    borderColor: 'rgba(200,200,200,0.2)'
  },
  colorRow: {
    width: '100%',
    height: relativeToScreen(50),
    paddingHorizontal: relativeToScreen(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#fff4',
    borderRadius: relativeToScreen(10),
  },
  colorSquare: {
    // marginRight: 0,
    width: relativeToScreen(28),
    height: relativeToScreen(28),
    borderRadius: relativeToScreen(6),
    borderColor: 'white'
  },
  logout: {
    height: relativeToScreen(33),
    width: relativeToScreen(85),
    marginTop: 0,
    marginBottom: relativeToScreen(20),
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  h1: {
    fontSize: relativeToScreen(25),
    color: '#fff'
  },
  h2: {
    fontSize: relativeToScreen(20),
    color: '#fff',
  },
  h3: {
    fontSize: relativeToScreen(17),
    color: '#fff',
  },
  h4: {
    fontSize: relativeToScreen(16),
    color: '#fff',
  },
}

export function blinkButton(setPressed, timeSpan=200) {
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

const SwitchSection = ({title, icon, value, onValueChange, isLoading, nativeIcon=false}) => {
  const [isButtonPressed, setIsButtonPressed] = React.useState(false)
  return(
    <Pressable
    onPressIn={ () => blinkButton(setIsButtonPressed)}
    style={[styles.settingsRow, {backgroundColor: isButtonPressed ? '#0003' : '#0000' }]}
    >
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        { nativeIcon
        ? <NativeIcon name={icon} size={relativeToScreen(30)} color={styles.h1.color} />
        : <Icon name={icon} width={relativeToScreen(30)} height={relativeToScreen(30)} fill={styles.h1.color} />
        }
        <Text
        selectable={false}
        style={[styles.h2, {
          marginLeft: relativeToScreen(10),
          marginRight: relativeToScreen(20)
        }]}
        >
          { title }
        </Text>
        { isLoading ? <ActivityIndicator color='blue' /> : null }
      </View>
      <Switch
      disabled={isLoading}
      trackColor={{ false: "#767577", true: "#81b0ff" }}
      thumbColor={ value ? "#f4f3f4" : "#f4f3f4" }
      ios_backgroundColor="#3e3e3e"
      value={value}
      onValueChange={() => {
        blinkButton(setIsButtonPressed)
        onValueChange(!value)
      }}
      />
    </Pressable>    
  )
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
      isEnableAnimationsLoading: false,
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
    this.EnableAnimationsSection = this.EnableAnimationsSection.bind(this);
    this.onLogoutButtonPress = this.onLogoutButtonPress.bind(this);
    this.onColorButtonPressFor = this.onColorButtonPressFor.bind(this);
    this.onSaveColorButtonPress = this.onSaveColorButtonPress.bind(this);
    this.postSettingAndSync = this.postSettingAndSync.bind(this);
    this.onDisplayBackgroundImageSwitch = this.onDisplayBackgroundImageSwitch.bind(this);
    this.onChangeFontColorSwitch = this.onChangeFontColorSwitch.bind(this);
    this.onEnableHighResolutionSwitch = this.onEnableHighResolutionSwitch.bind(this);
    this.onEnableAnimationsSwitch = this.onEnableAnimationsSwitch.bind(this);
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
    this.setState({selectedColor: settings.backgroundColor})
    this.props.navigation.setParams({selectedColor: settings.backgroundColor})  // Necessary to change the tab bar color dinamically in App.js
  }

  SettingsScreen() {
    const settings = this.props.appState.user.settings
    const backgroundImage = settings.backgroundImage
    const backgroundColor = this.state.selectedColor
    const imgURI = settings.displayBackgroundImage && !this.state.isBackgroundColorSettingsOpen
    ? (backgroundImage
      ? ( settings.enableHighResolution
        ? backgroundImage.urls.raw
        : backgroundImage.urls.regular )
      : null )
    : null
    return(
      <ImageBackground
      source={{uri : imgURI}}
      style={[ styles.background, {backgroundColor: backgroundColor} ]}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.foreground}>
            <View style={styles.header}>
              <Text style={styles.h1}>Configurações</Text>
            </View>
            <this.ScreenSettings />
          </View>
        </ScrollView>
      </ImageBackground>
    )
  }

  ScreenSettings() {
    return (
      <>
        <this.ChooseImageSection />
        <this.DisplayBackgroundImageSection />
        <this.EnableHighResolutionSection />
        <this.ChangeFontColorSection />
        <this.EnableAnimationsSection />
        <this.ChangeBackgroundColorSection />
        <this.ColorOptions />
        <this.logoutPressable />
      </>
    )
  }

  ChooseImageSection() {
    const [isButtonPressed, setIsButtonPressed] = React.useState(false)
    return(
      <Pressable
      onPressIn={() => blinkButton(setIsButtonPressed)}
      onPress={() => {
        this.setState({isBackgroundColorSettingsOpen: false})
        this.props.navigation.navigate('WallpaperTopics');
      }}
      style={[styles.settingsRow, {backgroundColor: isButtonPressed ? '#0003' : null }]}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name='image-outline' width={30} height={30} fill={styles.h1.color} />
          <Text selectable={false} style={[styles.h2, {marginLeft: 10}]}>{ 'Ver planos de fundo' }</Text>
        </View>
        
        <Icon
        width={relativeToScreen(30)} height={relativeToScreen(30)}
        name='arrow-ios-forward-outline'
        fill={ styles.h1.color } />
      </Pressable>
    )
  }

  DisplayBackgroundImageSection() {
    return(
      <SwitchSection
      title='Plano de fundo'
      icon='eye-outline'
      value={this.props.appState.user.settings.displayBackgroundImage}
      onValueChange={async value => {
        await this.onDisplayBackgroundImageSwitch(value);
        if (value) this.setState({isBackgroundColorSettingsOpen: false})
      }}
      isLoading={this.state.isDisplayBackgroundImageLoading}
      />
    )
  }

  EnableHighResolutionSection() {
    return(
      <SwitchSection
      title='Alta definição (HD)'
      icon='high-definition'
      nativeIcon={true}
      value={this.props.appState.user.settings.enableHighResolution}
      onValueChange={this.onEnableHighResolutionSwitch}
      isLoading={this.state.isEnableHighResolutionLoading}
      />
    )
  }

  ChangeFontColorSection() {
    return(
      <SwitchSection
      title='Texto escuro'
      icon='moon-outline'
      value={this.props.appState.user.settings.fontColorDark}
      onValueChange={this.onChangeFontColorSwitch}
      isLoading={this.state.isChangeFontColorLoading}
      />
    )
  }

  EnableAnimationsSection() {
    return(
      <SwitchSection
      title='Animar gráficos'
      icon='activity-outline'
      value={this.props.appState.user.settings.enableAnimations}
      onValueChange={this.onEnableAnimationsSwitch}
      isLoading={this.state.isEnableAnimationsLoading}
      />
    )
  }

  ChangeBackgroundColorSection() {
    const [isColorButtonPressed, setIsColorButtonPressed] = React.useState(false)
    const settings = this.props.appState.user.settings
    const isColorSelected = this.state.selectedColor != settings.backgroundColor
    return(
      <Pressable
      onPressIn={() => blinkButton(setIsColorButtonPressed)}
      onPress={() => {
        this.setState({ isBackgroundColorSettingsOpen: !this.state.isBackgroundColorSettingsOpen })
        if (!isColorSelected) this.syncUserSettings()
      }}
      // disabled={null}
      style={[styles.settingsRow, {backgroundColor: isColorButtonPressed ? '#0003' : null }]}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'} }>
          <Icon
          name='color-palette-outline'
          height={relativeToScreen(30)}
          width={relativeToScreen(30)}
          fill={styles.h1.color}
          style={{marginRight: 0}}
          />
          <Text selectable={false} style={[styles.h2, {color: styles.h1.color, marginLeft: relativeToScreen(10)}]}>Tema</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'} }>
          <Icon
          width={relativeToScreen(30)} height={relativeToScreen(30)}
          name={this.state.isBackgroundColorSettingsOpen ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline' }
          fill={styles.h1.color} />
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
    const isColorSelected = this.state.selectedColor == color
    return(
      <Pressable
      onPressIn={ () => blinkButton(setIsColorRowPressed, 300) }
      onPress={ this.onColorButtonPressFor(color) }
      disabled={isLoading}
      style={[styles.colorRow, {
        backgroundColor: isColorRowPressed || isColorSelected ? '#0003' : '#0000',
      }]}
      >
        <Text
        selectable={false}
        style={[
          styles.h3, {
            fontStyle: 'italic',
            textDecorationLine: isColorSelected ? 'underline' : 'none'
          }
        ]}
        >
          { capitalize(color) }
        </Text>
        <View
        style={[ styles.colorSquare, {
          backgroundColor: color,
          borderWidth: isColorSelected ? 3 : 0
        }]}
        />
      </Pressable>
    )
  }

  ColorControl() {
    const isColorSelected = this.state.selectedColor == this.props.appState.user.settings.backgroundColor
    const isLoading = this.state.isRestoreColorLoading || this.state.isSaveColorLoading
    return(
      <View style={[styles.settingsRow, {justifyContent: 'space-between'}]}>
        <Pressable
        disabled={isLoading | isColorSelected}
        style={{ justifyContent: 'center', alignItems: 'center', width: relativeToScreen(95) }}
        onPress={() => {
          this.setState({isRestoreColorLoading: true})
          this.syncUserSettings()
          this.setState({isRestoreColorLoading: false})
        }}
        >
          <Text selectable={false}
            style={[styles.h2, { 
              textAlign: 'center',
              color: isLoading | isColorSelected ? styles.h1.color + '6' : styles.h1.color
            }]}
          >
            { this.state.isRestoreColorLoading ? <ActivityIndicator color='blue' /> :  'Restaurar' }
          </Text>
        </Pressable>

        <Pressable
        disabled={isLoading | isColorSelected}
        onPress={this.onSaveColorButtonPress}
        style={{ justifyContent: 'center', alignItems: 'center', width: relativeToScreen(75) }}
        >
          <Text selectable={false} style={[styles.h2, {width: relativeToScreen(65), textAlign: 'center', color: isLoading | isColorSelected ? styles.h1.color + '6' : styles.h1.color}]}>
            { this.state.isSaveColorLoading ? <ActivityIndicator color='blue' /> : 'Aplicar' }
          </Text>
        </Pressable>
      </View>
    )
  }

  isLoading() {
    return (
      this.state.isDisplayBackgroundImageLoading ||
      this.state.isChangeFontColorLoading ||
      this.state.isRestoreColorLoading ||
      this.state.isEnableHighResolutionLoading ||
      this.state.isSaveColorLoading
    )
  }

  logoutPressable() {
    const [ isLogoutButtonPressed, setIsLogoutButtonPressed ] = React.useState(false)
    const isLoading = this.isLoading()
    const logoutColor = isLoading ? styles.h1.color+'8' : 'red'
    return(
      <Pressable   // logout pressable
      onPressIn={() => blinkButton(setIsLogoutButtonPressed)}
      disabled={isLoading}
      style={[ styles.settingsRow, {
        justifyContent: 'flex-start',
        marginBottom: relativeToScreen(30),
        backgroundColor: isLogoutButtonPressed ? '#0003' : '#0000'
      }]}
      >
        <Icon name='log-out' width={relativeToScreen(30)} height={relativeToScreen(30)} fill={logoutColor} />
        <Text
        selectable={false}
        disabled={isLoading}
        onPressIn={() => blinkButton(setIsLogoutButtonPressed)}
        onPress={() => {
          this.onLogoutButtonPress()
        }}  
        style={[styles.h2, { marginLeft: relativeToScreen(10), color: logoutColor }]}
        >
          { 'Logout' }
        </Text>
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

  async postSettingAndSync(value, settingsVariable, loadingStateVariable, onSuccess=()=>{}) {
    this.setState({ [loadingStateVariable]: true });
    const newSettings = {[settingsVariable]: value}
    const postDisplayResult = await postSettings(newSettings, this.props.appState.user.username)
    if (postDisplayResult.ok) {
      // sync user data with app or entries component
      await this.props.appState.syncUserData()
      onSuccess()
    }
    this.setState({ [loadingStateVariable]: false });
  }

  async onDisplayBackgroundImageSwitch(value) {
    await this.postSettingAndSync(value, 'displayBackgroundImage', 'isDisplayBackgroundImageLoading')
  }

  async onEnableHighResolutionSwitch(value)  {
    await this.postSettingAndSync(value, 'enableHighResolution', 'isEnableHighResolutionLoading')
  }

  async onChangeFontColorSwitch(value) {
    await this.postSettingAndSync(value, 'fontColorDark', 'isChangeFontColorLoading', this.setFontColor)
  }

  async onEnableAnimationsSwitch(value) {
    await this.postSettingAndSync(value, 'enableAnimations', 'isEnableAnimationsLoading')
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
    return <this.SettingsScreen />
  }
}
