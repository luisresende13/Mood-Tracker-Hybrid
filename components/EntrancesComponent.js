// Module imports
import React, { Component } from 'react';
import { View, Text, ImageBackground, Pressable, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Icon } from 'react-native-eva-icons'

// Component imports
import UserEntryCards from './subcomponents/UserEntryCards';

// Local imports
import dateRange from '../shared/dateRange';
import styles  from '../styles/entrancesStyles';

// Defining pertinent constants
const monthDict = {'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Ago': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'}
const englishMonthSigs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec']
const portugueseMonthSigs = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const englishWeekDayMap = {'Mon': 'Seg', 'Tue': 'Ter', 'Wed': 'Qua', 'Thu': 'Qui', 'Fri': 'Sex', 'Sat': 'Sab', 'Sun': 'Dom'}

// Defining pertinent functions
export function Today() {
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
            date: Today(),
            time: getTime(),
            isDeleteEntryLoading: false,
            alertMsg: '',
        };
        this.onNextButtonPress = this.onNextButtonPress.bind(this);
        this.setFontColor = this.setFontColor.bind(this);
        this.setAlertMsg = this. setAlertMsg.bind(this);
        this.getMainScreenState = this.getMainScreenState.bind(this); // remove
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
            this.props.navigation.setParams({
                selectedEntryId: null,
                selectedDate: getNextDate(this.props.route.params.selectedDate, next),
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
            <View style={[styles.msgBox, this.state.alertMsg ? {} : {height: null, paddingVertical: 10, backgroundColor: 'transparent', borderColor: 'transparent'} ]}>
                <Text style={styles.msg}>{this.state.alertMsg}</Text>
            </View>
        )
    }

    DateNavigationButton = ({next}) => {
        return(
            <Pressable onPress={this.onNextButtonPress(next)} hitSlop={15} >
                <Icon name={ next=='next' ? 'arrow-forward' : 'arrow-back'} width={29} height={29} fill={styles.theme.color} />
            </Pressable>
        )
    }

    setFontColor() {
        const fontColor = this.props.appState.user.settings.fontColorDark ? '#000' : '#fff'
        styles.theme = {color: fontColor}
    }

    render() {
        console.log('Rendering "EntriesScreen" component...')

        this.setFontColor()
        const navigateParams = {
            currentEntry: {type: 'new', date: Today(), entry: null},
        }
        const isLoading = this.props.appState.isUserDataSyncing | this.state.isDeleteEntryLoading
        const settings = this.props.appState.user.settings
        const backgroundImage = settings.backgroundImage
        const imgURI =  settings.displayBackgroundImage ? (backgroundImage ? ( settings.enableHighResolution ? backgroundImage.urls.raw : backgroundImage.urls.regular ) : null ) : null
        const backgroundColor = settings.backgroundColor

        return(
            <ImageBackground source={{uri: imgURI}} style={[styles.mainView, {backgroundColor: backgroundColor}]}>
                
                <ScrollView style={styles.scrollView}>
                    <View style={styles.section}>
                        <View style={[styles.cardRow, {justifyContent: 'space-between'}]}>
                            <this.DateNavigationButton icon='arrow-back' next='previous' />
                            <Text style={[styles.sectionTitle, styles.theme]}> {'Suas entradas  •  ' + formatDate(this.props.route.params.selectedDate)} </Text>                                
                            <this.DateNavigationButton icon='arrow-forward' next='next' />
                        </View>
                        <UserEntryCards
                        parentState={{
                            selectedDate: this.props.route.params.selectedDate,
                            selectedEntryId: this.props.route.params.selectedEntryId,
                            user: this.props.appState.user,
                            isUserDataSyncing: this.props.appState.isUserDataSyncing,
                            isDeleteEntryLoading: this.state.isDeleteEntryLoading,
                        }}
                        parentProps={{
                            navigation: this.props.navigation
                        }}
                        syncUserData={this.props.appState.syncUserData}
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
