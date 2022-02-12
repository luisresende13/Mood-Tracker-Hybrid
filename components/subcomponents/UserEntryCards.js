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
                    <Icon name='pin' height={17} width={17} fill='rgba(255,255,255,0.75)' style={{marginRight: 5, top: 2}} />
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
                    <Icon name='book-open' height={20} width={20} fill='rgba(0,0,0,0.25)' style={{top: 4, left: 1, marginRight: 6}} />
                    {entry.jornal}
                </Text>
            </View>
        )
    } else {
        return <></>
    }
}

function EmptyCard(props) {
    const textStyle = {fontSize: 16, color: 'white', marginTop: 7}
    return (
        <Pressable onPress={ () => props.navigation.navigate( 'PostEntrance', {currentEntry: 'new'} ) } style={[styles.card, {alignItems: 'center', justifyContent: 'center', fontSize: 16, height: 145}]}>
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
            date: this.props.date,
            userEntries: [],
            selectedEntryId: null,
            isEntriesSyncing: false,
            isDeleteLoading: false,
            newPost: this.props.newPost,
        };
        this.EntryCard = this.EntryCard.bind(this);
        this.onEntryCardPress = this.onEntryCardPress.bind(this);
        this.EditEntryButtons = this.EditEntryButtons.bind(this);
        this.editUserEntry = this.editUserEntry.bind(this);
        this.deleteUserEntry = this.deleteUserEntry.bind(this);
        this.syncUserEntries = this.syncUserEntries.bind(this);
    }

    componentDidMount() {
        console.log('"Subcomponent UserEntryCards did mount..."')
        this.syncUserEntries()
        setInterval( () => { this.updateIfNewPost() }, 1000 * 2 )
        setInterval( () => { console.log('Default auto syncing started...'); this.syncUserEntries() }, 1000 * 10 )
        
    }

    updateIfNewPost () {
        if (this.props.newPost) {
            console.log('JUST POSTED WARNING: POSTED. Selecting current date ...');
            this.props.forgetNewPost();
            this.syncUserEntries();
        }
    }

    EditEntryButtons(props) {
        const buttonLabels = ['Editar', 'Excluir']
        const [isButtonPressed, setIsButtonPressed] = useState({
            'Editar': false,
            'Excluir': false,
            'Mover': false,
        })
        const onEditButtonPress = {'Excluir': this.deleteUserEntry, 'Editar': this.editUserEntry, 'Mover': () => {console.log('Mover entrada...')}}
        const editButtonLoading = {'Excluir': this.state.isDeleteLoading, 'Editar': false, 'Mover': false}

        if (this.state.selectedEntryId == props.entryId) {
            return(
                <View style={styles.editButtonsView}>
                    {buttonLabels.map( (buttonLabel, index) => (
                        <Pressable
                        key={`èdit-${buttonLabel}-${props.entryId}`}
                        style={[styles.editButton,  {backgroundColor: isButtonPressed[buttonLabel] ? (buttonLabel=='Excluir' ? '#000f' : '#fff2'): '#0000', borderColor: buttonLabel=='Excluir' ? 'red' : 'white' }]}
                        disabled={ editButtonLoading[buttonLabel] | this.state.isEntriesSyncing }
                        onPress={ onEditButtonPress[buttonLabel] }
                        onPressIn={() => setIsButtonPressed({ ...isButtonPressed, [buttonLabel]: !isButtonPressed[buttonLabel] })}
                        onPressOut={() => setIsButtonPressed({ ...isButtonPressed, [buttonLabel]: !isButtonPressed[buttonLabel] })}
                        >
                            <Text style={[styles.editButtonLabel, {color: buttonLabel=='Excluir' ? 'red' : 'white' }]}>{buttonLabel}</Text>                    
                        </Pressable>
                    ))}
            </View>
            )
        } else {
            return null
        }
    }

    onEntryCardPress(entryId) {
        function setSelectedEntryId() {
            this.setState({ selectedEntryId: this.state.selectedEntryId === entryId ? null : entryId })
        }
        return setSelectedEntryId.bind(this);
    }

    EntryCard({ entry }) {
        return (
            <Pressable onPress={this.onEntryCardPress(entry._id)} style={styles.card}>
                <MoodHeader entry={entry} />
                <Emotions entry={entry} />
                <Address entry={entry} />
                <Jornal entry={entry} />

                <this.EditEntryButtons entryId={entry._id}/>

            </Pressable>
        );
    }    

    UserEntryCardsList() {
        const selDateEntries = this.state.userEntries.filter( (entry) => entry.date === this.props.date )

        if (selDateEntries.length) {
            return selDateEntries.map( entry => <this.EntryCard key={'entry-card-'+entry.startTime} entry={entry} />)
        
        } else if (this.state.isEntriesSyncing) {    
            return <CardsLoadingMessage />

        } else {
            return <EmptyCard navigation={this.props.navigation} />
        }
    }

    editUserEntry() {
        const currentEntry = this.state.userEntries.filter( (entry) => entry._id == this.state.selectedEntryId )[0]
        this.props.navigation.navigate('PostEntrance', {currentEntry: currentEntry })
    }

    async deleteUserEntry() {

        console.log('DELETE USER ENTRY STATUS: Started...')
        this.setState({ isDeleteLoading: true });

        // prompt()

        try {
            var UsersResult = {ok: false, status: 999}
            UsersResult = await fetch( corsURI + appServerURI + 'Users/' + this.props.userInfo.username + '/entries/' + this.state.selectedEntryId, { method: 'DELETE' });
            // var UsersResult = await fetch( 'https://localhost:3000/' + 'Users/' + this.props.userInfo.username + '/entries/' + this.state.selectedEntryId, { method: 'DELETE' });
            const usersStatus =  'Status: ' + UsersResult.status + ', ' + UsersResult.statusText

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

        } finally {
            this.setState({ isDeleteLoading: false });
            console.log('DELETE USER ENTRY STATUS: FINISHED. Proceeding to sync user entries...')
            if (UsersResult.ok) {this.syncUserEntries()}
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
                const user = users.filter((user) => user.email === this.props.userInfo.email)[0]
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
        console.log('"Rendering "UserEntryCards" subcomponent..."')
        return this.UserEntryCardsList()
    }
}