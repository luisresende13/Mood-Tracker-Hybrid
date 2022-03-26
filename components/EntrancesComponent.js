// Module imports
import React, { Component } from 'react';
import { View, Text, ImageBackground, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-eva-icons'
import { relativeToScreen } from '../styles/loginStyles';
import { Today, formatDate, getNextDate, oneDigit } from '../shared/dates';


// Component imports
import UserEntryCards from './subcomponents/UserEntryCards';

// Local imports
import styles  from '../styles/entrancesStyles';

// Defining pertinent constants
function getTime() {
    //Wed,Jan,26,2022,15:12:37,GMT-0300,(Horário,Padrão,de,Brasília)
    const now = Date().toString().split(' ')
    const time = now[4]
    return time
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

    setAlertMsg(msg) {
        this.setState({alertMsg: msg})
        setTimeout( () => this.setState({alertMsg: ''}) , 1000 * 5 )
    }
    
    alertMsg() {
        return(
            <View style={[styles.msgBox, this.state.alertMsg ? {} : {height: null, backgroundColor: 'transparent', borderColor: 'transparent'} ]}>
                <Text style={styles.msg}>{this.state.alertMsg}</Text>
            </View>
        )
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

    DateNavigationButton = ({next}) => {
        return(
            <Pressable onPress={this.onNextButtonPress(next)} hitSlop={relativeToScreen(15)} >
                <Icon name={ next=='next' ? 'arrow-forward' : 'arrow-back'} width={relativeToScreen(29)} height={relativeToScreen(29)} fill={styles.theme.color} />
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
                        <View style={[styles.header]}>
                            <Text style={[styles.sectionTitle, styles.theme]}>{ 'Entradas' }</Text>                                
                        </View>
                    <View style={styles.section}>
                        <View style={[styles.cardRow, styles.navigationRow, {paddingVertical: 0}]}>
                            <this.DateNavigationButton icon='arrow-back' next='previous' />
                            <Text style={[{fontSize: relativeToScreen(20), }, styles.theme]}> { formatDate(this.props.route.params.selectedDate)} </Text>                                
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
                        <Icon name='plus-circle' width={relativeToScreen(72)} height={relativeToScreen(72)} fill='#f4f3f4' style={styles.postButtonLabel}/>
                    )
                )}
                </Pressable>

                {this.alertMsg()}
  
            </ImageBackground>
            )
    }
  }
