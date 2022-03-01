// Module imports
import React, { Component } from 'react';
import { View, Text, ImageBackground, Pressable, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Icon } from 'react-native-eva-icons'

// Component imports
import UserEntryCards from './subcomponents/UserEntryCards';

// Local imports
import dateRange from '../shared/dateRange';
import styles from '../styles/entrancesStyles';

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const corsURI = Platform.OS == 'web' ? 'https://morning-journey-78874.herokuapp.com/' : ''
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

// Defining pertinent constants
const monthDict = {'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Ago': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'}
const englishMonthSigs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec']
const portugueseMonthSigs = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const englishWeekDayMap = {'Mon': 'Seg', 'Tue': 'Ter', 'Wed': 'Qua', 'Thu': 'Qui', 'Fri': 'Sex', 'Sat': 'Sab', 'Sun': 'Dom'}

// Defining pertinent functions
function Today() {
    const now = Date().toString().split(' ')
    const today = [ now[3], monthDict[now[1]], now[2] ].join('-')
    return today
}
function getNextDate(date, next='next') {
    const nextDate = dateRange[dateRange.indexOf(date) + (next=='previous' ? -1 : 1)]
    return nextDate
}
function getTime() {
    //Wed,Jan,26,2022,15:12:37,GMT-0300,(Horário,Padrão,de,Brasília)
    const now = Date().toString().split(' ')
    const time = now[4]
    return time
}
function formatDate(selDate) {
    
    var ymd = selDate.split('-')
    const yesterday = getNextDate(Today(), 'previous')
    const englishWeekDay = new Date(ymd[0], ymd[1], ymd[2]).toString().split(' ')[0]
    const weekDay = englishWeekDayMap[englishWeekDay]
    var prefix = ''

    if (selDate === Today()) prefix = 'Hoje, '
    else if (selDate === yesterday) prefix = 'Ontem, '
    else prefix = weekDay + ', '
    
    for (var i=0; i<12; i++) {
        if (monthDict[ englishMonthSigs[i] ] == ymd[1]) {
            return prefix + oneDigit(ymd[2]) + '° ' + portugueseMonthSigs[i]
        }
    }
}
function oneDigit(stringNumber) {
    if (stringNumber[0] == '0') return stringNumber.slice(1, stringNumber.length)
    else return stringNumber
}

export default class EntrancesScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            
            // user: this.props.route.params.user,
            date: Today(),
            time: getTime(),
            selectedDate: Today(),
            // isUserDataSynced: true,
            // isUserDataSyncing: false,
            isDeleteEntryLoading: false,
            alertMsg: '',
            locationPermission: null,
        };
        this.onNextButtonPress = this.onNextButtonPress.bind(this);
        this.setAlertMsg = this. setAlertMsg.bind(this);
        // this.syncUserData = this.syncUserData.bind(this);
        this.getMainScreenState = this.getMainScreenState.bind(this);
        
    }
    
    componentDidMount() {
        console.log('"Entries" screen component did mount...')
    }

    componentWillUnmount() {
        console.log('"EntriesScreen" component will unmount...')
    }

    getMainScreenState() {
        return this.state
    }

    onNextButtonPress(next='next') {
        function setSelectedDate() {
            this.setState({
                selectedEntryId: null,
                selectedDate: getNextDate(this.state.selectedDate, next),
            })
        }
        return setSelectedDate.bind(this);
    }

    setAlertMsg(msg) {
        this.setState({alertMsg: msg})
        setTimeout( () => this.setState({alertMsg: ''}) , 1000 * 5 )
    }
    
    alertMsg() {
        return(
            <View style={[styles.msgBox, this.state.alertMsg ? {} : {height: 0, backgroundColor: 'transparent', borderColor: 'transparent'} ]}>
                <Text style={styles.msg}>{this.state.alertMsg}</Text>
            </View>
        )
    }

    DateNavigationButton = ({next, today}) => {
        return(
            <Pressable onPress={this.onNextButtonPress(next)} hitSlop={15} >
                <Icon name={ next=='next' ? 'arrow-forward' : 'arrow-back'} width={26} height={26} fill='white' />
            </Pressable>
        )
    }

    render() {
        console.log('Rendering "EntriesScreen" component...')

        const today = this.state.selectedDate === Today()
        const navigateParams = {
            currentEntry: {type: 'new', date: Today(), entry: null},
            setMainScreenState: this.setState.bind(this),
            getMainScreenState: this.getMainScreenState,
        }
        const isLoading = this.props.appState.isUserDataSyncing | this.state.isDeleteEntryLoading
        const settings = this.props.appState.user.settings
        const backgroundImage = settings.backgroundImage
        const imgURI =  settings.displayBackgroundImage ? (backgroundImage ? backgroundImage.urls.regular : null) : null
        const backgroundColor = settings.backgroundColor

        return(
            <ImageBackground source={{uri: imgURI}} style={[styles.mainView, {backgroundColor: backgroundColor}]}>
                
                <ScrollView style={styles.scrollView}>
                    <View style={styles.section}>
                        <View style={[styles.cardRow, {justifyContent: 'space-between'}]}>
                            <this.DateNavigationButton icon='arrow-back' next='previous' />
                            <Text style={styles.sectionTitle}> {'Suas entradas  •  ' + formatDate(this.state.selectedDate)} </Text>                                
                            <this.DateNavigationButton icon='arrow-forward' next='next' today={today} />
                        </View>
                        <UserEntryCards
                        parentState={{
                            date: this.state.selectedDate,
                            selectedEntryId: this.state.selectedEntryId,
                            user: this.props.appState.user,
                            // isUserDataSynced: this.props.appState.isUserDataSynced,
                            isUserDataSyncing: this.props.appState.isUserDataSyncing,
                            isDeleteEntryLoading: this.state.isDeleteEntryLoading,
                        }}
                        parentProps={{
                            navigation: this.props.navigation
                        }}
                        syncUserData={this.props.route.params.syncUserData}
                        setMainScreenState ={this.setState.bind(this)}
                        getMainScreenState={this.getMainScreenState}
                        setAlertMsg = {this.setAlertMsg}
                        />
                    </View>
                </ScrollView>

                <Pressable
                onPress={() => {this.props.navigation.navigate( 'PostEntrance', navigateParams )}}
                style={[styles.postButton, {backgroundColor: isLoading ? 'white' : 'black'}]}
                disabled={isLoading}
                >
                { this.props.appState.isUserDataSyncing ? (
                        <ActivityIndicator color='black' size={'large'} />
                ) : (
                    this.state.isDeleteEntryLoading ? (
                        <ActivityIndicator color='red' size={'large'} />
                    ) : (
                        <Icon name='plus-circle' width={72} height={72} fill='#f4f3f4' style={styles.postButtonLabel}/>
                    )
                )}
                </Pressable>

                {this.alertMsg()}
  
            </ImageBackground>
            )
    }
  }
