import React, { useContext } from 'react';
import { View, Text, ImageBackground, Pressable, ActivityIndicator, Platform } from 'react-native';
import UserContext from '../shared/UserContext';

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const corsURI = Platform.OS == 'web' ? 'https://morning-journey-78874.herokuapp.com/' : ''
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

export function WallpaperZoom(props) {

  const appState = useContext(UserContext);
  const [isSaveImageLoading, setIsSaveImageLoading] = React.useState(false);

  async function onSaveImageButtonPress() {
    // fetch post selected color to user settings in server
    try {
      console.log('POST IMAGE STATUS: Started...');
      setIsSaveImageLoading(true);
      const imageSetting = {
        backgroundImage: props.route.params.selectedImage
      };
      var postImageResult = { ok: false, status: '999', statusText: 'Post not fetched yet.' };
      const postImageSettingOpts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageSetting),
      };
      // var postColorResult = await fetch('http://localhost:3000/Users/' + this.context.username + '/settings', postColorSettingOpts);
      postImageResult = await fetch(`${corsURI + appServerURI}Users/${appState.user.username}/settings`, postImageSettingOpts);
      const postColorStatus = 'Status: ' + postImageResult.status + ', ' + postImageResult.statusText;

      if (postImageResult.ok) {
        console.log('POST IMAGE STATUS: Successful.');
        console.log(postColorStatus);

      } else {
        console.log('POST IMAGE STATUS: Failed. Throwing error...');
        throw new Error(postColorStatus);
      }

    } catch (error) {
      alert('Erro no servidor. Tente novamente...');
      console.log('Erro capturado:');
      console.log(error);

    } finally {
      console.log('POST IMAGE STATUS: Finished.');
      setIsSaveImageLoading(false);
      if (postImageResult.ok) {
        // sync user data with app or entries component
        await props.route.params.syncUserData();
        // navigate back to settings
        props.navigation.navigate('Settings');
      }
    }
  }

  console.log('Returning "WallpaperZoom" component...')

  return (
    <ImageBackground
      source={{ uri: props.route.params.selectedImage.urls.regular }}
      style={{ flex: 1 }}
    >
      <View style={{ position: 'absolute', width: '100%', height: null, bottom: '10%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <Pressable
          onPress={() => props.navigation.goBack()}
          style={{ width: '35%', height: 40, borderRadius: 20, backgroundColor: '#f4f3f4', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Voltar</Text>
        </Pressable>
        <Pressable
          onPress={onSaveImageButtonPress}
          style={{ width: '35%', height: 40, borderRadius: 20, backgroundColor: '#f4f3f4', alignItems: 'center', justifyContent: 'center' }}
        >
          {isSaveImageLoading ? (
            <ActivityIndicator color='black' />
          ) : (
            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Aplicar</Text>
          )}
        </Pressable>
      </View>
    </ImageBackground>
  );
}
