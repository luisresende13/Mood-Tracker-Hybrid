import React, { Component, useState, useEffect } from 'react';
import { FlatList, Text, SafeAreaView, Pressable, ActivityIndicator, Dimensions, ImageBackground, Platform, StatusBar } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import * as Device from 'expo-device';
const isWindows = Device.osName == 'Windows'
import { capitalize } from './subcomponents/EditEmotions';

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const corsURI = Platform.OS == 'web' ? 'https://morning-journey-78874.herokuapp.com/' : ''
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

function formatTopicName(name){
  return capitalize(name.split('-').join(' '))
}

function buildApiUriParams(params) {
  var uriParams = []
  Object.keys(params).forEach( key => uriParams.push(key+'='+params[key]) )
  return '?' + uriParams.join('&')
}

const styles = {
  mainView: {
    height: '100%',
    width: '100%',
    // paddingTop: StatusBar.currentHeight
  },
  photosView: {
    height: '100%',
    width: '100%' ,
  },
  h1: {
    fontSize: 26,
    alignSelf: 'center',
    // borderWidth: 1
  },
  header: {
    position: 'absolute',
    top: 0,
    paddingTop: StatusBar.currentHeight,
    width: '100%',
    height: '20%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  headerLabel: {
    // borderWidth: 1,
    width: '70%',
    fontSize: 22,
    alignSelf: 'center',
    textAlign: 'center',
  },
  status: {
    backgroundColor: 'rgb(230,230,230)',
    width: '100%',
    height: '20%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusText: {
    fontSize: 18,
    color: 'black'
  },
  image: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
}

async function getUnsplash(endpoint, params) {
  console.log('UNSPLASH GET PHOTOS STATUS: STARTED...')
  const reqParams = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: endpoint,
      queryParams: params,
    }),
  }
  var result, result_json, success
  try {
    result = await fetch(corsURI + appServerURI + 'api/unsplash', reqParams)
    if (result.ok) {
      console.log(`UNSPLASH PHOTOS STATUS: FETCH SUCCESSFULL...`)

      // let a = 'x-ratelimit-limit'
      // let b = 'x-ratelimit-remaining'
      // const headers = result.headers
      // var limit, remaining
      // switch (Platform.OS) {
      //   case 'android':
      //     limit = headers.map[a]
      //     remaining = headers.map[b]          
      //     break;
      //   case 'web':
      //     limit = headers.get(a)
      //     remaining = headers.get(b)
      //     break
      //   default:
      //     limit = headers.get(a)
      //     remaining = headers.get(b)
      //     break
      // }
      // console.log(`UNSPLASH PHOTOS STATUS:\n  x-ratelimit-limit: ${limit}\n  x-ratelimit-remaining: ${remaining}`)

      result_json = await result.json()
      success = result_json.length
      if (success) {
        console.log(`UNSPLASH PHOTOS STATUS: JSON RESULT SUCCESSFULL. RETRIEVED ${success} PHOTOS...`)
        return result_json

      } else {
        console.log(`UNSPLASH PHOTOS STATUS: JSON RESULT FAILED. Logging json value...`)
        console.log(result_json)
        return null
      }
    } else {
      console.log(`UNSPLASH GET PHOTOS STATUS: FETCH FAILED. Status code: ${result.status}, Text: ${result.statusText}..`)
    }
  } catch (error) {
    console.log('UNSPLASH GET PHOTOS STATUS: ERROR CATCHED. LOGGING ERROR...')
    console.log(error)
    return null
  }
}

const Item = (props) => {
  const topicsScreen = props.route.name == 'WallpaperTopics'
  const photoURI = topicsScreen ? props.item.cover_photo.urls.regular : props.item.urls.regular
  const nextScreenName = topicsScreen ? 'Wallpapers' : 'WallpaperZoom'
  
  const screenHeight = props.windowHeight + (Platform.OS != 'web' ? StatusBar.currentHeight : 0)
  const photoHeight = topicsScreen ? ( isWindows ? screenHeight/3  : screenHeight/4 ) : ( isWindows ? screenHeight/2 : screenHeight/2 )
  const photoWidth = topicsScreen ? ( isWindows ? '33.333333%' : '50%' ) : ( isWindows ? '50%' : '50%' )
  return(
    <Pressable
      onPress={() => props.navigation.navigate( nextScreenName , { selectedImage: props.item })}
      style={[{ minHeight: 70, height: photoHeight, width: photoWidth, margin: 0}]}
    >
      <ImageBackground source={{ uri:  photoURI }} style={styles.image} >
        <Text style={[styles.h1, {width: '80%', color: 'white', textAlign: 'center'}]}>{ topicsScreen ? formatTopicName(props.item.slug) : '' }</Text>
      </ImageBackground>
    </Pressable>
  )
};

export class WallpapersComponent extends Component {

  constructor(props) {
    super(props);
    this.state={
      photos: null,
      page: null,
      windowHeight: Dimensions.get('window').height,
      isPhotosLoading: false,
      hideHeader: false,
    };
    this.initializePhotosAsync = this.initializePhotosAsync.bind(this);
    this.WallpapersHeaderText = this.WallpapersHeaderText.bind(this);
    this.WallpapersHeader = this.WallpapersHeader.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.PhotoList = this.PhotoList.bind(this);
    this.ControlButtons = this.ControlButtons.bind(this);
    this.loadNextPagePhotosAsync = this.loadNextPagePhotosAsync.bind(this);
  }

