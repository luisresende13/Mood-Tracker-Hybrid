// Module imports
import React, { Component } from 'react';
import { View, Text, ImageBackground, Pressable, ScrollView } from 'react-native';
import { Icon } from 'react-native-eva-icons'

// Component imports
import UserEntryCards from './subcomponents/userEntryCards';

// Local imports
import dateRange from '../shared/dateRange';
import styles from '../styles/entrancesStyles';

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching)
const corsURI = 'https://morning-journey-78874.herokuapp.com/';
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
        };
        this.onNextButtonPress = this.onNextButtonPress.bind(this);
        this.forgetNewPost = this.forgetNewPost.bind(this);
    }
    
    componentDidMount() {
        console.log('"Entries" screen component did mount...')

        navigator.geolocation.getCurrentPosition(
            position => {
              console.log('LOGGING USER POSITION USING NAVIGATOR OBJECT...')
              console.log(position)
            },
            error => {
              console.log('ERROR GETTING USER POSITION USING NAVIGATOR OBJECT.')
            }
          );
      
    }

    onNextButtonPress(next='next') { 
        function setSelectedDate() {
            this.setState( {selectedDate: getNextDate(this.state.selectedDate, next)} ) 
        }
        return setSelectedDate.bind(this);
    }

    forgetNewPost() {
        function forgetNewPost() {
            this.props.navigation.setParams({newPost: false});
            this.setState({
                selectedDate: Today(),
            });
        }
        return forgetNewPost.bind(this);
    }

    render() {

        console.log('Rendering "Entries" screen...')
        const isToday = this.state.selectedDate === this.state.date

        return(
            <ImageBackground source={require('../assets/wallpaper.jpg')} style={[styles.mainView]}>
                
                <ScrollView style={styles.scrollView}>
                        <View style={styles.section}>
                            
                            <View style={[styles.cardRow, {justifyContent: 'space-between'}]}>
                                <Pressable onPress={ this.onNextButtonPress('previous') }>
                                    <Icon name='arrow-back' width={35} height={35} fill='white' />
                                </Pressable>
                                <Text style={styles.sectionTitle}> { 'Suas entradas  •  ' + formatDate(this.state.selectedDate) } </Text>                                
                                { !isToday ? (
                                    <Pressable onPress={ this.onNextButtonPress('next') }>
                                        <Icon name='arrow-forward' width={35} height={35} fill='white' />
                                    </Pressable>   
                                ) : (
                                    // <></>
                                    <View style={{height: 35, width: 35}}></View>
                                )}
                            </View>

                            <UserEntryCards 
                            userInfo={this.props.route.params.userInfo}
                            newPost={this.props.route.params.newPost}
                            forgetNewPost={this.forgetNewPost()}
                            date={this.state.selectedDate}
                            />

                        </View>
                </ScrollView>

                <Pressable onPress={() => { this.props.navigation.navigate( 'PostEntrance', {} )} }  style={[styles.postButton]}>
                        <Icon name='plus-circle' width={72} height={72} fill='white' style={styles.postButtonLabel}/>
                </Pressable>
  
            </ImageBackground>
            )

    }
  }
