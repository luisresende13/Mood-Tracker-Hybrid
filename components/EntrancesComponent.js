
import React, { Component } from 'react';
import { View, Text, ImageBackground, Pressable, ScrollView} from 'react-native';
import { Icon } from 'react-native-eva-icons'

console.log('Navigator.arguments: ' + JSON.stringify(Navigator.arguments))    

import DATA from '../shared/DatabaseReduced'
import dateRange from '../shared/dateRange'
import styles from '../styles/entrancesStyles'

const cors_uri = 'https://morning-journey-78874.herokuapp.com/'

function convertMonthSig(monthSig) {
    const monthSigs = ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec']
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    const thisMonth = months[monthSigs.indexOf(monthSig)]
    return thisMonth
}
function getTime() {
    //Wed,Jan,26,2022,15:12:37,GMT-0300,(Horário,Padrão,de,Brasília)
    const now = Date().toString().split(' ')
    const time = now[4]
    return time
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

const now = new Date().toString().split(' ')
const date = now[2]+'th ' + now[1]


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

const moodColors = {'Horrível': 'red', 'Mau': 'blue', 'Regular': 'grey', 'Good': 'orange', 'Bem': 'orange', 'Ótimo': 'green', 'Great': 'green'};
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
            isLoading: false,
            isDataSynced: false,
        };
        this.showTodayIfNewEntry = this.showTodayIfNewEntry.bind(this);
        this.onNextButtonPress = this.onNextButtonPress.bind(this);
        this.loadUserData = this.loadUserData.bind(this);
    }
    
    onNextButtonPress(next='next') { 

        function setSelectedDate() {
            this.setState( {selectedDate: getNextDate(this.state.selectedDate, next)} ) 
        }
        setSelectedDate = setSelectedDate.bind(this);
        return setSelectedDate
    }

    showTodayIfNewEntry() {
        console.log('Checking if user just posted an entry...');
        if (this.props.route.params) {
            if (this.props.route.params.newPost) {
                console.log('Checked, user posted. Setting today as selected date...')

                this.setState({
                    selectedDate: getToday(),
                    isDataSynced: false,
                });
                this.props.navigation.setParams({newPost: false});
            } else console.log('Checked, user did not just post.')
        }
    }

    async loadUserData() {

        if (!this.state.isDataSynced & !this.state.isLoading) {

            var info = this.props.route.params.userInfo;
            this.setState({ isLoading: true });
      
            try {
            console.log('Attempting to sync user entries...')
            var UsersResult = await fetch(`${cors_uri}https://mood-tracker-server.herokuapp.com/Users`, { method: 'GET' });
              
              if (!UsersResult.ok) {
                console.log('fetch GET request failed. Throwing error...')
                throw new Error(UsersResult.status + ', ' + UsersResult.statusText + '. For GET request in url: ' + UsersResult.url)
              } else {

                console.log('fetch GET request successful.')
                console.log(UsersResult.status + ', ' + UsersResult.statusText + '. For GET request in url: ' + UsersResult.url)
      
                const Users = await UsersResult.json();
                const user = Users.filter((user) => user.username === info.username)[0]
                this.setState({userEntries: user['entries'].reverse(), isDataSynced: true})  
                console.log('User entries successfully synced!')
              }
    
            } catch (error) {
              alert('Erro ao carregar entradas, tente novamente.')
              console.log('Erro capturado:')
              console.log(error);
      
            } finally {
              this.setState({ isLoading: false });
            }    
        
        } else {
            console.log('User data loading or already synced, skipping sync...')
        }
      }

    render() {

        const isToday = this.state.selectedDate === this.state.date
        this.showTodayIfNewEntry();        
        this.loadUserData()

        return(

            <ImageBackground source={require('../assets/wallpaper.jpg')} style={[styles.mainView]}>
                <ScrollView style={styles.scrollView}>

                    <View style={styles.section}>
                        <View style={[styles.cardRow, {justifyContent: 'space-between'}]}>
                            <Pressable onPress={ this.onNextButtonPress('previous') }>
                                <Icon name='arrow-back' width={35} height={35} fill='white' />
                            </Pressable>
                            <Text style={styles.sectionTitle}>{'Suas entradas  •  ' + ( this.state.selectedDate===this.state.date ? 'Hoje, ' : '' ) + this.state.selectedDate}</Text>
                            {
                                !isToday ? (
                                    <Pressable onPress={ this.onNextButtonPress() }>
                                        <Icon name='arrow-forward' width={35} height={35} fill='white' />
                                    </Pressable>   
                                ) : (
                                    <View></View>
                                )
                            }
                        </View>
                        {this.state.userEntries.filter( (entry) => entry.date === this.state.selectedDate ).map(entry => <EntryCard entry={entry} />)}
        
                    </View>
                    
                    {/* <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Gratidão</Text>
                        {this.state.DATA.map(entry => <anotherExampleCard key={entry._id} entry={entry} />)}
                    </View> */}

                </ScrollView>

                <Pressable onPress={() => { this.props.navigation.navigate( 'PostEntrance', {} )} }  style={[styles.postButton]}>
                        <Icon name='plus-circle' width={72} height={72} fill='white' style={styles.postButtonLabel}/>
                </Pressable>
  
            </ImageBackground>
            )
      
    }
  }