  componentDidMount() {
    console.log('"Wallpapers" component did mount...')
    // StatusBar.setStatusBarTranslucent(true)
    this.initializePhotosAsync()
  }

  async initializePhotosAsync() {
    this.setState({isPhotosLoading: true})
    let route = this.props.route
    if (route.name=='WallpaperTopics') {
      let asyncResult = await getUnsplash(`topics`, {page: 1, per_page: 30, order_by: 'position'})
      this.setState({photos: asyncResult}) 

    } else {
      let endpoint = `topics/${route.params.selectedImage.id}/photos`
      let asyncResult = await getUnsplash(endpoint, {page: 1, per_page: 30, order_by: 'popular', orientation: 'portrait'})
      this.setState({photos: [ route.params.selectedImage.cover_photo, ...asyncResult ], page: 1}) 
    }
    this.setState({isPhotosLoading: false}) 
  }  

  async loadNextPagePhotosAsync() {
    console.log('LOAD NEXT PHOTOS PAGE STATUS: STARTED... ')
    this.setState({isPhotosLoading: true})
    let endpoint = `topics/${this.props.route.params.selectedImage.id}/photos`
    let asyncResult = await getUnsplash(endpoint, {page: this.state.page+1, per_page: 30, order_by: 'popular', orientation: 'portrait'})
    if (asyncResult) {
      console.log('LOAD NEXT PHOTOS PAGE STATUS: SUCCESSFUL! ')
      this.setState((prevState) => ({
          photos: [ ...prevState.photos, ...asyncResult ],
          page: prevState.page+1,
        }))   
    } else {
      console.log('LOAD NEXT PHOTOS PAGE STATUS: FAILED! ')
    }
      console.log('LOAD NEXT PHOTOS PAGE STATUS: FINISHED. ')
      this.setState({isPhotosLoading: false})
  }

  renderItem = ({ item }) => (
    <Item item={item} windowHeight={this.state.windowHeight} {...this.props} />
  );

  WallpapersHeader () {
    const hideHeader = this.state.hideHeader
    const topicsScreen = this.props.route.name == 'WallpaperTopics'
    return(
      !hideHeader ? (
        <Pressable
        style={[ styles.header, {height: topicsScreen ? '20%' : '23%' } ]}
        onPress={() => {this.setState({ hideHeader: true }); console.log('close button clicked...')}}
        >
          <this.WallpapersHeaderText hideHeader={hideHeader} />
        </Pressable>  
      ) : (
        null
      )
    )
  }

  WallpapersHeaderText () {
    const topicsScreen = this.props.route.name=='WallpaperTopics'
    return(
      this.state.isPhotosLoading ? (
        <ActivityIndicator size='large' color='black' />
      ) : (
        this.state.photos ? (
          <>
            { !topicsScreen ? <Text style={[styles.h1]}>{ formatTopicName(this.props.route.params.selectedImage.slug) }</Text> : null }
            <Text
            style={[styles.headerLabel, {fontSize: topicsScreen ? 26 : 22 }]}
            >
              { this.props.route.params.headerText }</Text>
          </>
        ) : (
          <Text style={styles.headerLabel}>Erro ao carregar imagems...</Text>
        )
     )
    )
  }
  
  PhotoList = () => {
  
    useEffect(() => {
      const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
        const windowHeightDifference = Math.abs(this.state.windowHeight-window.height)
        if ( windowHeightDifference > 100) {
          this.setState({windowHeight: window.height})
        }
      });
      return () => subscription?.remove();
    });

    return(
      <FlatList
        data={ this.state.photos }
        renderItem={ this.renderItem }
        keyExtractor={ item => item.id }
        numColumns={ isWindows ? 3  : 2 }
        initialNumToRender={ null }
        onEndReached={ this.props.route.name == 'WallpaperTopics' ? null : this.loadNextPagePhotosAsync }
        refreshing={ this.state.isPhotosLoading }
        />
    )
  }

  ControlButtons() {
    const topRight = {
      top: Platform.OS != 'web' ? StatusBar.currentHeight : 0,
      right: 0,
      margin: '1.5%',
      backgroundColor: '#fff0',
    }

    return(
      !this.state.hideHeader ? (
        <Pressable
        style={[{
          position: 'absolute',
          width: 30,
          height: 30,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 30/2,
        },
        topRight
        ]}
        onPress={() => this.setState({hideHeader: true})}
        >
          <Icon name='close' width={30} height={30} fill='#fff' />
        </Pressable>
      ) : (
        null
      )
    )
  }

  render() {
    console.log('Rendering "Wallpapers" component...')
    const settings = this.props.appState.user.settings
    return (
      <SafeAreaView style={styles.mainView}>
        <SafeAreaView style={[styles.photosView, {backgroundColor: settings.backgroundColor}]}>
          <this.PhotoList />
          <this.WallpapersHeader />
          <this.ControlButtons />
        </SafeAreaView>
      </SafeAreaView>
    );  
  }

}