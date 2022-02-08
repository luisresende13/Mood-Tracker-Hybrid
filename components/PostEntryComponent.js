import React, { Component } from 'react';
import { View, Text, ImageBackground, Pressable, ScrollView, Platform, TextInput } from 'react-native';
// import { TextInput } from 'react-native-gesture-handler';
import { Icon } from 'react-native-eva-icons'

import styles from '../styles/postEntryStyles'

// Geocoding and weather dependencies and APIs
import * as Location from 'expo-location';
import GoogleMapsAPI from './subcomponents/GoogleMapsAPI'
Location.setGoogleApiKey(GoogleMapsAPI.GoogleMapsGeocodingAPIKey)
import OpenWeatherMapAPI from './subcomponents/OpenWeatherMapAPI';

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const corsURI = Platform.OS == 'web' ? 'https://morning-journey-78874.herokuapp.com/' : ''
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

// Date() => wed jan 91 2022 07:46:57 ...
const now = new Date().toString().split(' ')
const datetime = now[2] + ' ' + now[1] + ' ' + now[3] + ' - ' + now[4].slice(0, 5)

// Mood configs
const moodColors = ['#ff3333', '#0099cc', 'lightblue', '#ffff33', '#00b300']
const moods = ['Horrível', 'Mal', 'Regular', 'Bem', 'Ótimo']

// Emotion configs
const emotionGroupsNames = [ 'Bem & Energizado', 'Bem & Calmo', 'Mal e Energizado', 'Mal & Calmo' ]

const goodEnergizedEmotions = ['Animação', 'Concentração', 'Desinibição', 'Motivação', 'Euforia']
const goodCalmEmotions = ['Alívio', 'Calma', 'Conforto', 'Despreocupação', 'Inspiração', 'Orgulho', 'Paz', 'Relaxamento', 'Satisfação', 'Segurança']
const badEnergizedEmotions = ['Agitação', 'Ansiedade', 'Tristeza', 'Decepção', 'Depressão', 'Desespero', 'Frustração', 'Insatisfação', 'Irritação', 'Medo', 'Paranoia', 'Preocupação', 'Impaciencia', 'Raiva', 'Revolta', 'Sobrecarregado(a)', 'Tensão', 'Nojo']
const badCalmEmotions = ['Timidez', 'Cansaço', 'Confusão', 'Desanimo', 'Vergonha', 'Insegurança', 'Apátia', 'Solidão', 'Tédio']

const basicEmotions = [ ...goodEnergizedEmotions, ...goodCalmEmotions, ...badEnergizedEmotions, ...badCalmEmotions ]
const emotionGroups = [ goodEnergizedEmotions, goodCalmEmotions, badEnergizedEmotions, badCalmEmotions ]

var isSelectedEmotions = {}
for ( let emotion of basicEmotions){
    isSelectedEmotions[emotion] = false
}

// Date config
const monthSigs = ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec']
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

const monthNameMap = {
    '01': 'Janeiro',
    '02': 'Fevereiro',
    '03': 'Março',
    '04': 'Abril',
    '05': 'Maio',
    '06': 'Junho',
    '07': 'Julho',
    '08': 'Agosto',
    '09': 'Setembro',
    '10': 'Outubro',
    '11': 'Novembro',
    '12': 'Dezembro',
}

// Functions

function convertMonthSig(monthSig) {
    const thisMonth = months[monthSigs.indexOf(monthSig)]
    return thisMonth
}

function Today() {
    const now = Date().toString().split(' ')
    const today = [ now[3], convertMonthSig(now[1]), now[2] ].join('-')
    return today
}

function getTime() {
    //Wed,Jan,26,2022,15:12:37,GMT-0300,(Horário,Padrão,de,Brasília)
    const now = Date().toString().split(' ')
    const time = now[4]
    return time
}

function oneDigit(stringNumber) {
    if (stringNumber[0] == '0') return stringNumber.slice(1, stringNumber.length)
    else return stringNumber
}

function formatPostEntryDatetimeTitle(date, time) {
    const ymd = date.split('-')
    const m = monthNameMap[ ymd[1] ]
    return oneDigit( ymd[2] ) + ' ' + m + ' ' + ymd[0] + ' - ' + time.slice(0,5)
}

function formattedAddress(addressObj) {
    return addressObj.street + ', ' + addressObj.streetNumber + ' - ' + addressObj.district + ', ' + addressObj.subregion + '. ' + addressObj.region + ', ' + addressObj.isoCountryCode + '.'
}

export default class PostEntranceScreen extends Component {
  
