// Module imports
import React, { Component } from 'react';
import { View, Text, ImageBackground, Pressable, ScrollView } from 'react-native';
import { Icon } from 'react-native-eva-icons'

// Component imports
import UserEntryCards from './subcomponents/UserEntryCards';

// Local imports
import dateRange from '../shared/dateRange';
import styles from '../styles/entrancesStyles';

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching)
// const corsURI = 'https://morning-journey-78874.herokuapp.com/';
// const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

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
    // const time = new Date().toLocaleTimeString()
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
            userEntries: [],
            date: Today(),
            time: getTime(),
            selectedDate: Today(),
            entriesLoading: false,
            entriesSynced: false,
            alertMsg: '',
        };
        this.onNextButtonPress = this.onNextButtonPress.bind(this);
        this.forgetPosted = this.forgetPosted.bind(this);
        this.setAlertMsg = this. setAlertMsg.bind(this);
        this.setSelectedEntryId = this.setSelectedEntryId.bind(this);
    }
    
    componentDidMount() {
        console.log('"Entries" screen component did mount...')      
        this.props.navigation.setParams({posted: {status: false, entry: null}});
    }

    setSelectedEntryId(id) {
        this.setState({selectedEntryId: id})
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

    forgetPosted() {
        this.setState({
            selectedEntryId: null,
            selectedDate: this.props.route.params.posted.entry.type == 'new' ? Today() : this.state.selectedDate,
        });
        this.props.navigation.setParams({posted: {status: false, entry: null}});
    }

    setAlertMsg(msg) {
        this.setState({alertMsg: msg})
        setTimeout( () => this.setState({alertMsg: ''}) , 1000 * 5 )
    }
    
    alertMsg() {
        return(
            <View style={[styles.msgBox, this.state.alertMsg ? {} : {backgroundColor: 'transparent', borderColor: 'transparent'} ]}>
                <Text style={styles.msg}>{this.state.alertMsg}</Text>
            </View>
        )
    }

    DateNavigationButton = ({next, today}) => {
        const buttonColor = next=='next' ? (today ? 'rgba(255,255,255,0.1)' : 'white') : 'white'
        return(
            <Pressable onPress={ this.onNextButtonPress(next) } disabled={ next=='next' & today }>
                <Icon name={ next=='next' ? 'arrow-forward' : 'arrow-back'} width={35} height={35} fill={buttonColor} />
            </Pressable>
        )
    }

    render() {
        // console.log('Rendering "Entries" screen...')
        const today = this.state.selectedDate === Today()
        return(
            <ImageBackground source={require('../assets/wallpaper.jpg')} style={[styles.mainView]}>
                
                <ScrollView style={styles.scrollView}>
                    <View style={styles.section}>
                        <View style={[styles.cardRow, {justifyContent: 'space-between'}]}>
                            <this.DateNavigationButton icon='arrow-back' next='previous' />
                            <Text style={styles.sectionTitle}> {'Suas entradas  •  ' + formatDate(this.state.selectedDate)} </Text>                                
                            <this.DateNavigationButton icon='arrow-forward' next='next' today={today} />
                        </View>
                        <UserEntryCards
                        date={this.state.selectedDate}
                        selectedEntryId={this.state.selectedEntryId}
                        userInfo={this.props.route.params.userInfo}
                        posted={this.props.route.params.posted}
                        setSelectedEntryId={this.setSelectedEntryId}
                        forgetPosted={this.forgetPosted}
                        setAlertMsg = {this.setAlertMsg}
                        navigation = {this.props.navigation}
                        />
                    </View>
                </ScrollView>

                <Pressable onPress={() => {this.props.navigation.navigate( 'PostEntrance', {currentEntry: {type: 'new', date: Today(), entry: null}} )}}  style={[styles.postButton]}>
                    <Icon name='plus-circle' width={72} height={72} fill='white' style={styles.postButtonLabel}/>
                </Pressable>

                {this.alertMsg()}
  
            </ImageBackground>
            )

    }
  }
