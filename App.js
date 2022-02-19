import React, { Component } from 'react';
import { Text, ImageBackground} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createDrawerNavigator } from '@react-navigation/drawer';

import EntrancesScreen from './components/EntrancesComponent';
import PostEntranceScreen from './components/PostEntryComponent';
import LoginScreen from './components/LoginComponent'

const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

const HomeScreen = (props) => {

    console.log('Returning "HomeScreen" component...')
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
      initialParams={{user: props.user, posted: {status: false, date: null, entry: null}}}
      // initialParams={{userInfo: props.route.params.userInfo}}
      />
      <Stack.Screen
      name="PostEntrance"
      component={PostEntranceScreen}
      options={{title: 'Adicione uma  entrada'}}
      initialParams={{user: props.user}}
      // initialParams={{userInfo: props.route.params.userInfo}}
      />
    </Stack.Navigator>
  )  
}

// function SettingsScreen() {
//   return(
//     <ImageBackground source={require('./assets/wallpaper.jpg')} style={{width: '100%', height: '100%'}}>
//       <Text>Settings</Text>
//     </ImageBackground>
//   )
// }

// const mainScreenOptions = ({ route }) => ({
//   headerShown: false,
//   tabBarActiveTintColor: 'tomato',
//   tabBarInactiveTintColor: 'gray',
//   tabBarHideOnKeyboard: true,
//   tabBarIcon: ({ focused, color, size }) => {
//     let iconName;
//     if (route.name === 'Home') {
//       iconName = focused
//         ? 'home'
//         : 'home-outline';
//     } else if (route.name === 'Settings') {
//       iconName = focused ? 'settings' : 'settings-outline';
//     }
//     // You can return any component that you like here!
//     return <Icon name={iconName} width={size} height={size} fill='rgb(35,35,35)'></Icon>
//   },
// })

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isUserAuth: false,
      user: null,
    };
    this.authUser = this.authUser.bind(this);
  }

  authUser(user) {
    console.log('User authenticated. Navigating to "HomeScreen"...')
    this.setState( {isUserAuth: true, user} )
  }

  render() {

    if (!this.state.isUserAuth) {
      return <LoginScreen authUser={this.authUser} />

    } else {
      return (

        <NavigationContainer>
          <HomeScreen user={this.state.user} />
        </NavigationContainer>

        // <NavigationContainer>
        //   <Tab.Navigator
        //     screenOptions={mainScreenOptions}
        //   >
        //     <Tab.Screen name="Home" component={HomeScreen} initialParams={{userInfo: this.state.userInfo}}/>
        //     <Tab.Screen name="Settings" component={SettingsScreen} initialParams={{userInfo: this.state.userInfo}} />
        //   </Tab.Navigator>    
        // </NavigationContainer>

      );  
    }
  }
}