    constructor(props) {
        super(props);

        this.state = {
            
            date: Today(),
            startTime: getTime(),
            star: false,
            selectedMood: '',
            emotions: [],
            jornalEntry: '',    
            address: {},
            weather: {},

            selectedEntry: 'Avaliação',
            isSelectedEmotions: isSelectedEmotions,
            isLoading: false,
            isFetchingLocationOrWeather: false,

            locationServiceEnabled: null,
            userCoordinates: null,
            userAddressList: [],
        };

        this.onSaveButtonPress = this.onSaveButtonPress.bind(this);
        this.EmotionButtons = this.EmotionButtons.bind(this);
        this.MoodButtons = this.MoodButtons.bind(this);
        this.postEntryHeader = this.postEntryHeader.bind(this);
        this.onEmotionButtonPress = this.onEmotionButtonPress.bind(this);
        this.onMoodButtonPress = this.onMoodButtonPress.bind(this);
        this.inputSection = this.inputSection.bind(this);
        this.setSelectedEntry = this.setSelectedEntry.bind(this);
        this.InputCard = this.InputCard.bind(this);
        this.JornalInput = this.JornalInput.bind(this);
        this.postNewEntryAsync = this.postNewEntryAsync.bind(this);
    }

    componentDidMount() {
        this.setState({isFetchingLocationOrWeather: true})
        console.log('PostEntryScreen component did mount. Fetching user position and weather data...')
        this.checkIfLocationEnabled();
        this.getCurrentLocation();
    }
    
