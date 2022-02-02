// Module import
import React, { Component } from 'react';
import { View, Text, ImageBackground, Pressable, ScrollView} from 'react-native';
import { Icon } from 'react-native-eva-icons'

// Local import
import dateRange from '../shared/dateRange'
import styles from '../styles/entrancesStyles'

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching)
const corsURI = 'https://morning-journey-78874.herokuapp.com/'
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

// Defining pertinent constants
const monthDict = {'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Ago': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'}
const moodColors = {'Horrível': 'red', 'Mau': 'blue', 'Regular': 'lightblue', 'Bem': 'orange', 'Ótimo': 'green'};

function convertMonthSig(monthSig) {
    return monthDict[ monthSig ]
}
function getToday() {
    const now = Date().toString().split(' ')
    const today = [ now[3], convertMonthSig(now[1]), now[2] ].join('-')
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
function LoadAddress ({entry}) {
    if (entry.address) {
        return(
            <View style={styles.cardRow}>
                <Icon name='pin' height={16} width={16} fill='rgba(255,255,255,0.75)' style={styles.icon} />
                <Text style={styles.text}>{entry.address}</Text>
            </View>        
        )
    } else {
        return <></>
    }
}
function Loadjornal ({entry}) {
    if (entry.jornal) {
        return <Text style={styles.textBadge}>{entry.jornal}</Text>
    } else {
        return <></>
    }
}
function LoadEmotions ({entry}) {
    if (entry.emotions.length>0) {
        return (
            entry.emotions.map((emotion, index) => {
                return(
                    <Text key={index} style={styles.emotionBadge}>{emotion}</Text>
                )
            })
        )
    } else {
        return (
            <></>
        )
    }
}

function EntryCard({ entry }) {
    return (
        <View key={entry._id} style={styles.card}>
            
            <View style={[styles.cardRow, styles.spaceBetween]}>
                <Text style={[styles.moodBadge, {backgroundColor: moodColors[entry.mood]}]}>{entry.mood}</Text>
                <View style={[styles.cardRow]}>
                    <Icon name='edit' height={18} width={18} fill='rgba(255,255,255,0.75)' style={styles.icon} />
                    <Text style={styles.text}>{entry.time}</Text>
               </View>
            </View>

            <View style={styles.cardRow}>
                <LoadEmotions entry={entry} />
            </View>        
            
                <LoadAddress entry={entry} />

            <View style={styles.cardRow}>
                <Loadjornal entry={entry} />
            </View>
        
        </View>
    );
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
        this.showTodayIfNewEntry = this.showTodayIfNewEntry.bind(this);
        this.onNextButtonPress = this.onNextButtonPress.bind(this);
        this.syncUserEntries = this.syncUserEntries.bind(this);
    }
    
    onNextButtonPress(next='next') { 
        function setSelectedDate() {
            this.setState( {selectedDate: getNextDate(this.state.selectedDate, next)} ) 
        }
        return setSelectedDate.bind(this);
    }

    showTodayIfNewEntry() {
        if (this.props.route.params) {
            if (this.props.route.params.newPost) {
                console.log('JUSTPOSTED STATUS: True. Selecting current date ...');
                this.setState({
                    selectedDate: getToday(),
                    entriesSynced: false,
                });
                this.props.navigation.setParams({newPost: false});
            } else console.log('JUSTPOSTED STATUS: False. Skipping...')
        }
    }

    async syncUserEntries() {

        if (!this.state.entriesSynced && !this.state.entriesLoading) {

            console.log('SYNCENTRIES STATUS: Started...')
            var info = this.props.route.params.userInfo;
            this.setState({ entriesLoading: true });
      
            try {

                var UsersResult = await fetch( corsURI + appServerURI + 'Users', { method: 'GET' });
                const usersStatus =  'Status: ' + UsersResult.status + ', ' + UsersResult.statusText
                if (UsersResult.ok) {
                    const users = await UsersResult.json();
                    const user = users.filter((user) => user.username === info.username)[0]
                    this.setState({userEntries: user['entries'].reverse(), entriesSynced: true})  
                    console.log('fetch GET request for user entries successful.')
                    console.log(usersStatus)
                    console.log('SYNCENTRIES STATUS: Successful.')
                } else {
                    console.log( new Error('"fetch" GET request for user entries failed. Throwing error...') )
                    throw new Error(usersStatus)
                }
        
            } catch (error) {
                    console.log('SYNCENTRIES STATUS: Error captured. Printing error...')
                    console.log(error);

            } finally {
                console.log('SYNCENTRIES STATUS: Finished.')
                this.setState({ entriesLoading: false });
            }    
        
        } else {
            if (this.state.entriesSynced) {
                console.log()
            } else if (this.state.entriesLoading) {
                
            }
            console.log('User entries data already synced or loading, skipping sync...')
        }
      }

    render() {

        console.log('Rendering "Entries" screen...')
        const isToday = this.state.selectedDate === this.state.date
        this.showTodayIfNewEntry();        
        this.syncUserEntries()

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
                            {this.state.userEntries.filter( (entry) => entry.date === this.state.selectedDate ).map(entry => <EntryCard entry={entry} />)}            
                        </View>
                </ScrollView>

                <Pressable onPress={() => { this.props.navigation.navigate( 'PostEntrance', {} )} }  style={[styles.postButton]}>
                        <Icon name='plus-circle' width={72} height={72} fill='white' style={styles.postButtonLabel}/>
                </Pressable>
  
            </ImageBackground>
            )

    }
  }
