// Module import
import React, { Component, useState } from 'react';
import { View, Text, Pressable} from 'react-native';
import { Icon } from 'react-native-eva-icons'

// Local import
import styles from '../../styles/entrancesStyles'

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching)
const corsURI = 'https://morning-journey-78874.herokuapp.com/'
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

// Defining mood colors schema
const moodColors = {'Horrível': '#ff3333', 'Mal': '#0099cc', 'Regular': '#ffffff', 'Bem': '#ffff33', 'Ótimo': '#00b300'};
const monthDict = {'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Ago': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'}

function MoodHeader({entry}) {
    return(
        <View style={[styles.cardRow, styles.spaceBetween]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[styles.moodBadge, {backgroundColor: moodColors[entry.mood]}]}>{entry.mood}</Text>
                { entry.star ? <Icon name='star' fill='gold' width={27} height={27} style={{paddingLeft: 15, paddingBottom: 2}} ></Icon> : <></> }
            </View>
            <View style={[styles.cardRow]}>
                <Icon name='edit' height={18} width={18} fill='rgba(255,255,255,0.65)' style={{paddingRight: 8}} />
                <Text style={styles.text}>{entry.startTime.slice(0,5)}</Text>
            </View>
        </View>

    )
}

function Address ({entry}) {

    const [isCollapsed, setIsCollapsed] = useState(1);

    // const onAddressPress = (event) => {

    //     console.log('isCollapsed: ' + isCollapsed)
    //     var ping = isCollapsed ? 0 : 1
    //     setIsCollapsed( ping )
    // }

    if (entry.address) {
        return(
            <View style={styles.cardRow}>
                <Text numberOfLines={ isCollapsed } onPress={ () => { setIsCollapsed( isCollapsed ? 0 : 1 ) }} style={styles.text}>
                    <Icon name='pin' height={16} width={16} fill='rgba(255,255,255,0.75)' style={{marginRight: 10}} />
                    {entry.address}
                </Text>
            </View>        
        )
    } else {
        return <></>
    }
}

function Emotions ({entry}) {
    if (entry.emotions.length>0) {
        return (
            <View style={[styles.cardRow, {flexWrap: 'wrap', justifyContent: 'flex-start'}]}>
                { entry.emotions.map((emotion, index) => {
                    return(
                        <Pressable style={{paddingVertical: 5, paddingHorizontal: 2}}>
                            <Text key={index} style={[styles.emotionBadge]}>{emotion}</Text>
                        </Pressable>
                    )
                })}
            </View>
        )
    } else {
        return (
            <></>
        )
    }
}

function Jornal ({entry}) {
    if (entry.jornal) {
        return(
            <View style={styles.cardRow}>    
                <Text style={styles.textBadge}>{entry.jornal}</Text>
            </View>
        )
    } else {
        return <></>
    }
}

function EntryCard({ entry }) {
    return (
        <View key={entry._id} style={styles.card}>
            <MoodHeader entry={entry} />
            <Emotions entry={entry} />
            <Address entry={entry} />
            <Jornal entry={entry} />
        </View>
    );
}

function EmptyCard(props) {
    const textStyle = {fontSize: 16, color: 'white', marginTop: 7}
    return (
        <Pressable onPress={ () => props.navigation.navigate( 'PostEntrance', {} ) } style={[styles.card, {alignItems: 'center', justifyContent: 'center', fontSize: 16, height: 145}]}>
            <Icon name='inbox' fill='rgba(255,255,255,0.3)' width={25} height={25} ></Icon>
            <Text style={textStyle}> Nenhuma entrada encontrada. </Text>
            <Text style={textStyle}> Pressione aqui para adicionar uma a este dia! </Text>
        </Pressable>
    );
}

function CardsLoadingMessage() {
    return(
        <View style={[styles.card, {alignItems: 'center', justifyContent: 'center', height: 145}]}>
            <Icon name='sync-outline' fill='rgba(0,0,0,0.3)' width={25} height={25} ></Icon>
        </View>
    )
}

export default class UserEntryCards extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: this.props.date,
            userEntries: [],
            isEntriesSyncing: false,
            newPost: this.props.newPost,
        };
        this.syncUserEntries = this.syncUserEntries.bind(this);
    }

    componentDidMount() {
        console.log('"Subcomponent UserEntryCards did mount..."')
        this.syncUserEntries()
        // setInterval( () => { console.log('Default auto syncing started...'); this.syncUserEntries() }, 1000 * 10 )
        setInterval( () => { this.updateIfNewPost() }, 1000 * 1 )
        
    }

    updateIfNewPost () {
        if (this.props.newPost) {
            console.log('JUST POSTED WARNING: POSTED. Selecting current date ...');
            this.props.forgetNewPost();
            this.syncUserEntries();
        }
    }

    UserEntryCardsList() {

        const selDateEntries = this.state.userEntries.filter( (entry) => entry.date === this.props.date )
        if (selDateEntries.length) {
            return selDateEntries.map(entry => <EntryCard entry={entry} />)
        
        } else if (this.state.isEntriesSyncing) {    
            return <CardsLoadingMessage />

        } else {
            return <EmptyCard navigation={this.props.navigation} />
        }
    }
    
    async syncUserEntries() {

        console.log('SYNC ENTRIES STATUS: Started...')
        this.setState({ isEntriesSyncing: true });
    
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
            this.setState({ isEntriesSyncing: false });
            console.log('SYNC ENTRIES STATUS: Finished.')
        }    
    }

    render() {
        console.log('"Rendering UserEntryCards subcomponent..."')
        return this.UserEntryCardsList()
    }
}