    async fetchWeather() {

        try {

            if (this.state.userCoordinates) {

                console.log('FETCH WEATHER STATUS: STARTED...!')
                const coords = this.state.userCoordinates
                const lat = coords.latitude
                const lng = coords.longitude
                
                await fetch(
                    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${OpenWeatherMapAPI.KEY}&units=metric`
                )
                .then(res => {
                    const resStatus = 'Status: ' + res.status + ', Status Text: ' + res.statusText
                    if (!res.ok) 
                        throw new Error(resStatus)
                    else {
                        return res.json()
                    }
                })
                .then(json => {
                    // console.log('Fetch weather response:')
                    // console.log(json);
                    console.log('FETCH WEATHER STATUS: SUCCESSFUL!')
                    this.setState({weather: json})
                });
          
            } else {
                console.log('FETCH WEATHER STATUS: UNABLE TO START! USER POSITION NOT AVAILABLE.')
            }

        } catch(error) {
            console.log('FETCH WEATHER STATUS: ERROR! LOGGING ERROR...')
            console.log(error)

        } finally {
            console.log('FETCH WEATHER STATUS: FINISHED!')    
            this.setState({isFetchingLocationOrWeather: false})
        }
    }

    // Check if device has location services enabled
    async checkIfLocationEnabled () {

        if ( !this.state.LocationServiceEnabled ) {
            try{
                console.log('GEOCODING PROCESS (CHECK): CHECKING IF USER HAS SERVICES ENABLED.' )
                let enabled = await Location.hasServicesEnabledAsync();
            
                if (!enabled) {
                    console.log('GEOCODING PROCESS (CHECK): CHECKED! USER DOES NOT HAVE SERVICES ENABLED.' )
                    Alert.alert(
                        'Location Service not enabled',
                        'Please enable your location services to continue',
                        [{ text: 'OK' }],
                        { cancelable: false }
                    )
                } else {
                    console.log('GEOCODING PROCESS (CHECK): CHECKED! USER HAS LOCATION SERVICES ENABLED.')
                    this.setState({LocationServiceEnabled: enabled});
                }

            } catch(error) {
                console.log("GEOCODING PROCESS (CHECK): ERROR IN SERVICES PERMISSION CHECK! COULD'NT CHECK IF USER HAS SERVICES ENABLED.")
            
            } finally {
                console.log("GEOCODING PROCESS (CHECK): FINISHED!")
            }
        
        } else {
                console.log("GEOCODING PROCESS (CHECK): SKIPPING! USER ALREADY GRANTED PERMISSION.")
        } 

    };
    
    // Check for permission, get current user position and use reverse geocoding for user coordinates
    async getCurrentLocation() {
    
        try {
            console.log('GEOCODING PROCESS (PERMISSION): REQUEST PERMISSION ASYNC...')
            // let { status } = await Location.requestPermissionsAsync();
            let { status } = await Location.requestForegroundPermissionsAsync()
            // let { status } = await Location.requestBackgroundPermissionsAsync()
        
            if (status !== 'granted') {
                console.log('GEOCODING PROCESS (PERMISSION): PERMISSION NOT GRANTED!')
                Alert.alert(
                    'Permission not granted',
                    'Allow the app to use location service.',
                    [{ text: 'OK' }],
                    { cancelable: false }
                );

            } else {
                console.log('GEOCODING PROCESS (PERMISSION): PERMISSION GRANTED!')
            }
        
            console.log('GEOCODING PROCESS (REQUEST): GETTING CURRENT USER POSITION ASYNC...')
            let { coords } = await Location.getCurrentPositionAsync();
            
            if (coords) {   
                const { latitude, longitude } = coords;
                this.setState({userCoordinates: coords})
                console.log(`GEOCODING PROCESS (REQUEST): CURRENT USER POSITION FOUND... Latitude: ${latitude}, Logitude: ${longitude}`)
                console.log('GEOCODING PROCESS (REVERSE GEOCODING): REVERSE GEOCODE ASYNC...')  
                let response = await Location.reverseGeocodeAsync({ latitude, longitude });
        
                if (response) {
                    this.setState({userAddressList: response, address: response[0]})
                    console.log('GEOCODING PROCESS (REVERSE GEOCODING): REVERSE GEOCODE SUCCESSFUL! UPDATING STATE...')  

                } else {
                    console.log('GEOCODING PROCESS (REVERSE GEOCODING): REVERSE GEOCODE FAILED! LOGGING RESPONSE...')  
                    console.log(response)
                }
        
            } else {
                console.log(`GEOCODING PROCESS (REVERSE GEOCODING): USER POSITION NOT FOUND! UNABLE TO PROCEED TO REVERSE GEOCODING...`)
            }
    
        } catch (error) {
            console.log('GEOCODING PROCESS: ERROR IN USER POSITION REQUEST! LOGGING ERROR...')
            console.log(error)
        
        } finally {
            console.log('GEOCODING PROCESS: USER POSITION REQUEST FINISHED. PROCEEDING TO FETCH WEATHER DATA...')
            this.fetchWeather()
        }
    };

    postEntryHeader() {
        return(
            <View style={[styles.cardRow, {justifyContent: 'space-between'}]}>
                <Pressable onPress={() => {this.props.navigation.goBack()}}  style={styles.postButton}>
                    <Icon name='arrow-back' fill='white' height={30} width={30}/>
                </Pressable>
                <View style={[styles.entryCardEmotionBadge, {flexDirection: 'row', alignItems: 'center'}]}>
                    <Text style={styles.datetimeTitle}> { formatPostEntryDatetimeTitle(this.state.date, this.state.startTime) } </Text>
                    <Icon name='edit' fill='rgba(75,75,75,1)' height={20} width={20}/>
                </View>
                <Pressable onPress={() => {this.setState({star: !this.state.star})}}  style={styles.postButton}>
                    <Icon name={this.state.star ? 'star' : 'star-outline'} fill='rgba(245,245,245,0.7)' height={30} width={30}/>
                </Pressable>
            </View>
        )
    }

    onMoodButtonPress(item) {
        function selectMood() {
            if (this.state.selectedMood==item) {
                this.setState({selectedMood: null})
            } else {
                this.setState({selectedMood: item})
            }
        }
        selectMood = selectMood.bind(this);
        return selectMood
    }

    MoodButtons() {
        
        return moods.map((item, index) => {

            const selColor = moodColors[index]
            const moodButtonViewStyle = {
                width: 65,
                height: 65,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: this.state.selectedMood==item ? 3 : 0,
                borderRadius: 32.5,
                borderColor: selColor,
            }        

            return(
                <View key={'mood '+index} style={moodButtonViewStyle} >
                    <Pressable
                    title={item}
                    onPress={this.onMoodButtonPress(item)}
                    style={[
                        styles.moodButton,
                        this.state.selectedMood==item ? {
                            fontWeight: 'bold',
                            backgroundColor: selColor,
                        } : {
                            fontWeight: null,
                            backgroundColor: selColor
                        }
                    ]}
                    >
                        <Text style={{textAlign: 'center', textAlignVertical: 'center'}}>{item}</Text>
                    </Pressable>
                </View>
            )
        })
    }

    onEmotionButtonPress(emotion) { 
        function selectEmotion () {
            this.setState({
                isSelectedEmotions: {
                    ...this.state.isSelectedEmotions,
                    [emotion]: !this.state.isSelectedEmotions[emotion]
                }
            })
        }
        selectEmotion = selectEmotion.bind(this);
        return selectEmotion
    }

    EmotionButtons(emotions) {
        return(
            emotions.map( emotion => (
                <Pressable
                key={'emotion-' + emotion}
                title={emotion}
                style={ {} }
                onPress={this.onEmotionButtonPress(emotion)}
                >
                    <Text style={[styles.emotionBadge, {backgroundColor: this.state.isSelectedEmotions[emotion] ? 'lightblue' : 'white' }]}>{emotion}</Text>
                </Pressable>
            ))
        )
    }

    JornalInput() {
        return(
            <TextInput
            multiline
            scrollEnabled
            placeholder='Today was...' 
            onChangeText={text => this.setState({jornalEntry: text})}
            value={this.state.jornalEntry}
            // numberOfLines={3}
            style={styles.jornalText}
            >
            </TextInput>
        )
    }

    setSelectedEntry (entry) {
        function setSelected() {
            this.setState( {selectedEntry:  this.state.selectedEntry === entry ? null : entry  } )
        }
        setSelected = setSelected.bind(this);
        return setSelected
    }

    inputSection(sectionName, cardBodyStyle, inputs) {
        if (this.state.selectedEntry === sectionName) {
            if (sectionName == 'Emoções') {
                return emotionGroups.map((emotions, index) => (
                    <View key={'emotion-group-' + index} style={{width: '100%', alignItems: 'center', marginVertical: 10}}>
                        <Text style={{fontSize: 15, color: 'white', marginVertical: 8}}>{emotionGroupsNames[index]}</Text>
                        <View key={index} style={[styles.cardRow, cardBodyStyle]}>
                            {inputs(emotions)}
                        </View>
                    </View>
                ))
            } else {
                return(
                    <View style={[styles.cardRow, cardBodyStyle]}>
                        {inputs}
                    </View>
                )    
            }
        } else {
            return(
                <></>
            )
        }
    }

    InputCard(sectionName, icon, cardBodyStyle, inputs) {
        return(
            <View style={[styles.card]}>
                <Pressable style={styles.cardRow}  onPress={this.setSelectedEntry(sectionName)}>
                    <Icon name={icon} fill='rgba(255,255,255,0.75)' height={28} width={28} style={styles.entryIcon} />
                    <Text style={styles.entryTitle}> {sectionName} </Text>
                </Pressable>

                {this.inputSection(sectionName=sectionName, cardBodyStyle=cardBodyStyle, inputs=inputs)}  

            </View>
        )
    }

    onSaveButtonPress () {
        if (!this.state.selectedMood) {
            alert('Necessário adicionar uma avaliação.')

        } else {
            try {
                const newEntry = {
                    jornal: this.state.jornalEntry,
                    mood: this.state.selectedMood,
                    emotions: basicEmotions.filter( emotion => this.state.isSelectedEmotions[emotion] ) ,
                    address: formattedAddress(this.state.address),
                    date: Today(),
                    startTime: this.state.startTime,
                    endTime: getTime(),
                    star: this.state.star,
                }
                this.postNewEntryAsync(newEntry)

            } catch (error) {
                alert('Não foi possível postar sua entrada. Tente novamente...')
                console.log('Error when attempting to post user entry. Logging error...')
                console.log(error)
            }
        }
    }

    async postNewEntryAsync(newEntry) {
        this.setState({ isLoading: true });
        var info = this.props.route.params.userInfo;

        try {
            const postUserEntryOpts = { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( newEntry ),
            }
            var postUserEntryResult = await fetch( corsURI + appServerURI + 'Users/' + info.username + '/entries', postUserEntryOpts);
            // var postUserEntryResult = await fetch('http://localhost:3000/Users/' + info.username + '/entries', postUserEntryOpts);

            if (postUserEntryResult.ok) {
                console.log('fetch POST request successful')
                console.log('Status: ' + postUserEntryResult.status + ', ' + postUserEntryResult.statusText)
                this.props.navigation.navigate('Entrances', {newPost: true} )    

            } else {
                console.log('fetch POST request failed. Throwing error...')
                throw new Error('Status: ' + postUserEntryResult.status + ', ' + postUserEntryResult.statusText)
            }

        } catch (error) {
            console.log('Erro capturado:')
            console.log(error);

        } finally {
            this.setState({ isLoading: false });
    }
}
  
    render() {
        console.log('Rendering "Post Entry" screen...')
        const isDataLoading = this.state.isFetchingLocationOrWeather
        return(
            <ImageBackground source={require('../assets/wallpaper.jpg')} style={styles.mainView}>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.section}>
                            {this.postEntryHeader()}
                            {this.InputCard('Avaliação', 'smiling-face', {justifyContent: 'space-between'}, this.MoodButtons())}
                            {this.InputCard('Emoções', 'checkmark-square-outline', {flexWrap: 'wrap', justifyContent: 'center'}, this.EmotionButtons)}
                            {this.InputCard('Jornal', 'book', {flexDirection: 'column', minHeight: 130}, this.JornalInput())}
                    </View>
                </ScrollView>  

                <Pressable
                onPress={this.onSaveButtonPress}
                disabled={isDataLoading}
                style={styles.saveButton}
                >
                    {isDataLoading ? (
                        <Icon name={'sync-outline'} fill='black' width={28} height={28} />
                    ) : (
                        <Text style={styles.saveButtonLabel}> Salvar </Text>
                    )}
                </Pressable>
    
            </ImageBackground>
        )    
    }
}