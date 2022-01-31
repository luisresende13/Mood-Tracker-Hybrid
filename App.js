import { Icon } from 'react-native-eva-icons'

import React, { Component } from 'react';0
import { View, Text, ImageBackground, TextInput, Pressable } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createDrawerNavigator } from '@react-navigation/drawer';

import EntrancesScreen from './components/EntrancesComponent';
import PostEntranceScreen from './components/PostEntryComponent';
import LoginScreen from './components/LoginComponent'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeScreen(props) {
  return(    
    <Stack.Navigator 
    initialRouteName='Entrances' 
    screenOptions={{
      headerShown: false,
    }}
    > 
      <Stack.Screen
      name="Entrances"
      component={EntrancesScreen}
      options={{title: 'Suas entradas'}}
      initialParams={{userInfo: props.route.params.userInfo}}
      />
      <Stack.Screen
      name="PostEntrance"
      component={PostEntranceScreen}
      options={{title: 'Adicione uma  entrada'}}
      initialParams={{userInfo: props.route.params.userInfo}}
      />
    </Stack.Navigator>
  )
}

function SettingsScreen() {
  return(
    <ImageBackground source={require('./assets/wallpaper.jpg')} style={{width: '100%', height: '100%'}}>
      <Text>Settings</Text>
    </ImageBackground>
  )
}

const mainScreenOptions = ({ route }) => ({
  headerShown: false,
  tabBarActiveTintColor: 'tomato',
  tabBarInactiveTintColor: 'gray',
  tabBarHideOnKeyboard: true,
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;
    if (route.name === 'Home') {
      iconName = focused
        ? 'book'
        : 'book-outline';
    } else if (route.name === 'Settings') {
      iconName = focused ? 'settings' : 'settings-outline';
    }
    // You can return any component that you like here!
    return <Icon name={iconName} width={size} height={size} fill='grey'></Icon>
  },
})

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isUserAuth: false,
      userInfo: null,
    };
    this.authUser = this.authUser.bind(this);
  }

  authUser(userInfo) {
    this.setState( {isUserAuth: true, userInfo: userInfo} )
  }

  render() {

    if (!this.state.isUserAuth) {
      return <LoginScreen authUser={this.authUser} />
    } else {
      return (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={mainScreenOptions}
          >
            <Tab.Screen name="Home" component={HomeScreen} initialParams={{userInfo: this.state.userInfo}}/>
            <Tab.Screen name="Settings" component={SettingsScreen} initialParams={{userInfo: this.state.userInfo}} />
          </Tab.Navigator>    
        </NavigationContainer>
      );  
    }
  }
} 

export default App;