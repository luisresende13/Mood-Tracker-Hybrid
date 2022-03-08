import React, { Component } from 'react';
import { View, Text, ImageBackground, Pressable, ScrollView, Platform, TextInput, ActivityIndicator } from 'react-native';

import { Icon } from 'react-native-eva-icons'
import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EditEmotions from './subcomponents/EditEmotions'
import styles from '../styles/postEntryStyles'
styles.theme = {}; styles.altTheme = {};

// Geocoding and weather dependencies and APIs
import * as Location from 'expo-location';
import GoogleMapsAPI from './subcomponents/GoogleMapsAPI'
Location.setGoogleApiKey(GoogleMapsAPI.GoogleMapsGeocodingAPIKey)

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const corsURI = Platform.OS == 'web' ? 'https://morning-journey-78874.herokuapp.com/' : ''
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

// Mood configs
const moods = ['Horrível', 'Mal', 'Regular', 'Bem', 'Ótimo']
const moodColorsHEX = ['#ff3333', '#0099cc', '#add8e6', '#ffff33', '#00cc00']
const moodColorsRGBA = ['rgba(255, 51, 51, 1)', 'rgba(0, 153, 204, 1)', 'rgba(173, 216, 230, 1)', 'rgba(255, 255, 51, 1)', 'rgba(0, 204, 0, 1)']
const moodColorsTransp = (alpha) => [`rgba(255, 51, 51, ${alpha})`, `rgba(0, 153, 204, ${alpha})`, `rgba(173, 216, 230, ${alpha})`, `rgba(255, 255, 51, ${alpha})`, `rgba(0, 204, 0, ${alpha})`]
const moodIcons = ['emoticon-dead', 'emoticon-sad', 'emoticon-neutral', 'emoticon-happy', 'emoticon-excited']

// Emotion configs
const emotionGroupsNames = [ 'Bem & Calmo(a)', 'Bem & Energizado(a)', 'Mal & Calmo(a)', 'Mal & Energizado(a)' ]
const emotionTypes = ['Positiva', 'Negativa']
const emotionEnergy = ['Calmo(a)', 'Energizado(a)']

function buildIsSelectedEmotions(emotions) {
    var isSelectedEmotions = {}
    for ( let emotion of emotions) {
        isSelectedEmotions[emotion.name] = false
    }
    return isSelectedEmotions
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
    return oneDigit( ymd[2] ) + ' ' + m + ' ' + ymd[0] + (time ? ' - ' : '') + time.slice(0,5)
}

function formattedAddress(addr) {
    return (
        ( addr.street ? addr.street + ', ' : '' ) +
        ( addr.streetNumber ? addr.streetNumber + ' - ' : '' ) +
        ( addr.district ? addr.district + ', ' : '' ) +
        ( addr.subregion ? addr.subregion + '. ' : '' ) +
        ( addr.region ? addr.region + ', ' : '' ) +
        ( addr.isoCountryCode ? addr.isoCountryCode : '' )  + '.'
    )
}

function mapEmotions(emotions, layout='grid') {
    var userEmotionGroups = layout=='grid' ? [[],[],[],[]] : ( layout=='spread' ? [[]] : [[],[]] )
    var emotionLabels = layout=='grid' ? emotionGroupsNames : ( layout=='type' ? emotionTypes : (layout=='spread' ? [''] : emotionEnergy ) )
    for (let emotion of emotions) {
        if (layout=='grid') {
            if (emotion.type=='Positiva') {
                if (emotion.energy=='Calmo(a)')
                    userEmotionGroups[0] = [ ...userEmotionGroups[0], emotion]
                else if (emotion.energy=='Energizado(a)')
                    userEmotionGroups[1] = [ ...userEmotionGroups[1], emotion]
            } else if (emotion.type=='Negativa') {
                if (emotion.energy=='Calmo(a)')
                    userEmotionGroups[2] = [ ...userEmotionGroups[2], emotion]
                else if (emotion.energy=='Energizado(a)')
                    userEmotionGroups[3] = [ ...userEmotionGroups[3], emotion]
            }
        } else if (layout=='type') {
            if (emotion.type=='Positiva')
                userEmotionGroups[0] = [ ...userEmotionGroups[0], emotion]
            else if (emotion.type=='Negativa')
                userEmotionGroups[1] = [ ...userEmotionGroups[1], emotion]
        } else if (layout=='energy') {
            if (emotion.energy=='Calmo(a)')
                userEmotionGroups[0] = [ ...userEmotionGroups[0], emotion]
            else if (emotion.energy=='Energizado(a)')
                userEmotionGroups[1] = [ ...userEmotionGroups[1], emotion]
        } else if (layout=='spread') {
            userEmotionGroups[0] = [ ...userEmotionGroups[0], emotion]
        }
    }
    return [userEmotionGroups, emotionLabels]
}

