import React, { Component, createContext, useContext } from 'react';
import { Image, FlatList, View, Text, SafeAreaView, ImageBackground, Pressable} from 'react-native'
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

const unsplashImages = require('./shared/unsplash_imgs.json')

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const corsURI = Platform.OS == 'web' ? 'https://morning-journey-78874.herokuapp.com/' : ''
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

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
  
const WallpapersComponent = (props) => {

  const Item = (props) => (
    <Pressable
    onPress={() => props.navigation.navigate('WallpaperZoom', {selectedImage: props.item})}
    style={{width: '50%', height: 400}}
    >
      <Image source={{uri: props.item.uri}} style={{width: '100%', height: '100%'}} />
    </Pressable>
  )
    
  const renderItem = ({item}) => (
    <Item item={item} {...props} />
  )

  return(
    <View style={{flex: 1}}>
        <Pressable style={{width: '100%', height: '15%', backgroundColor: '#f4f3f4', alignItems: 'center', justifyContent: 'space-evenly'}}>
          <Text style={{fontSize: 18,  width: 150, textAlign: 'center'}}>Clique em uma imagem para ampliar</Text>
        </Pressable>
        <SafeAreaView style={{height: '80%'}}>
          <FlatList
          data={unsplashImages.filter(item => item.type != 'landscape')}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          />
        </SafeAreaView>
    </View>
  )
}

const WallpaperZoom = (props) => {
  
  const appState = useContext(UserContext)
  const [isSaveImageLoading, setIsSaveImageLoading] = React.useState(false)

  async function onSaveImageButtonPress() {
    // fetch post selected color to user settings in server
    try {
      console.log('POST IMAGE STATUS: Started...')
      setIsSaveImageLoading(true);
      const imageSetting = {
        backgroundImage: props.route.params.selectedImage
      }
      var postImageResult = {ok: false, status: '999', statusText: 'Post not fetched yet.'}
      const postImageSettingOpts = { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( imageSetting ),
      }
      // var postColorResult = await fetch('http://localhost:3000/Users/' + this.context.username + '/settings', postColorSettingOpts);
      postImageResult = await fetch( `${corsURI + appServerURI}Users/${appState.user.username}/settings`, postImageSettingOpts);
      const postColorStatus = 'Status: ' + postImageResult.status + ', ' + postImageResult.statusText

      if (postImageResult.ok) {
        console.log('POST IMAGE STATUS: Successful.')
        console.log(postColorStatus)
            
      } else {
        console.log('POST IMAGE STATUS: Failed. Throwing error...')
        throw new Error(postColorStatus)
      }

    } catch (error) {
      alert('Erro no servidor. Tente novamente...')
      console.log('Erro capturado:')
      console.log(error);

    } finally {
      console.log('POST IMAGE STATUS: Finished.')
      setIsSaveImageLoading(false);
      if (postImageResult.ok) {
        // sync user data with app or entries component
        await props.route.params.syncUserData()
        // navigate back to settings
        props.navigation.navigate('Settings')
      }
    } 
  }

  return(
    <ImageBackground
    source={{uri: props.route.params.selectedImage.uri}}
    style={{flex: 1}}
    >
      <View style={{position: 'absolute', width: '100%', height: null, bottom: 75, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
        <Pressable
        onPress={() => props.navigation.goBack()}
        style={{width: '35%', height: 40, borderRadius: 20, backgroundColor: '#f4f3f4', alignItems: 'center', justifyContent: 'center'}}
        >
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>Voltar</Text>
        </Pressable>
        <Pressable
        onPress={onSaveImageButtonPress}
        style={{width: '35%', height: 40, borderRadius: 20, backgroundColor: '#f4f3f4', alignItems: 'center', justifyContent: 'center'}}
        >
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>Aplicar</Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function tabBarIcon(iconName) {
  const iconFunc = ({ focused, color, size }) => {
    let newIconName = focused
    ? iconName
    : iconName + '-outline';
    return <Icon name={newIconName} width={size} height={size} fill={ focused ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,11)' } />
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
        // user: props.route.params.user,
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
        // user: props.route.params.user,
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
        // user: props.user,
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
        // user: props.user,
        getAppState: props.getAppState,
        setAppState: props.setAppState,
        syncUserData: props.syncUserData,
      }}
      // options={{title: 'Adicione uma  entrada'}}
      />
      <Stack.Screen
      name="Wallpapers"
      component={WallpapersComponent}
      initialParams={{
        getAppState: props.getAppState,
        setAppState: props.setAppState,
        syncUserData: props.syncUserData,
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

export const UserContext = createContext();

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

        var UsersResult = await fetch( corsURI + appServerURI + 'Users', { method: 'GET' });
        const usersStatus =  'Status: ' + UsersResult.status + ', ' + UsersResult.statusText

        if (UsersResult.ok) {
            const users = await UsersResult.json();
            const user = users.filter((user) => user.email === this.state.user.email)[0]
            console.log('fetch GET request for user DATA successful.')
            console.log(usersStatus)
            console.log('SYNC USER DATA STATUS: Successful.')
            this.setState({user: user})

        } else {
            console.log( new Error('"fetch" GET request for user DATA failed. Throwing error...') )
            throw new Error(usersStatus)
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
  

    if (!this.state.isUserAuth) {
      return <LoginScreen
      user={this.state.user}
      getAppState={this.getAppState}
      setAppState={this.setState.bind(this)}
      />

    } else {
      return (

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

        // <NavigationContainer>
        //   <HomeScreen user={this.state.user} />
        // </NavigationContainer>
      );  
    }
  }
}