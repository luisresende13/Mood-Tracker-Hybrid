import React, { useContext, useState } from 'react';
import { View, Text, Image, ImageBackground, Pressable, ActivityIndicator, Platform, Linking } from 'react-native';
// import { postDisplayBackgroundImage } from './SettingsScreen';
import { blinkButton, postSettings } from './SettingsScreen';
import UserContext from '../shared/UserContext';

var styles = {
  fotter: {
    position: 'absolute',
    bottom: 0,
    height: '22%',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  controlView: {
    // flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  attributionView: {
    // flex: 0.6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
 controlButton: {
    width: '35%',
    height: 40,
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: '#f4f3f4',
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlButtonLabel: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold'
  },
  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  attributionLabel: {
    color: 'white',
    fontSize: 14,
    fontStyle: 'italic',
    paddingLeft: 10,
    textAlign: 'left',
    maxWidth: '78%',
  },
  attributionURL: {
    textDecorationLine: 'underline'
  },
}

const openUserProfileFor = (userProfileHtmlLink) => {
  return function () {
    Linking.openURL( userProfileHtmlLink + '?utm_source=Mood-Tracker&utm_medium=referral');
  } 
}

const openUnsplashURL = () => {
  Linking.openURL('https://unsplash.com/?utm_source=Mood-Tracker&utm_medium=referral')
}

function ControlButton({title, onPress, isLoading}) {
  const [ isClicked, setIsClicked ] = useState(false)
  return(
    <Pressable
    onPressIn={() => blinkButton(setIsClicked, 300)}
    onPress={onPress}
    style={[styles.controlButton, {
      backgroundColor: styles.controlButton.backgroundColor.slice(0,4) + ( isClicked ? '4' : '8' ),
      borderColor: styles.controlButton.borderColor.slice(0,4) + ( isClicked ? '4' : '8' )
    }]}
    >
      {isLoading ? (
        <ActivityIndicator color='blue' />
      ) : (
        <Text selectable={false} style={[styles.controlButtonLabel, {
          color: styles.controlButtonLabel.color + ( isClicked ? '8' : 'f' )
        }]}
        >
          { title }
        </Text>
      )}
    </Pressable>

  )
}

export function WallpaperZoom(props) {

  const appState = useContext(UserContext);
  const settings = appState.user.settings
  const [isSaveImageLoading, setIsSaveImageLoading] = React.useState(false);

  async function onSaveImageButtonPress() {
    // fetch post selected color to user settings in server
    console.log('POST IMAGE STATUS: Started...');
    setIsSaveImageLoading(true);
    const imageSetting = {
      backgroundImage: props.route.params.selectedImage
    };

    const postImageResult = await postSettings(imageSetting, appState.user.username)
    if (postImageResult.ok) {
      // sync user data with app or entries component
      if (!settings.displayBackgroundImage) {
        await postSettings({displayBackgroundImage: true}, appState.user.username)
      }

      await props.appState.syncUserData();
      // navigate back to settings
      setIsSaveImageLoading(false);
      props.navigation.navigate('Settings');
    } else {
      setIsSaveImageLoading(false);
    }
    console.log('POST IMAGE STATUS: Finished.');
  }

  console.log('Returning "WallpaperZoom" component...')

  const fontColorDark = settings.fontColorDark
  const fontColor = fontColorDark ? '#000' : '#fff'
  const altFontColor = fontColorDark ? '#fff' : '#000'
  for (let label of ['attributionLabel', 'controlButtonLabel']) {
    styles[label] = { ...styles[label], color: fontColor }
  }
  styles.controlButton = { ...styles.controlButton, backgroundColor: altFontColor + '8', borderColor: fontColor + '8' }

  const selectedImage = props.route.params.selectedImage
  const imgURI = settings.enableHighResolution ? selectedImage.urls.raw : selectedImage.urls.regular

  return (
    <ImageBackground
      source={{ uri: imgURI }}
      style={{ flex: 1, backgroundColor: settings.backgroundColor }}
    >
      <View style={styles.fotter}>
        <View style={styles.controlView}>
          <ControlButton
          title={'Voltar'}
          onPress={props.navigation.goBack}
          isLoading={false}
          />
          <ControlButton
          title={'Aplicar'}
          onPress={onSaveImageButtonPress}
          isLoading={isSaveImageLoading}
          />
        </View>
        <View style={styles.attributionView}>
          <Image
          source={{ uri: selectedImage.user.profile_image.large }}
          style={styles.userProfileImage} />
          <Text style={styles.attributionLabel}>
            {'Photo by '}
            <Text
            onPress={openUserProfileFor(selectedImage.user.links.html)}
            style={styles.attributionURL} >{ selectedImage.user.name }</Text>
            {' on '}
            <Text
            onPress={openUnsplashURL}
            style={styles.attributionURL}>{ 'Unsplash' }</Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
