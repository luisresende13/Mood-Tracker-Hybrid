// Module imports
import React, { Component } from 'react';
import { View, Text, ImageBackground, Pressable, ScrollView} from 'react-native';
import { Icon } from 'react-native-eva-icons'

// Component imports
import UserEntryCards from './subcomponents/userEntryCards';

// Local imports
import dateRange from '../shared/dateRange'
import styles from '../styles/entrancesStyles'

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching)
const corsURI = 'https://morning-journey-78874.herokuapp.com/'
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

// Defining pertinent constants
const monthDict = {'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Ago': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'}

// Defining pertinent functions
function getToday() {
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

export default class EntrancesScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            userEntries: [],
            date: getToday(),
            time: getTime(),
            selectedDate: getToday(),
            entriesLoading: false,
            entriesSynced: false,
        };
        // this.selectTodayIfNewEntry = this.selectTodayIfNewEntry.bind(this);
        this.onNextButtonPress = this.onNextButtonPress.bind(this);
        this.forgetNewPost = this.forgetNewPost.bind(this);
    }
    
    componentDidMount() {
        console.log('"Entries screen component did mount..."')
    }

    onNextButtonPress(next='next') { 
        function setSelectedDate() {
            this.setState( {selectedDate: getNextDate(this.state.selectedDate, next)} ) 
        }
        return setSelectedDate.bind(this);
    }

    // selectTodayIfNewEntry() {
    //     if (this.props.route.params) {
    //         if (this.props.route.params.newPost) {
    //             console.log('JUST POSTED STATUS: True. Selecting current date ...');
    //             this.setState({
    //                 selectedDate: getToday(),
    //                 entriesSynced: false,
    //             });
    //             this.props.navigation.setParams({newPost: false});
    //         } else console.log('JUST POSTED STATUS: False. Skipping...')
    //     }
    // }

    forgetNewPost() {
        function forgetNewPost() {
            this.props.navigation.setParams({newPost: false});
            this.setState({
                selectedDate: getToday(),
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
                                <Text style={styles.sectionTitle}>{'Suas entradas  •  ' + ( this.state.selectedDate===this.state.date ? 'Hoje, ' : '' ) + this.state.selectedDate}</Text>                                
                                { !isToday ? (
                                    <Pressable onPress={ this.onNextButtonPress() }>
                                        <Icon name='arrow-forward' width={35} height={35} fill='white' />
                                    </Pressable>   
                                ) : (
                                    <View></View>
                                )}
                            </View>

                            <UserEntryCards 
                            userInfo={this.props.route.params.userInfo}
                            newPost={this.props.route.params.newPost}
                            forgetNewPost={this.forgetNewPost()}
                            // selectedDate={this.state.selectedDate}
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