function sortObjListByKey(objList, objKey) {
    const keys = objList.map(obj => obj[objKey])
    const sortedKeys = [...keys].sort()
    var newObjList = []
    sortedKeys.forEach(key => {
        newObjList.push( objList[keys.indexOf(key)] )
    })
    return newObjList
}

export default class PostEntranceScreen extends Component {
  
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.appState.user,

            date: '',
            startTime: '',
            endTime: '',
            createdAt: '',
            lastEdited: [],

            star: false,
            selectedMood: '',
            emotions: [],
            jornalEntry: '',    
            address: '',
            location: null,
            weather: null,

            selectedEntry: 'Avaliação',
            isMoodUnmarked: true,
            isSelectedEmotions: buildIsSelectedEmotions(this.props.appState.user.emotions),
            selectedEmotionLayout: this.props.appState.user.layout,
            isFetchingLocationOrWeather: false,
            isPostEntryLoading: false,
            isDeleteEmotionLoading: false,
            isSaveEmotionLoading: false,
            deleteEmotionMode: false,
            isUpdateUserDataLoading: false,

            locationPermission: null,
            userCoordinates: null,
            loginMsg: '',
        };

        this.initializeEntry = this.initializeEntry.bind(this);
        this.onSaveButtonPress = this.onSaveButtonPress.bind(this);
        this.saveButton = this.saveButton.bind(this);
        this.setLoginMsg = this.setLoginMsg.bind(this);
        this.EmotionButtons = this.EmotionButtons.bind(this);
        this.MoodButtons = this.MoodButtons.bind(this);
        this.postEntryHeader = this.postEntryHeader.bind(this);
        this.onEmotionButtonPress = this.onEmotionButtonPress.bind(this);
        this.onMoodButtonPress = this.onMoodButtonPress.bind(this);
        this.inputCardBody = this.inputCardBody.bind(this);
        this.setSelectedEntry = this.setSelectedEntry.bind(this);
        this.InputCard = this.InputCard.bind(this);
        this.JornalInput = this.JornalInput.bind(this);
        this.postNewEntryAsync = this.postNewEntryAsync.bind(this);
        this.updateUserData = this.updateUserData.bind(this);
        this.deleteEmotion = this.deleteEmotion.bind(this);
        this.onEmotionButtonLongPress = this.onEmotionButtonLongPress.bind(this);
    }

    componentDidMount() {
        console.log('"PostEntry" component did mount.')
        this.initializeEntry()
    }

    postEntryHeader() {
        return(
            <View style={[styles.cardRow, {justifyContent: 'space-between'}]}>
                <Pressable onPress={() => {this.props.navigation.goBack()}} hitSlop={10} style={styles.postButton}>
                    <Icon name='arrow-back' fill={styles.theme.color+'b'} height={29} width={29}/>
                </Pressable>
                <View style={[styles.entryCardEmotionBadge, {flexDirection: 'row', alignItems: 'center'}]}>
                    <Text style={styles.datetimeTitle}> { formatPostEntryDatetimeTitle(this.props.route.params.currentEntry.date, this.state.startTime) } </Text>
                    <Icon name='edit' fill='rgba(75,75,75,1)' height={20} width={20}/>
                </View>
                <Pressable onPress={() => {this.setState({star: !this.state.star})}}  hitSlop={10} style={styles.postButton}>
                    <Icon name={this.state.star ? 'star' : 'star-outline'} fill={this.state.star ? 'gold' : styles.theme.color+'b' } height={30} width={30}/>
                </Pressable>
            </View>
        )
    }

    MoodButtons() {
        return moods.map((item, index) => {
            const selected = this.state.selectedMood == item
            const isMoodUnmarked = this.state.isMoodUnmarked
            const selColor = moodColorsRGBA[index]
            return(
                <View key={'mood '+index} style={styles.moodButton}>
                    <VectorIcon
                    name={moodIcons[index]}
                    size={isMoodUnmarked ? 52 : (selected ? 57 : 50) }
                    color={ isMoodUnmarked ? selColor : (selected ? selColor : moodColorsTransp(0.5)[index]) }
                    onPress={this.onMoodButtonPress(item)}
                    />
                </View>
            )
        })
    }

    onMoodButtonPress(item) {
        function selectMood() {
            if (this.state.selectedMood==item) {
                this.setState({selectedMood: null, isMoodUnmarked: true})
            } else {
                this.setState({selectedMood: item, isMoodUnmarked: false})
            }
        }
        selectMood = selectMood.bind(this);
        return selectMood
    }

    EmotionButtons(emotions) {
        return(
            sortObjListByKey(emotions, 'name').map( emotion => (
                <Pressable
                key={'emotion-' + emotion.name}
                title={emotion.name}
                onPress={this.onEmotionButtonPress(emotion.name)}
                onLongPress={this.onEmotionButtonLongPress(emotion.name)}
                suppressHighlighting={true}
                selectable={false}
                >
                    <Text
                    selectable={false}
                    // selectionColor={'#0000'}
                    onLongPress={null}
                    style={[styles.emotionBadge,
                        {backgroundColor: this.state.isSelectedEmotions[emotion.name] ? 'lightblue' : 'aliceblue' }
                    ]}
                    >
                        {emotion.name}
                        </Text>
                </Pressable>
            ))
        )
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

    onEmotionButtonLongPress(emotion) { 
        function selectEmotion () {
            if (this.state.deleteEmotionMode) {
                this.deleteEmotion(emotion)
            }
        }
        selectEmotion = selectEmotion.bind(this);
        return selectEmotion
    }

    JornalInput() {
        return(
            <TextInput
            multiline
            scrollEnabled
            placeholder='Escreva aqui...'
            placeholderTextColor='rgba(255,255,255,0.6)'
            onChangeText={text => this.setState({jornalEntry: text})}
            value={this.state.jornalEntry}
            style={[styles.jornalText, styles.theme]}
            >
            </TextInput>
        )
    }

    inputCardBody(sectionName, cardBodyStyle, cardBodyContent) {
        if (this.state.selectedEntry === sectionName) {
            if (sectionName == 'Emoções') {
                const [userEmotionGroups, emotionLabels] = mapEmotions(this.props.appState.user.emotions, this.state.selectedEmotionLayout)
                return(
                    <>
                        { userEmotionGroups.map((emotions, index) => (
                            <View key={'emotion-group-' + index} style={{width: '100%', alignItems: 'center', marginVertical: 10}}>
                                { emotionLabels[index] ? <Text style={{fontSize: 15, color: 'white', marginVertical: 8}}>{emotionLabels[index]}</Text> : null }
                                <View key={index} style={[styles.cardRow, cardBodyStyle]}>
                                    {cardBodyContent(emotions)}
                                </View>
                            </View>
                        )) }
                        <EditEmotions
                        {...this.props}
                        {...this.state}
                        setParentState={this.setState.bind(this)}
                        updateUserData={this.updateUserData}
                        setAlertMsg={this.setLoginMsg}
                        />
                    </>

                )
            } else {
                return(
                    <View style={[styles.cardRow, cardBodyStyle]}>
                        {cardBodyContent}
                    </View>
                )    
            }
        } else {
            return(
                <></>
            )
        }
    }

    InputCard(sectionName, icon, cardBodyStyle, cardBodyContent) {
        return(
            <View style={[styles.card]} >
                <Pressable style={styles.cardRow} onPress={this.setSelectedEntry(sectionName)} >
                    <Icon name={icon} fill={styles.theme.color+'c'} height={28} width={28} style={styles.entryIcon} />
                    <Text style={styles.entryTitle}> {sectionName} </Text>
                </Pressable>    
                {this.inputCardBody(sectionName, cardBodyStyle, cardBodyContent)}  
            </View>   
        )
    }

    setSelectedEntry (entry) {
        function setSelected() {
            this.setState( {selectedEntry:  this.state.selectedEntry === entry ? null : entry  } )
        }
        setSelected = setSelected.bind(this);
        return setSelected
    }

    loginMsg() {
        return(
          <View style={[styles.login.msgBox, this.state.loginMsg ? {} : {height: 0, backgroundColor: 'transparent', borderColor: 'transparent'} ]}>
            <Text style={styles.login.msg}>{this.state.loginMsg}</Text>
          </View>
        )
    }

    setLoginMsg(msg) {
        this.setState({loginMsg: msg})
        setTimeout( () => this.setState({loginMsg: ''}) , 1000 * 5 )
    }    

    async initializeEntry() {
        const currentEntry = this.props.route.params.currentEntry
        const user = this.props.appState.user
        switch (currentEntry.type) {
            case 'new':
                console.log('POST ENTRY STATUS: INITIATING BLANK NEW ENTRY! FETCHING LOCATION AND WEATHER DATA...')
                this.setState({
                    date: currentEntry.date,
                    startTime: getTime(),
                    endTime: '',
                    isFetchingLocationOrWeather: true
                })
                await this.checkIfLocationEnabled();
                await this.getCurrentLocation();                    
                await this.fetchWeather()
                this.setState({isFetchingLocationOrWeather: false})
            break;
        
            case 'custom-date':
                console.log('POST ENTRY STATUS: INITIALIZING CUSTOM DATE ENTRY! SETTING DATE TO: ' + currentEntry.date)
                this.setState({
                    date: currentEntry.date,
                    startTime: '',
                    endTime: '',
                })
                break

            case 'edit':
                const entry = currentEntry.entry
                const currentEmotions = entry.emotions.map(emotion => emotion.name)
                var isSelectedEmotionsNew = {}
                for ( let emotion of user.emotions ) {
                    isSelectedEmotionsNew[emotion.name] = currentEmotions.includes(emotion.name)
                }

                this.setState({
                    date: entry.date,
                    startTime: entry.startTime,
                    endTime: entry.endTime,
                    createdAt: entry.createdAt,
                    lastEdited: entry.lastEdited,
                    star: entry.star,
                    selectedMood: entry.mood,
                    isSelectedEmotions: isSelectedEmotionsNew,
                    jornalEntry: entry.jornal,
                    address: entry.address,
                    location: entry.location,
                    weather: entry.weather,
                    isMoodUnmarked: false,
                })
                break
    
            default:
                break;
        }
    }

    updateUserData() {
        console.log('UPDATING USER DATA IN "PostEntryComponent"...')
        this.setState({isUpdateUserDataLoading: true})
        const user = this.props.appState.user

        const oldEmotions = Object.keys(this.state.isSelectedEmotions)
        const currentEmotions = user.emotions.map(emotion => emotion.name)
        const newEmotions = currentEmotions.filter(emotion => oldEmotions.includes(emotion))

        const newEmotionsSelected = buildIsSelectedEmotions(newEmotions)
        oldEmotions.forEach(emotion => { 
            if (currentEmotions.includes(emotion)) 
                newEmotionsSelected[emotion] = this.state.isSelectedEmotions[emotion]
        })

        this.setState({
            // user: user,
            isSelectedEmotions: newEmotionsSelected,
            isUpdateUserDataLoading: false
        })
    }

    saveButton() {
        const isDataLoading = (
            this.state.isFetchingLocationOrWeather |
            this.state.isPostEntryLoading |
            this.state.isSaveEmotionLoading |
            this.state.isDeleteEmotionLoading |
            this.props.appState.isUserDataSyncing |
            this.state.isUpdateUserDataLoading
        )
        var color;
        switch (true) {
            case this.state.isFetchingLocationOrWeather:
                color = 'brown'
                break;
        
            case this.state.isPostEntryLoading:
                color = 'black'
                break;
            case this.state.isSaveEmotionLoading:
                color = 'green'
                break;
            case this.state.isDeleteEmotionLoading:
                color = 'red'
                break;
            case this.props.appState.isUserDataSyncing:
                color = 'blue'
                break;
            case this.state.isUpdateUserDataLoading:
                color = 'green'
                break;
            default:
                break;
        }

        return(
            <Pressable
            onPress={this.onSaveButtonPress}
            disabled={isDataLoading}
            style={styles.saveButton}
            >
                { isDataLoading ? (
                    <ActivityIndicator size='small' color={color} />
                ) : (
                    <Text style={styles.saveButtonLabel}> Salvar </Text>
                ) }
            </Pressable>
        )
    }

    onSaveButtonPress() {
        if (!this.state.selectedMood) {
            this.setLoginMsg('Adicione uma avaliação para continuar.')
            this.setState({selectedEntry: 'Avaliação'})
            return
        }
        const currentEntry = this.props.route.params.currentEntry
        var lastEdited = getTime()
        var createdAt, endTime
        switch (currentEntry.type) {
            case 'new':
                endTime = lastEdited
                createdAt = lastEdited
                break;
            case 'custom-date':
                endTime = this.state.endTime // Returns empty string ''.
                createdAt = lastEdited
                break
            case 'edit':
                endTime = this.state.endTime
                createdAt = this.state.createdAt
                break
            default:
                break;
        }
        const newEntryPost = {
            date: this.state.date,
            startTime: this.state.startTime,
            endTime: endTime,
            createdAt: createdAt,
            lastEdited: [ ...this.state.lastEdited, {date: Today(), time: lastEdited}],
            star: this.state.star,
            mood: this.state.selectedMood,
            emotions: this.props.appState.user.emotions.filter( emotion => this.state.isSelectedEmotions[emotion.name] ),
            jornal: this.state.jornalEntry,
            address: this.state.address,
            location: this.state.location,
            weather: this.state.weather,
        }
        this.postNewEntryAsync(newEntryPost)
    }
    
    async postNewEntryAsync(newEntry) {
        this.setState({ isPostEntryLoading: true });
        var user = this.props.appState.user;
        const currentEntry = this.props.route.params.currentEntry
        const editMode = currentEntry.type === 'edit';
        try {
            console.log('POST ENTRY STATUS: Started...')
            var postUserEntryResult = {ok: false, status: '999', statusText: 'Post not fetched yet.'}
            const postUserEntryOpts = { 
                method: editMode? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( newEntry ),
            }
            // var postUserEntryResult = await fetch('http://localhost:3000/Users/' + info.username + '/entries', postUserEntryOpts);
            postUserEntryResult = await fetch( corsURI + appServerURI + 'Users/' + user.username + '/entries' + (editMode ? '/'+currentEntry.entry._id : ''), postUserEntryOpts);
            const postUserEntryStatus = 'Status: ' + postUserEntryResult.status + ', ' + postUserEntryResult.statusText

            if (postUserEntryResult.ok) {
                console.log('POST ENTRY STATUS: Successful.')
                console.log(postUserEntryStatus)
                    
            } else {
                console.log('POST ENTRY STATUS: Failed. Throwing error...')
                throw new Error(postUserEntryStatus)
            }

        } catch (error) {
            this.setLoginMsg('Erro no servidor. Tente novamente...')
            console.log('Erro capturado:')
            console.log(error);

        } finally {
            console.log('POST ENTRY STATUS: Finished.')
            this.setState({ isPostEntryLoading: false });
            if (postUserEntryResult.ok) {
                console.log('proceding to SYNC USER DATA IN RESPONSE TO SUCCESSFUL USER ENTRY POST... ')
                this.props.appState.syncUserData()
                // this.props.route.params.setMainScreenState({
                //     selectedEntryId: null,
                //     selectedDate: currentEntry.type == 'new' ? Today() : this.props.route.params.getMainScreenState().selectedDate,
                // })
                this.props.navigation.navigate('Entrances', {
                    selectedEntryId: null,
                    selectedDate: newEntry.date,
                })
            }
        }
    }

    async deleteEmotion(emotion) {
        this.setState({ isDeleteEmotionLoading: true });
        var user = this.props.appState.user;
        try {
            console.log('DELETE EMOTION STATUS: Started...')
            var postEmotionResult = {ok: false, status: '999', statusText: 'Post not fetched yet.'}
            const postUserEntryOpts = { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            // var postUserEntryResult = await fetch('http://localhost:3000/Users/' + info.username + '/emotions', postUserEntryOpts);
            postEmotionResult = await fetch( corsURI + appServerURI + 'Users/' + user.username + '/emotions/' + emotion, postUserEntryOpts);
            const postEmotionStatus = 'Status: ' + postEmotionResult.status + ', ' + postEmotionResult.statusText

            if (postEmotionResult.ok) {
                console.log('DELETE EMOTION STATUS: Successful.')
                console.log(postEmotionStatus)
                    
            } else {
                console.log('DELETE EMOTION STATUS: Failed. Throwing error...')
                throw new Error(postEmotionStatus)
            }

        } catch (error) {
            this.setLoginMsg('Erro no servidor. Tente novamente...')
            console.log('Erro capturado:')
            console.log(error);

        } finally {
            console.log('DELETE EMOTION STATUS: Finished.')
            this.setState({ isDeleteEmotionLoading: false });
            if (postEmotionResult.ok) {
                await this.props.appState.syncUserData();
                this.updateUserData();
            }
        }
    }

    async fetchWeather() {
        try {
            if (this.state.userCoordinates) {
                console.log('FETCH WEATHER STATUS: STARTED...!')
                const coords = this.state.userCoordinates
                const queryParams = {
                    lat: coords.latitude,
                    lon: coords.longitude,
                    units: 'metric'
                }
                const fetchOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },    
                    body: JSON.stringify({
                        queryParams: queryParams
                    })
                }
                const response = await fetch(corsURI + appServerURI + 'api/weather', fetchOptions)
                const resStatus = 'Status: ' + response.status + ', Status Text: ' + response.statusText
                if (!response.ok) 
                    throw new Error(resStatus)
                else {
                    const weather = await response.json()
                    console.log('FETCH WEATHER STATUS: SUCCESSFUL!')
                    const weatherInfo = {
                        coords: weather.coord,
                        name: weather.name,
                        weather: weather.weather[0],
                        main: weather.main,
                        clouds: weather.clouds,
                        wind: weather.wind,
                        visibility: weather.visibility,
                    }
                    this.setState({weather: weatherInfo})
                }
            } else {
            // this.setLoginMsg('Não foi possível obter as condições do tempo. Tente reabrir essa tela...')
            console.log('FETCH WEATHER STATUS: UNABLE TO START! USER POSITION NOT AVAILABLE.')
            }
        } catch (error) {
            this.setLoginMsg('Não foi possível obter as condições do tempo. Tente reabrir essa tela...')
            console.log('FETCH WEATHER STATUS: ERROR! LOGGING ERROR...')
            console.log(error)

        } finally {
            console.log('FETCH WEATHER STATUS: FINISHED!')    
        }
    }

    // Check if device has location services enabled
    async checkIfLocationEnabled () {

        try{
            console.log('GEOCODING PROCESS (CHECK): CHECKING IF USER HAS SERVICES ENABLED.' )
            let enabled = await Location.hasServicesEnabledAsync();            

            if (!enabled) {
                console.log('GEOCODING PROCESS (CHECK): CHECKED! USER DOES NOT HAVE SERVICES ENABLED.' )
                this.setLoginMsg('Não foi possível obter sua localização. Habilite o serviço de localização para associar um endereço a essa entrada...')
            } else {
                console.log('GEOCODING PROCESS (CHECK): CHECKED! USER HAS SERVICES ENABLED.')
            }

        } catch(error) {
            this.setLoginMsg('Não foi possível conferir se o serviço de localização está ativado. Tente reabrir essa tela...')
            console.log("GEOCODING PROCESS (CHECK): ERROR IN SERVICES PERMISSION CHECK! COULD'NT CHECK IF USER HAS SERVICES ENABLED.")
        
        } finally {
            console.log("GEOCODING PROCESS (CHECK): FINISHED!")
        }
    };

    // Check for permission, get current user position and use reverse geocoding for user coordinates
    async getCurrentLocation() {

        try {

            if (this.state.locationPermission === 'granted') {
                console.log('GEOCODING PROCESS (PERMISSION): PERMISSION ALREADY GRANTED. SKIPPING REQUEST...')
            } else {
                console.log('GEOCODING PROCESS (PERMISSION): REQUESTING PERMISSION ASYNC...')
                let { status } = await Location.requestForegroundPermissionsAsync()
                // let { status } = await Location.requestBackgroundPermissionsAsync()        
                this.setState({locationPermission: status})
    
                if (status !== 'granted') {
                    console.log('GEOCODING PROCESS (PERMISSION): PERMISSION NOT GRANTED!')
                    this.setLoginMsg('Permissão de localização não concedida. Permita que o app use os serviços de localização para associar um endereço a essa entrada...')
                    return 
    
                } else {
                    console.log('GEOCODING PROCESS (PERMISSION): PERMISSION GRANTED!')
                }
            }

            console.log('GEOCODING PROCESS (REQUEST): GETTING CURRENT USER POSITION ASYNC...')
            let { coords } = await Location.getCurrentPositionAsync();
            
            if (coords) {   
                console.log(`GEOCODING PROCESS (REQUEST): CURRENT USER POSITION FOUND... Latitude: ${latitude}, Logitude: ${longitude}`)
                console.log('GEOCODING PROCESS (REVERSE GEOCODING): REVERSE GEOCODE ASYNC...')  
                this.setState({userCoordinates: coords})
                const { latitude, longitude } = coords;
                let response = await Location.reverseGeocodeAsync({ latitude, longitude });
        
                if (response) {
                    console.log('GEOCODING PROCESS (REVERSE GEOCODING): REVERSE GEOCODE SUCCESSFUL! UPDATING STATE...')  
                    this.setState({ address: formattedAddress(response[0]), location: { position: coords, address: response[0] } })

                } else {
                    console.log('GEOCODING PROCESS (REVERSE GEOCODING): REVERSE GEOCODE FAILED! LOGGING RESPONSE...')  
                    console.log(response)
                }
            } else {
                console.log(`GEOCODING PROCESS (REVERSE GEOCODING): USER POSITION NOT FOUND! UNABLE TO PROCEED TO REVERSE GEOCODING...`)
            }
        } catch (error) {
            this.setLoginMsg('Não foi possível obter a localização atual. Tente reabrir essa tela...')
            console.log('GEOCODING PROCESS: ERROR IN USER POSITION REQUEST! LOGGING ERROR...')
            console.log(error)
        
        } finally {
            console.log('GEOCODING PROCESS: USER POSITION REQUEST FINISHED. PROCEEDING TO FETCH WEATHER DATA...')
        }
    };

    setFontColor() {
        const fontColorDark = this.props.appState.user.settings.fontColorDark
        const fontColor = fontColorDark ? '#000' : '#fff'
        const altFontColor = fontColorDark ? '#fff' : '#000'
        for (let style of ['theme', 'entryTitle']) {
            styles[style] = { ...styles[style], color: fontColor }
        }
        styles.altTheme.color = altFontColor
        styles.altTheme.backgroundColor = altFontColor
    }    

    render() {
        console.log('Rendering "PostEntry" component...')
        this.setFontColor()
        const settings = this.props.appState.user.settings
        const backgroundColor = settings.backgroundColor
        const backgroundImage = settings.backgroundImage
        const imgURI =  settings.displayBackgroundImage ? (backgroundImage ? ( settings.enableHighResolution ? backgroundImage.urls.raw : backgroundImage.urls.regular ) : null ) : null
        return(
            <ImageBackground source={{'uri' : imgURI}} style={[styles.mainView, {backgroundColor: backgroundColor}]}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.section}>
                            {this.postEntryHeader()}
                            {this.InputCard('Avaliação', 'smiling-face', {justifyContent: 'space-between'}, this.MoodButtons())}
                            {this.InputCard('Emoções', 'checkmark-square-outline', {flexWrap: 'wrap', justifyContent: 'center'}, this.EmotionButtons)}
                            {this.InputCard('Jornal', 'book', {flexDirection: 'column', minHeight: 130}, this.JornalInput())}
                    </View>
                </ScrollView>  
                <this.saveButton />
                {this.loginMsg()}
            </ImageBackground>
        )    
    }
}