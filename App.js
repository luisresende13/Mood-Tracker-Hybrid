import React, { Component } from 'react';
import { View, Text, Button, ImageBackground} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createDrawerNavigator } from '@react-navigation/drawer';

// Custom Components
import EntrancesScreen from './components/EntrancesComponent';
import PostEntranceScreen from './components/PostEntryComponent';
import LoginScreen from './components/LoginComponent'

const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// const EntrancesScreen = (props) => (
//   <View style={styles.app.background}>
//   <Button title='Tela de entradas. Clique para postar...' onPress={() => props.navigation.navigate('PostEntrance') }>
//     <Text></Text>
//   </Button>
//   </View>
// )

// const PostEntranceScreen = (props) => (
//   <View style={styles.app.background}>
//   <Button title='Tela de postar entradas. Clique para voltar...' onPress={() => props.navigation.navigate('Entrances') }>
//   </Button>
//   </View>
// )

// const LoginScreen = (props) => (
//   <View style={styles.app.background}>
//   <Button title='Clique para entrar' onPress={() => props.authUser({username: 'example', password: 'example', email: 'email@example.com'})}>
//   </Button>
//   </View>
// )

const HomeScreen = (props) => {

  console.log('Returning "HomeScreen" Component...')
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
      initialParams={{userInfo: props.userInfo}}
      // initialParams={{userInfo: props.route.params.userInfo}}
      />
      <Stack.Screen
      name="PostEntrance"
      component={PostEntranceScreen}
      options={{title: 'Adicione uma  entrada'}}
      initialParams={{userInfo: props.userInfo}}
      // initialParams={{userInfo: props.route.params.userInfo}}
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
      userInfo: null,
    };

    this.authUser = this.authUser.bind(this);
  }

  authUser(userInfo) {
    console.log('User authenticated. Navigating to "Entries" screen...')
    this.setState( {isUserAuth: true, userInfo} )
  }

  render() {

    if (!this.state.isUserAuth) {
      return <LoginScreen authUser={this.authUser} />

    } else {
      return (

        <NavigationContainer>
          <HomeScreen userInfo={this.state.userInfo} />
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

const styles = {
  app: {
    background: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'  
    }
  }
}