// Module import
import React, { Component, useState } from 'react';
import { Platform, View, Text, Pressable, Image, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-eva-icons'

// Local import
import styles from '../../styles/entrancesStyles'
styles.theme = {}; styles.altTheme = {}; 

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
                        <Icon name='star' fill='gold' width={28} height={28} />
                    </View>
                    ) : <></> }                    
                    { entry.weather ? (
                        <View style={{height: 30, width: 50, alignItems: 'flex-end', justifyContent: 'center'}}>
                            <Image source={{uri: openWeatherMapIconsURI(entry.weather.weather.icon)}} style={{width: 40, height: 40}} />
                        </View>
                    ) : <></> }                    
                    { entry.weather ? (
                        <View style={{height: 30, width: 40, alignItems: 'flex-end', justifyContent: 'center'}}>
                            <Text style={[styles.theme, {fontSize: 14}]}> { entry.weather.main.temp.toString().slice(0,2) + '°C' } </Text>
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
    if (entry.emotions.length > 0) {
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
    const today = props.parentState.selectedDate == Today()
    const navigateParams = {
        currentEntry: {
            type: today ? 'new' : 'custom-date',
            date: props.parentState.selectedDate,
            entry: null
        },
        // setMainScreenState: props.setMainScreenState,
        // getMainScreenState: props.getMainScreenState,

    }
    const textStyle = [{fontSize: 16, marginTop: 7}, styles.theme]
    return (
        <Pressable
        onPress={ () => props.parentProps.navigation.navigate('PostEntrance', navigateParams) }
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
        <View style={[styles.card, {alignItems: 'center', justifyContent: 'center', height: 85}]}>
            <Icon name='sync-outline' fill='rgba(255,255,255,1)' width={25} height={25} />
            <Text style={[styles.theme, {marginTop: 10, fontSize: 16}]}>Sincronizando entradas...</Text>
        </View>
    )
}

export default class UserEntryCards extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        
        this.EntryCard = this.EntryCard.bind(this);
        this.EditEntryButtons = this.EditEntryButtons.bind(this);
        this.editUserEntry = this.editUserEntry.bind(this);
        this.deleteUserEntry = this.deleteUserEntry.bind(this);
        this.setFontColor = this.setFontColor.bind(this);
    }

    componentDidMount() {
        console.log('Subcomponent "UserEntryCards" did mount...')
    }

    componentWillUnmount() {
        console.log('"UserEntryCards" sub-component will unmount...')
      }
    
    EntryCard({ entry }) {
        function onEntryCardPress() {
            this.props.parentProps.navigation.setParams({ selectedEntryId: this.props.parentState.selectedEntryId === entry._id ? null : entry._id })
        }
        return (
        <Pressable
        onPress={onEntryCardPress.bind(this)}
        style={[styles.card]}>
            <MoodHeader entry={entry} />
            <Emotions entry={entry} />
            <Address entry={entry} />
            <Jornal entry={entry} />
            <this.EditEntryButtons entryId={entry._id} />
        </Pressable>
        );
    }

    UserEntryCardsList() {
        const selDateEntries = this.props.parentState.user.entries.filter( entry => entry.date === this.props.parentState.selectedDate ).reverse()
        // console.log('LOGGING USER ENTRIES:')
        // console.log(selDateEntries)
        if (selDateEntries.length) {
            return(
                <>
                    { selDateEntries.map( entry => <this.EntryCard key={'entry-card-'+entry.startTime} entry={entry} />) }
                    {/* { this.props.parentState.isUserDataSyncing ? <CardsLoadingMessage /> : null } */}
                </>
            )
        } else if (this.props.parentState.isUserDataSyncing) {
            return <CardsLoadingMessage />
            
        } else {
            return <EmptyCard {...this.props} />
        }
    }

    EditEntryButtons(props) {
        const buttonLabels = ['Editar', 'Excluir']
        const onButtonPress = { 'Editar': this.editUserEntry, 'Excluir': () => {this.props.setAlertMsg('Pressione e segure para excluir uma entrada.')} }
        const onButtonLongPress = { 'Editar': () => {}, 'Excluir': this.deleteUserEntry }

        const [isButtonPressed, setIsButtonPressed] = useState({
            'Editar': false,
            'Excluir': false,
        })

        function highlightButtonFor(label) {
            function highlightButton() {
                setIsButtonPressed({ ...isButtonPressed, [label]: !isButtonPressed[label] })
            }
            return highlightButton.bind(this);
        }

        const isLoading = this.props.parentState.isDeleteLoading | this.props.parentState.isUserDataSyncing
        const buttonLabel = (label) => <Text selectable={false} style={[styles.editButtonLabel, {color: label=='Excluir' ? 'red' : styles.theme.color }]}>{label}</Text>
        if (this.props.parentState.selectedEntryId == props.entryId) {
            return(
                <View style={styles.editButtonsView}>
                    { buttonLabels.map( (label) => (
                        <Pressable
                        key={`edit-${label}-${props.entryId}`}
                        style={[ styles.editButton, {
                            backgroundColor: isButtonPressed[label] ? styles.theme.color + '4' : '#0000',
                            borderColor: label=='Excluir' ? 'red' : styles.theme.color
                        }]}
                        disabled={ isLoading }
                        onPress={ () => {highlightButtonFor(label)(); onButtonPress[label]()} }
                        onPressIn={highlightButtonFor(label)}
                        onLongPress={() => {highlightButtonFor(label)(); onButtonLongPress[label]()}}
                        >
                            { label=='Excluir' ? (
                                this.props.parentState.isDeleteLoading ? <ActivityIndicator color='red' /> : buttonLabel(label)
                                
                            ) : buttonLabel(label) }
                                                
                        </Pressable>
                    )) }
            </View>
            )
        } else {
            return null
        }
    }

    editUserEntry() {
        const selectedEntry = this.props.parentState.user.entries.filter( (entry) => entry._id == this.props.parentState.selectedEntryId )[0]
        const navigateParams = {
            currentEntry: {
                type: 'edit',
                date: selectedEntry.date,
                entry: selectedEntry
            },
            // setMainScreenState: this.props.setMainScreenState,
            // getMainScreenState: this.props.getMainScreenState,
    
        }
        this.props.parentProps.navigation.navigate('PostEntrance', navigateParams)
    }

    async deleteUserEntry() {

        console.log('DELETE USER ENTRY STATUS: Started...')
        this.props.setMainScreenState({ isDeleteEntryLoading: true });

        try {
            var UsersResult = {ok: false, status: 999}
            const parentState = this.props.parentState
            const deleteEntryURI = appServerURI + 'Users/' + parentState.user.username + '/entries/' + parentState.selectedEntryId
            UsersResult = await fetch( deleteEntryURI, { method: 'DELETE' });
            // var UsersResult = await fetch( 'https://localhost:3000/' + 'Users/' + this.props.parentState.user.username + '/entries/' + this.props.parentState.selectedEntryId, { method: 'DELETE' });
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
            this.props.setMainScreenState({ isDeleteEntryLoading: false });
            // this.props.setMainScreenState({ selectedEntryId: null })
            console.log('DELETE USER ENTRY STATUS: FINISHED.' + UsersResult.ok ? 'Proceeding to sync user entries...' : 'Delete failed, skipping sync of user entries...')
            if (UsersResult.ok) {
                await this.props.syncUserData();
                this.props.parentProps.navigation.setParams({ selectedEntryId: null })
            }
        }    
    }

    setFontColor() {
        const fontColorDark = this.props.parentState.user.settings.fontColorDark
        const fontColor = fontColorDark ? '#000' : '#fff'
        const altFontColor = fontColorDark ? '#fff' : '#000'
        for (let style of ['theme', 'text']) {
            styles[style] = { ...styles[style], color: fontColor }
        }
        styles.altTheme.color = altFontColor
        styles.altTheme.backgroundColor = altFontColor
    }

    render() {
        console.log('"Rendering "UserEntryCards" sub-component..."')
        this.setFontColor()
        return this.UserEntryCardsList()
    }
}