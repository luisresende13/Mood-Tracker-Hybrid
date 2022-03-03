import React, { Component, createContext, useContext } from 'react';
import { Dimensions, StatusBar, Platform } from 'react-native'; 
import { Icon } from 'react-native-eva-icons'
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createDrawerNavigator } from '@react-navigation/drawer';

import EntrancesScreen from './components/EntrancesComponent';
import PostEntranceScreen from './components/PostEntryComponent';
import LoginScreen from './components/LoginComponent'
import SettingsScreen from './components/SettingsScreen';
import UserContext from './shared/UserContext';
import { WallpapersComponent } from './components/WallpapersComponent';
import { WallpaperZoom } from './components/WallpaperZoomComponent';

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const corsURI = Platform.OS == 'web' ? 'https://morning-journey-78874.herokuapp.com/' : ''
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

const unsplashTopics = require('./shared/unsplashTopics.json')

const window = Dimensions.get('window')
const windowHeight = window.height;
const screenHeight = windowHeight + StatusBar.currentHeight


const SettingsScreenProvider = (props) => {
  const appState = useContext(UserContext)
  return(
    <SettingsScreen  appState={appState} {...props} />
  )
}

const EntrancesScreenProvider = (props) => {
  const appState = useContext(UserContext)
  return(
    <EntrancesScreen  appState={appState} {...props} />
  )
}

const PostEntranceScreenProvider = (props) => {
  const appState = useContext(UserContext)
  return(
    <PostEntranceScreen  appState={appState} {...props} />
  )
}

const WallpapersScreenProvider = (props) => {
  const appState = useContext(UserContext)
  return(
    <WallpapersComponent  appState={appState} {...props} />
  )
}
  
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function tabBarIcon(iconName) {
  const iconFunc = ({ focused, color, size }) => {
    let newIconName = focused
    ? iconName + '-outline'
    : iconName + '-outline';
    return <Icon name={newIconName} width={size} height={size} fill={ focused ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.6)' } />
  }
  return iconFunc
}

const HomeTab = (props) => {

  const appState = useContext(UserContext)

  const mainScreenOptions = ({ route }) => ({
    headerShown: false,
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: true,
    tabBarBackground: () => (
      <LinearGradient
        colors={['#f4f3f4', route.name=='Settings' ? route.params.selectedColor : appState.user.settings.backgroundColor, '#f4f3f4']}
        start={[route.name=='Entrances' ? -0.5 : 1.5, 1]}
        end={[route.name=='Entrances' ? 1 : 0, 1]}
        location={[0, 0.5, 1]}
        style={{flex: 1}}
      />
    ),
  })

  return(
    <Tab.Navigator
    initialRouteName='Entrances'
    screenOptions={mainScreenOptions}
    >
      <Tab.Screen
      name="Entrances"
      component={EntrancesScreenProvider}
      initialParams={{
        getAppState: props.route.params.getAppState,
        setAppState: props.route.params.setAppState,
        syncUserData: props.route.params.syncUserData,
      }}
      options={{
        tabBarIcon: tabBarIcon('inbox')
      }}
      />
      <Tab.Screen
      name="Settings"
      component={SettingsScreenProvider}
      initialParams={{
        logout: props.route.params.logout,
        getAppState: props.route.params.getAppState,
        setAppState: props.route.params.setAppState,
        syncUserData: props.route.params.syncUserData,
      }}
      options={{
        tabBarIcon: tabBarIcon('settings-2')
      }}
      />
    </Tab.Navigator>    
  )
}

const HomeStack = (props) => {

  console.log('Returning "HomeScreen" component...')
  return(
    <Stack.Navigator 
    initialRouteName='Home'
    screenOptions={{
      headerShown: false,
    }}
    >
      <Stack.Screen
      name="Home"
      component={HomeTab}
      initialParams={{
        logout: props.logout,
        getAppState: props.getAppState,
        setAppState: props.setAppState,
        syncUserData: props.syncUserData,
      }}
      // options={{title: 'Suas entradas'}}
      />
      <Stack.Screen
      name="PostEntrance"
      component={PostEntranceScreenProvider}
      initialParams={{
        getAppState: props.getAppState,
        setAppState: props.setAppState,
        syncUserData: props.syncUserData,
      }}
      // options={{title: 'Adicione uma  entrada'}}
      />
      <Stack.Screen
      name="WallpaperTopics"
      component={WallpapersScreenProvider}
      initialParams={{
        // photoList: unsplashTopics,
        headerText: 'Tópicos',
        getAppState: props.getAppState,
        setAppState: props.setAppState,
        syncUserData: props.syncUserData
      }}
      />
      <Stack.Screen
      name="Wallpapers"
      component={WallpapersScreenProvider}
      initialParams={{
        photoList: [],
        headerText: 'Clique em uma imagem para ampliar',
        getAppState: props.getAppState,
        setAppState: props.setAppState,
        syncUserData: props.syncUserData
      }}
      />
      <Stack.Screen
      name="WallpaperZoom"
      component={WallpaperZoom}
      initialParams={{
        getAppState: props.getAppState,
        setAppState: props.setAppState,
        syncUserData: props.syncUserData,
      }}
      />
    </Stack.Navigator>
  )  
}

// export const UserContext = createContext();

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isUserAuth: false,
      user: null,
      isUserDataSyncing: false,
      // userDataSynced: false
    };

    this.logout = this.logout.bind(this);
    this.getAppState = this.getAppState.bind(this);
    this.syncUserData = this.syncUserData.bind(this);
  }

  logout() {
    console.log('User logged out. Navigating to "LoginScreen"...')
    this.setState({isUserAuth: false, user: null})
  }

  getAppState() {
    return this.state
  }

  async syncUserData() {
    console.log('SYNC USER DATA STATUS: Started...')
    this.setState({ isUserDataSyncing: true });
    try {
        var UserResult = await fetch( corsURI + appServerURI + 'Users/' + this.state.user.username, { method: 'GET' });
        const userStatus =  'Status: ' + UserResult.status + ', ' + UserResult.statusText
        if (UserResult.ok) {
            console.log('fetch GET request for user DATA successful.')
            console.log(userStatus)
            console.log('SYNC USER DATA STATUS: Successful.')
            const user = await UserResult.json();
            this.setState({user: user})
        } else {
            console.log( new Error('"fetch" GET request for user DATA failed. Throwing error...') )
            throw new Error(userStatus)
        }
    } catch (error) {
            console.log('SYNC USER DATA STATUS: Error captured. Printing error...')
            console.log(error);
            alert('Não foi possível sincronizar as entradas. Por favor, aguarde..')
    } finally {
        this.setState({ isUserDataSyncing: false });
        console.log('SYNC USER DATA STATUS: Finished.')
    }    
}

  render() {
    return !this.state.isUserAuth ? (
      <LoginScreen
      user={this.state.user}
      getAppState={this.getAppState}
      setAppState={this.setState.bind(this)}
      />
    ) : (
      <UserContext.Provider value={this.state}>
          <NavigationContainer>
            <HomeStack
            user={this.state.user}
            logout={this.logout}
            getAppState={this.getAppState}
            setAppState={this.setState.bind(this)}
            syncUserData={this.syncUserData}
            />
          </NavigationContainer>    
      </UserContext.Provider>
    );  
  }
}