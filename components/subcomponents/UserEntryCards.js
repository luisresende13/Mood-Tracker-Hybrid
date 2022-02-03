// Module import
import React, { Component } from 'react';
import { View, Text, Pressable} from 'react-native';
import { Icon } from 'react-native-eva-icons'

// Local import
import styles from '../../styles/entrancesStyles'

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching)
const corsURI = 'https://morning-journey-78874.herokuapp.com/'
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

// Defining mood colors schema
const moodColors = {'Horrível': 'red', 'Mal': 'blue', 'Regular': 'lightblue', 'Bem': 'orange', 'Ótimo': 'green'};
const monthDict = {'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Ago': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'}

// Defining pertinent functions

function Today() {
    const now = Date().toString().split(' ')
    const today = [ now[3], monthDict[now[1]], now[2] ].join('-')
    return today
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
                    <Pressable style={{paddingVertical: 5, paddingHorizontal: 2}}>
                        <Text key={index} style={[styles.emotionBadge]}>{emotion}</Text>
                    </Pressable>
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
            <View style={[styles.cardRow, {flexWrap: 'wrap', justifyContent: 'flex-start'}]}>
                <LoadEmotions entry={entry} />
            </View>        
            <LoadAddress entry={entry} />
            <View style={styles.cardRow}>
                <Loadjornal entry={entry} />
            </View>
        </View>
    );
}

export default class UserEntryCards extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: this.props.date,
            userEntries: [],
            entriesSyncing: false,
            newPost: this.props.newPost,
        };
        this.syncUserEntries = this.syncUserEntries.bind(this);
    }

    componentDidMount() {
        console.log('"Subcomponent UserEntryCards did mount..."')
        this.syncUserEntries()
        setInterval( () => { console.log('Default auto syncing started...'); this.syncUserEntries() }, 1000 * 10 )
        setInterval( () => { this.updateIfNewPost() }, 1000 * 1 )
        
    }

    updateIfNewPost () {
        if (this.props.newPost) {
            console.log('JUST POSTED STATUS: True. Selecting current date ...');
            this.props.forgetNewPost();
            this.syncUserEntries();
        }
    }

    async syncUserEntries() {

        console.log('SYNC ENTRIES STATUS: Started...')
        this.setState({ entriesSyncing: true });
    
        try {

            var UsersResult = await fetch( corsURI + appServerURI + 'Users', { method: 'GET' });
            const usersStatus =  'Status: ' + UsersResult.status + ', ' + UsersResult.statusText

            if (UsersResult.ok) {
                const users = await UsersResult.json();
                const user = users.filter((user) => user.username === this.props.userInfo.username)[0]
                console.log('fetch GET request for user entries successful.')
                console.log(usersStatus)
                this.setState({userEntries: user['entries'].reverse(), entriesSynced: true})  
                console.log('SYNC ENTRIES STATUS: Successful.')

            } else {
                console.log( new Error('"fetch" GET request for user entries failed. Throwing error...') )
                throw new Error(usersStatus)
            }
    
        } catch (error) {
                console.log('SYNC ENTRIES STATUS: Error captured. Printing error...')
                console.log(error);

        } finally {
            this.setState({ entriesSyncing: false });
            console.log('SYNC ENTRIES STATUS: Finished.')
        }    
    }

    render() {
        console.log('"Rendering UserEntryCards subcomponent..."')
        return this.state.userEntries.filter( (entry) => entry.date === this.props.date ).map(entry => <EntryCard entry={entry} />)
    }
}