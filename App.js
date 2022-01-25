//import Ionicons from 'react-native-vector-icons/Ionicons';
// import Ionicons from ' @expo/vector-icons/Ionicons';
import { Icon } from 'react-native-eva-icons'

import React from 'react';
import { Text, ImageBackground } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createDrawerNavigator } from '@react-navigation/drawer';

import EntrancesScreen from './components/EntrancesComponent';
import PostEntranceScreen from './components/PostEntryComponent';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// function EntrancesScreen() {
//   return(
//     <ImageBackground source={require('./assets/wallpaper.jpg')} style={{width: '100%', height: '100%'}}>
//       <Text>Entrances Screen</Text>
//     </ImageBackground>
//   )
// }
// function PostEntranceScreen() {
//   return(
//     <ImageBackground source={require('./assets/wallpaper.jpg')} style={{width: '100%', height: '100%'}}>
//       <Text>Post Entrance Screen</Text>
//     </ImageBackground>
//   )
// }

function HomeScreen() {
  return(    
    <Stack.Navigator 
    initialRouteName='Entrances' 
    screenOptions={{
      headerShown: true,
    }}
    > 
      <Stack.Screen
      name="Entrances"
      component={EntrancesScreen}
      options={{title: 'Suas entradas'}}
      />
      <Stack.Screen
      name="PostEntrance"
      component={PostEntranceScreen}
      options={{title: 'Adicione uma  entrada' }}
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

export default function App() {
  return (
    <NavigationContainer>

      <Tab.Navigator
        screenOptions={mainScreenOptions}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>

    </NavigationContainer>
  );
} 