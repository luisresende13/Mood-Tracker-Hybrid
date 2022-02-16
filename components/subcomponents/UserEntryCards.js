// Module import
import React, { Component, useState } from 'react';
import { Platform, View, Text, Pressable, Image } from 'react-native';
import { Icon } from 'react-native-eva-icons'

// Local import
import styles from '../../styles/entrancesStyles'

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const corsURI = Platform.OS == 'web' ? 'https://morning-journey-78874.herokuapp.com/' : ''
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

// OpenWeatherMap API weather icons URI:
function openWeatherMapIconsURI (icon) {
    if (Platform.OS === 'android') {
        return `http://openweathermap.org/img/wn/${icon}@2x.png`

    } else if (Platform.OS === 'web') {
        return `https://openweathermap.org/img/wn/${icon}@2x.png`
    }
}

// Defining mood colors schema
// const moodColors = ['#ff3333', '#0099cc', '#add8e6', '#ffff33', '#00cc00']
const moodColors = {'Horrível': '#ff3333', 'Mal': '#0099cc', 'Regular': '#add8e6', 'Bem': '#ffff33', 'Ótimo': '#00cc00'};

const monthDict = {'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Ago': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'}
function Today() {
    const now = Date().toString().split(' ')
    const today = [ now[3], monthDict[now[1]], now[2] ].join('-')
    return today
}

function MoodHeader({entry}) {
    return(
        <View style={ [styles.cardRow, styles.spaceBetween] }>
            <View style={ [{flexDirection: 'row', alignItems: 'center'} ] }>
                <Text style={[styles.moodBadge, {backgroundColor: moodColors[entry.mood]}]}>{entry.mood}</Text>
                    { entry.star ? (
                    <View style={{height: 30, width: 42, alignItems: 'flex-end', justifyContent: 'center'}}>
                        <Icon name='star' fill='gold' width={28} height={28} style={{}} />
                    </View>
                    ) : <></> }                    
                    { entry.weather ? (
                        <View style={{height: 30, width: 50, alignItems: 'flex-end', justifyContent: 'center'}}>
                            <Image source={{uri: openWeatherMapIconsURI(entry.weather.weather.icon)}} style={{width: 40, height: 40}} />
                        </View>
                    ) : <></> }                    
                    { entry.weather ? (
                        <View style={{height: 30, width: 40, alignItems: 'flex-end', justifyContent: 'center'}}>
                            <Text style={{fontSize: 14, fontWeight: '500', color:'#fffd'}}> { entry.weather.main.temp.toString().slice(0,2) + '°C' } </Text>
                        </View>
                    ) : <></> }                
                
            </View>
            <View style={[styles.cardRow]}>
                <Icon name='edit' height={18} width={18} fill='rgba(255,255,255,0.75)' style={{marginRight: 6}} />
                <Text style={styles.text}>{entry.startTime.slice(0,5)}</Text>
            </View>
        </View>

    )
}

function Address ({entry}) {

    const [isCollapsed, setIsCollapsed] = useState( 1 );
    if (entry.address) {
        return(
            <View style={styles.cardRow}>
                <Text numberOfLines={ isCollapsed } onPress={ () => { setIsCollapsed( isCollapsed ? 0 : 1 ) }} style={styles.text}>
                    <Icon name='pin' height={17} width={17} fill='rgba(255,255,255,0.75)' style={{position: 'relative', marginRight: 5, top: 2}} />
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
            <View style={[styles.cardRow, {flexWrap: 'wrap', justifyContent: 'flex-start', paddingTop: 2, PaddingBottom: 0}]}>
                { entry.emotions.map((emotion, index) => {
                    if (emotion.name) {
                        emotion = emotion.name
                    }
                    return(
                        <View key={'emotion-' + emotion} style={{paddingVertical: 5, paddingHorizontal: 2}}>
                            <Text style={[styles.emotionBadge]}>{emotion}</Text>
                        </View>
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

function Jornal({ entry }) {
    if (entry.jornal) {
        return(
            <View style={styles.cardRow}>
                <Text style={styles.textBadge}>
                    <Icon name='book-open' height={20} width={20} fill='rgba(0,0,0,0.25)' style={{position: 'relative', top: 4, left: 1, marginRight: 6}} />
                    {entry.jornal}
                </Text>
            </View>
        )
    } else {
        return <></>
    }
}

function EmptyCard(props) {
    const today = props.date == Today()
    const navigateParams = {
        user: props.user,
        currentEntry: {
            type: today ? 'new' : 'custom-date',
            date: props.date,
            entry: null
        },
        syncUserData: props.syncUserData,
        passUserData: props.passUserData,
    }
    const textStyle = {fontSize: 16, color: 'white', marginTop: 7}
    return (
        <Pressable
        onPress={ () => props.navigation.navigate('PostEntrance', navigateParams) }
        style={[styles.card, {alignItems: 'center', justifyContent: 'center', fontSize: 16, height: 145}]}
        >
            <Icon name='inbox' fill='rgba(255,255,255,0.3)' width={25} height={25} />
            <Text style={textStyle}> Nenhuma entrada encontrada. </Text>
            <Text style={textStyle}> Pressione aqui para adicionar uma a este dia! </Text>
        </Pressable>
    );
}

function CardsLoadingMessage() {
    return(
        <View style={[styles.card, {alignItems: 'center', justifyContent: 'center', height: 145}]}>
            <Icon name='sync-outline' fill='rgba(0,0,0,0.3)' width={25} height={25} />
        </View>
    )
}

export default class UserEntryCards extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
        this.EntryCard = this.EntryCard.bind(this);
        // this.onEntryCardPress = this.onEntryCardPress.bind(this);
        this.EditEntryButtons = this.EditEntryButtons.bind(this);
        this.editUserEntry = this.editUserEntry.bind(this);
        this.deleteUserEntry = this.deleteUserEntry.bind(this);
    }

    componentDidMount() {
        console.log('Subcomponent "UserEntryCards" did mount...')
        setInterval( () => { this.updateIfPosted() }, 1000 * 3 )
        // setInterval( () => { console.log('Default auto syncing started...'); this.syncUserData() }, 1000 * 10 )
        
    }

    updateIfPosted () {
        if (this.props.posted.status) {
            console.log('JUST POSTED STATUS: POSTED. Redirecting date and syncing entries ...');
            this.props.forgetPosted();
            this.props.syncUserData();
            }
    }

    EntryCard({ entry }) {
        function onEntryCardPress() {
            this.props.setSelectedEntryId(this.props.selectedEntryId === entry._id ? null : entry._id)
        }
        return (
        <Pressable onPress={onEntryCardPress.bind(this)} style={styles.card}>
            <MoodHeader entry={entry} />
            <Emotions entry={entry} />
            <Address entry={entry} />
            <Jornal entry={entry} />
            <this.EditEntryButtons entryId={entry._id} />
        </Pressable>
        );
    }    

    UserEntryCardsList() {
        const selDateEntries = this.props.user.entries.filter( (entry) => entry.date === this.props.date ).reverse()

        if (selDateEntries.length) {
            return selDateEntries.map( entry => <this.EntryCard key={'entry-card-'+entry.startTime} entry={entry} />)
        
        } else if (this.props.isUserDataSyncing) {    
            return <CardsLoadingMessage />

        } else {
            return <EmptyCard {...this.props} />
        }
    }

    EditEntryButtons(props) {
        const buttonLabels = ['Editar', 'Excluir']
        const onButtonPress = { 'Editar': this.editUserEntry, 'Excluir': this.deleteUserEntry }

        const [isButtonPressed, setIsButtonPressed] = useState({
            'Editar': false,
            'Excluir': false,
        })

        if (this.props.selectedEntryId == props.entryId) {
            return(
                <View style={styles.editButtonsView}>
                    { buttonLabels.map( (label) => (
                        <Pressable
                        key={`èdit-${label}-${props.entryId}`}
                        style={[styles.editButton,  {backgroundColor: isButtonPressed[label] ? (label=='Excluir' ? '#000f' : '#fff2') : '#0000', borderColor: label=='Excluir' ? 'red' : 'white' }]}
                        disabled={ this.state.isLoading | this.props.isUserDataSyncing }
                        onPress={ onButtonPress[label] }
                        onPressIn={() => setIsButtonPressed({ ...isButtonPressed, [label]: !isButtonPressed[label] })}
                        onPressOut={() => setIsButtonPressed({ ...isButtonPressed, [label]: !isButtonPressed[label] })}
                        >
                            <Text style={[styles.editButtonLabel, {color: label=='Excluir' ? 'red' : 'white' }]}>{label}</Text>                    
                        </Pressable>
                    )) }
            </View>
            )
        } else {
            return null
        }
    }

    editUserEntry() {
        const selectedEntry = this.props.user.entries.filter( (entry) => entry._id == this.props.selectedEntryId )[0]
        const navigateParams = {
            user: this.props.user,
            currentEntry: {
                type: 'edit',
                date: selectedEntry.date,
                entry: selectedEntry
            },
            syncUserData: this.props.syncUserData,
            passUserData: this.props.passUserData,
        }
        this.props.navigation.navigate('PostEntrance', navigateParams)
    }

    async deleteUserEntry() {

        console.log('DELETE USER ENTRY STATUS: Started...')
        this.setState({ isLoading: true });
        // prompt()

        try {
            var UsersResult = {ok: false, status: 999}
            UsersResult = await fetch( corsURI + appServerURI + 'Users/' + this.props.user.username + '/entries/' + this.props.selectedEntryId, { method: 'DELETE' });
            // var UsersResult = await fetch( 'https://localhost:3000/' + 'Users/' + this.props.user.username + '/entries/' + this.props.selectedEntryId, { method: 'DELETE' });
            const usersStatus =  'Status ' + UsersResult.status + ', ' + UsersResult.statusText

            if (UsersResult.ok) {
                // const users = await UsersResult.json();
                console.log('fetch DELETE request for user entry successful.')
                console.log(usersStatus)
                console.log('DELETE USER ENTRY STATUS: Successful.')

            } else {
                console.log( new Error('"fetch" DELETE request for user entry failed. Throwing error...') )
                throw new Error(usersStatus)
            }
    
        } catch (error) {
                console.log('DELETE USER ENTRY STATUS: Error captured. Printing error...')
                console.log(error);
                this.props.setAlertMsg('Não foi possível deletar a entrada. Tente novamente.')

        } finally {
            this.setState({ isLoading: false});
            this.props.setSelectedEntryId(null)
            console.log('DELETE USER ENTRY STATUS: FINISHED.' + UsersResult.ok ? 'Proceeding to sync user entries...' : 'Delete failed, skipping sync of user entries...')
            if (UsersResult.ok) {this.props.syncUserData()}
        }    
    }

    render() {
        // console.log('"Rendering "UserEntryCards" subcomponent..."')
        return this.UserEntryCardsList()
    }
}