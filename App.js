import React, { Component, useContext } from 'react';
import { ImageBackground, View, Text, ActivityIndicator, Platform, Pressable, PlatformColor } from 'react-native';
import { Icon } from 'react-native-eva-icons'
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { LinearGradient } from 'expo-linear-gradient';

import { Today } from './shared/dates'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createDrawerNavigator } from '@react-navigation/drawer';

import EntrancesScreen from './components/EntrancesComponent';
import PostEntranceScreen from './components/PostEntryComponent';
import LoginScreen from './components/LoginComponent'
import SettingsScreen from './components/SettingsScreen';
import { WallpapersComponent } from './components/WallpapersComponent';
import { WallpaperZoom } from './components/WallpaperZoomComponent';
import Charts from './components/Charts'
import UserContext from './shared/UserContext';

import * as Linking from 'expo-linking';
import { relativeToScreen } from './styles/loginStyles';
const linking = {
  prefixes: [Linking.createURL('/'), 'https://luisresende13.github.io/Mood-Tracker'],
  config: {
    screens: {
      Home: {
        screens: {
          Entrances: 'Entrances',
          Settings: 'Settings',
        },
      },
      PostEntrance: 'PostEntrance',
      WallpaperTopics: 'WallpaperTopics',
      Wallpapers: 'Wallpapers',
      WallpaperZoom: 'WallpaperZoom'
    }
  }
};
const loginLinking = {
  prefixes: [Linking.createURL('/'), 'https://luisresende13.github.io/Mood-Tracker'],
  config: {
    screens: {
      Login: 'Login',
    }
  }
};
console.log('CREATE URL: ' + Linking.createURL('/'))

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

const LoadingScreen = () => (
  <ImageBackground source={require('./assets/wallpaper.png')} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <ActivityIndicator size='large' color='#fff' />
  </ImageBackground>
)

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

const WallpaperZoomScreenProvider = (props) => {
  const appState = useContext(UserContext)
  return(
    <WallpaperZoom appState={appState} {...props} />
  )
}

const ChartsScreenProvider = (props) => {
  const appState = useContext(UserContext)
  return(
    <Charts appState={appState} {...props} />
  )
}

const tabBarLabelsMap = {
  'Entrances': 'Entradas',
  'Settings': 'Configurações',
  'Charts': 'Painel'
}
const tabBarIconsMap = {
  'Entrances': 'inbox',
  'Settings': 'settings-2',
  'Charts': 'bar-chart'
}

function tabBarIcon(iconName) {
  const iconFunc = ({ focused, color, size }) => {
    let newIconName = focused
    ? iconName
    : iconName + '-outline';
    return <Icon name={newIconName} width={size} height={size} fill={color}
    style={{  borderBottomWidth: focused ? 1.5 : 0, borderColor: color}}
    />
  }
  return iconFunc
}

const tabNavigatorOptionsProvider = (settings) => {
  const fontColor = settings.fontColorDark ? '#000' : '#fff'
  return ({ route }) => {
    return(
      {
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabel: tabBarLabelsMap[route.name],
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {bottom: relativeToScreen(5), paddingBottom: Platform.OS=='web' ? relativeToScreen(5) : 0},
        tabBarShowLabel: true,
        tabBarIcon: tabBarIcon(tabBarIconsMap[route.name]),
        // tabBarIconStyle: {},
        // tabBarButton: tabBarButton,
        tabBarActiveTintColor: fontColor,
        tabBarInactiveTintColor: fontColor + '6',
        tabBarActiveBackgroundColor: '#0006',
        tabBarInactiveBackgroundColor: '#0000',
        tabBarItemStyle: {borderRadius: 10},
        tabBarStyle: {
          position: 'absolute',
          elevation: 0,
          height: relativeToScreen(55),
          backgroundColor: '#0000',
          borderTopWidth: 0
        },
      }
    )
  }
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTab = (props) => {
  const settings = useContext(UserContext).user.settings
  return(
    <Tab.Navigator
    initialRouteName='Entrances'
    screenOptions={tabNavigatorOptionsProvider(settings)}
    >
      <Tab.Screen
      name="Entrances"
      component={EntrancesScreenProvider}
      initialParams={{
        selectedDate: Today(),
        selectedEntryId: null,
      }}
      />
      <Tab.Screen
      name="Charts"
      component={ChartsScreenProvider}
      />
      <Tab.Screen
      name="Settings"
      component={SettingsScreenProvider}
      initialParams={{
        selectedColor: settings.selectedColor,
      }}
      options={{
        // tabBarIcon: tabBarIcon('settings-2')
      }}
      />
    </Tab.Navigator>    
  )
}

const HomeStack = () => {
  console.log('Returning "HomeScreen" component...')
  const appState = useContext(UserContext)
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
        settings: appState.user.settings
      }}
      />
      <Stack.Screen
      name="PostEntrance"
      component={PostEntranceScreenProvider}
      initialParams={{
        currentEntry: {type: 'new', date: Today(), entry: null},
      }}
      />
      <Stack.Screen
      name="WallpaperTopics"
      component={WallpapersScreenProvider}
      initialParams={{
        headerText: 'Tópicos',
      }}
      />
      <Stack.Screen
      name="Wallpapers"
      component={WallpapersScreenProvider}
      initialParams={{
        headerText: 'Clique em uma imagem para ampliar',
      }}
      />
      <Stack.Screen
      name="WallpaperZoom"
      component={WallpaperZoomScreenProvider}
      />
    </Stack.Navigator>
  )  
}

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      isUserAuth: false,
      isUserDataSyncing: false,
    };

    this.logout = this.logout.bind(this);
    this.getAppState = this.getAppState.bind(this);
    this.syncUserData = this.syncUserData.bind(this);
    this.Login = this.Login.bind(this);
    this.LoginContainer = this.LoginContainer.bind(this);
    this.ContextProvider = this.ContextProvider.bind(this);
  }

  componentDidMount() {
    console.log('App component did mount...')
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
        var UserResult = await fetch( appServerURI + 'Users/' + this.state.user.username, { method: 'GET' });
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

  Login() {
    return(
      <LoginScreen
      user={this.state.user}
      getAppState={this.getAppState}
      setAppState={this.setState.bind(this)}
      />
    )
  }

  LoginContainer() {
    return(
      <NavigationContainer
      linking={loginLinking}
      fallback={<LoadingScreen />}
      >
        <Stack.Navigator 
        initialRouteName='Login'
        screenOptions={{
          headerShown: false,
        }}
        >
          <Stack.Screen
          name="Login"
          component={this.Login}
          />
        </Stack.Navigator>
      </NavigationContainer>    
    )
  }

  ContextProvider() {
    return(
      <UserContext.Provider
      value={{
        ...this.state,
        logout: this.logout,
        setAppState: this.setState.bind(this),
        syncUserData: this.syncUserData
      }}>
          <NavigationContainer
          linking={linking}
          fallback={<LoadingScreen />}
          >
            <HomeStack />
          </NavigationContainer>    
      </UserContext.Provider>
    )
  }
  render() {
    console.log('Rendering "App" component...')
    return !this.state.isUserAuth ? (
      <this.LoginContainer />
    ) : (
      <this.ContextProvider />
    );  
  }
}