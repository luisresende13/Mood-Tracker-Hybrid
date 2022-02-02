import React, {useState, Component} from 'react';
import { View, Text, ImageBackground, Pressable, ScrollView } from 'react-native';
import { TextInput} from 'react-native-gesture-handler';
import { Icon } from 'react-native-eva-icons'

import styles from '../styles/postEntryStyles'
import styles2 from '../styles/entrancesStyles'

const cors_uri = 'https://morning-journey-78874.herokuapp.com/'

styles.emotionBadge = {
    backgroundColor: 'rgba(1,1,1,0.5)',
    borderRadius: 30,
    paddingVertical: 7,
    paddingHorizontal: 12.5,
    marginRight: 6,
    // width: '100%', //must be removed, badge should have text width
    fontSize: 15,
    textAlign: 'center',
}

styles.text = {fontSize: 14}


// Date() => wed jan 91 2022 07:46:57 ...
const now = new Date().toString().split(' ')
const datetime = now[2] + ' ' + now[1] + ' ' + now[3] + ' - ' + now[4].slice(0, 5)

const goodEnergizedEmotions = ['Animado(a)', 'Concentrado(a)', 'Desinibido(a)', 'Motivado(a)', 'Energizado(a)', 'Euforico(a)', 'Emocionado(a)', 'Amor']
const goodCalmEmotions = ['Alíviado(a)', 'Calmo(a)', 'Confortável', 'Despreocupado(a)', 'Inspirado(a)', 'Orgulhoso(a)', 'Paz', 'Relaxado(a)', 'Satisfeito(a)', 'Seguro(a)']
const badEnergizedEmotions = ['Agitado(a)', 'Ansioso(a)', 'Triste', 'Decepcionado(a)', 'Depressivo(a)', 'Desesperado(a)', 'Frustrado(a)', 'Insatisfeito(a)', 'Irritado(a)', 'Medo', 'Paranoico(a)', 'Preocupado(a)', 'Impaciente', 'Raiva', 'Revoltado(a)', 'Sobrecarregado(a)', 'Tenso(a)', 'Anti-social', 'Enojado(a)']
const badCalmEmotions = ['Timido(a)', 'Cansado(a)', 'Confuso(a)', 'Desanimado(a)', 'Vergonha', 'Inseguro(a)', 'Apático(a)', 'Solitário(a)', 'Tedio']
const basicEmotions = [ ...goodEnergizedEmotions, ...goodCalmEmotions, ...badEnergizedEmotions, ...badCalmEmotions]
const emotionGroups = [goodEnergizedEmotions, goodCalmEmotions, badEnergizedEmotions, badCalmEmotions]
const emotionGroupsNames = ['Bem & Energizado', 'Bem & Calmo', 'Mal e Energizado', 'Mal & Calmo']
var isSelectedEmotions = {}
for (var i=0; i<basicEmotions.length; i++){
isSelectedEmotions[basicEmotions[i]] = false
}
// Array(basicEmotions.length).fill(false)


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

function FormattedTime() {
    // const time = new Date().toString().split(' ')[4]
    var newTime = getTime().slice(0,5)
    var h = parseInt(newTime.slice(0,2))
    var m = parseInt(newTime.slice(3,5))
    newTime = h > 12 ? ( (h-12).toString().length==1 ? '0'+(h-12) : h-12 ) + ':' +  m + ' PM' : ( h.toString().length==1 ? '0'+ h : h ) + ':' + m + ' AM'
    return newTime
}

export default class PostEntranceScreen extends Component {
  
    constructor(props) {
        super(props);

        this.state = {
            moodButtons: {
            colors: ['darkred', 'lightblue', 'darkgrey', 'pink', 'lightgreen'],
            colorsSelected: ['red', 'blue', 'grey', 'purple', 'green'],
            moods: ['Horrivel', 'Mal', 'Regular', 'Bem', 'Ótimo'],  
            },
            emotionButtons: {
                isSelectedEmotions: isSelectedEmotions,
                basicEmotions: basicEmotions,
                emotionGroups: emotionGroups,
            },
            star: false,
            selectedMood: null,
            jornalEntry: '',    
            emotions: [],
            address: '',

            startTime: FormattedTime(),
            selectedEntry: 'Mood',
            isLoading: false,
        };

        this.onSaveButtonPress = this.onSaveButtonPress.bind(this);
        this.EmotionButtons = this.EmotionButtons.bind(this);
        this.MoodButtons = this.MoodButtons.bind(this);
        this.postEntryHeader = this.postEntryHeader.bind(this);
        this.onEmotionButtonPress = this.onEmotionButtonPress.bind(this);
        this.onMoodButtonPress = this.onMoodButtonPress.bind(this);
        this.inputSection = this.inputSection.bind(this);
        this.setSelectedEntry = this.setSelectedEntry.bind(this);
        this.InputCard = this.InputCard.bind(this);
        this.JornalInput = this.JornalInput.bind(this);
        this.postNewEntryAsync = this.postNewEntryAsync.bind(this);
    }

    postEntryHeader() {
        return(
            <View style={[styles2.cardRow, {justifyContent: 'space-between'}]}>
                <Pressable onPress={() => {this.props.navigation.goBack()}}  style={styles.postButton}>
                    <Icon name='arrow-back' fill='white' height={30} width={30}/>
                </Pressable>
                <View style={[styles2.emotionBadge, {flexDirection: 'row'}]}>
                    <Text > {datetime} </Text>
                    <Icon name='edit' fill='rgba(75,75,75,1)' height={20} width={20}/>
                </View>
                <Pressable onPress={() => {this.setState({star: !this.state.star})}}  style={styles.postButton}>
                    <Icon name={this.state.star ? 'star' : 'star-outline'} fill='rgba(245,245,245,0.7)' height={30} width={30}/>
                </Pressable>
            </View>
        )
    }

    onMoodButtonPress(item) {
        // alert(e)
        function selectMood() {
            if (this.state.selectedMood==item) {
                this.setState({selectedMood: null})
            } else {
                this.setState({selectedMood: item})
            }
        }
        selectMood = selectMood.bind(this);
        return selectMood
    }

    onEmotionButtonPress(emotion) { 
        function selectEmotion () {
            this.setState({
                emotionButtons: {
                    ...this.state.emotionButtons,
                    isSelectedEmotions: {
                        ...this.state.emotionButtons.isSelectedEmotions,
                        [emotion]: !this.state.emotionButtons.isSelectedEmotions[emotion]
                    }
                }
            })
        }
        selectEmotion = selectEmotion.bind(this);
        return selectEmotion
    }

    MoodButtons() {
        return(
            this.state.moodButtons.moods.map((item, index) => (
                <View key={'mood '+index} style={{width: 65, height: 65, alignItems: 'center', justifyContent: 'center'}} >
                    <Pressable
                    title={item}
                    onPress={this.onMoodButtonPress(item)}
                    style={[
                        styles.moodButton,
                        this.state.selectedMood==item ? {
                            height: 60,
                            width: 60,
                            fontWeight: 'bold',
                            backgroundColor: this.state.moodButtons.colorsSelected[index],
                            borderWidth: 2,
                            borderColor: this.state.moodButtons.colors[index],
                        } : {
                            height: 50,
                            width: 50,
                            fontWeight: null,
                            backgroundColor: this.state.moodButtons.colors[index]
                        }
                    ]}
                    >
                        <Text style={{textAlign: 'center', textAlignVertical: 'center'}}>{item}</Text>
                    </Pressable>
                </View>
            ))
        )
    }

    EmotionButtons(emotions) {
        return(
            emotions.map( emotion => (
                <Pressable
                title={emotion}
                style={ {paddingVertical: 5} }
                onPress={this.onEmotionButtonPress(emotion)}
                >
                    <Text style={[styles.emotionBadge, {backgroundColor: this.state.emotionButtons.isSelectedEmotions[emotion] ? 'steelblue' : 'white' }]}>{emotion}</Text>
                </Pressable>
            ))
        )
    }

    JornalInput() {
        return(
        <TextInput multiline 
            placeholder='Today was...' 
            style={styles.jornalText}
            onChangeText={text => this.setState({jornalEntry: text})}
            value={this.state.jornalEntry}
            >
        </TextInput>
        )
    }

    setSelectedEntry (entry) {
        function setSelected() {
            this.setState( {selectedEntry:  this.state.selectedEntry === entry ? null : entry  } )
        }
        setSelected = setSelected.bind(this);
        return setSelected
    }

    inputSection(section, inputStyle, inputs) {
        // if (this.state.isEntrySelected[section]) {
        if (this.state.selectedEntry === section) {

            if (section == 'Emotions') {
                return this.state.emotionButtons.emotionGroups.map((emotions, index) => (
                    <View style={{width: '100%', alignItems: 'center'}}>
                        <Text style={{fontSize: 15, color: 'white', paddingVertical: 11}}>{emotionGroupsNames[index]}</Text>
                        <View key={index} style={[styles2.cardRow, inputStyle]}>
                            {inputs(emotions)}
                        </View>
                    </View>
                ))
            } else {
                return(
                    <View style={[styles2.cardRow, inputStyle]}>
                        {inputs}
                    </View>
                )    
            }
        } else {
            return(
                <></>
            )
        }

    }

    InputCard(section, sectionName, icon, inputStyle, inputs) {
        return(
            <View style={[styles2.card]}>
                <Pressable style={styles2.cardRow}  onPress={this.setSelectedEntry(section)}>
                    <Icon name={icon} fill='rgba(255,255,255,0.75)' height={25} width={25} style={styles2.entryIcon}/>
                    <Text style={styles.entryTitle}> {sectionName} </Text>
                </Pressable>

                {this.inputSection(section=section, inputStyle=inputStyle, inputs=inputs)}  

            </View>
        )
    }

    onSaveButtonPress () {
        if (!this.state.selectedMood) {
            alert('Necessário adicionar uma avaliação.')

        } else {
            const newEntry = {
                jornal: this.state.jornalEntry,
                mood: this.state.selectedMood,
                emotions: this.state.emotionButtons.basicEmotions.filter( emotion => this.state.emotionButtons.isSelectedEmotions[emotion] ) ,
                address: this.state.address,
                date: getToday(),
                startTime: this.state.startTime,
                endTime: FormattedTime(),
                star: this.state.star,
            }
            this.postNewEntryAsync(newEntry)
        }
    }

    async postNewEntryAsync(newEntry) {
        this.setState({ isLoading: true });
        var info = this.props.route.params.userInfo;

        try {
            const postUserEntryOpts = { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( newEntry ),
            }
            var postUserEntryResult = await fetch(`${cors_uri}https://mood-tracker-server.herokuapp.com/Users/${info.username}/entries`, postUserEntryOpts);
            // var postUserEntryResult = await fetch('http://localhost:3000/Users/'+info.username +'/entries', postUserEntryOpts);

            if (postUserEntryResult.ok) {
                // console.log('fetch POST request successful. Printing response status...')
                // console.log('Status: ' + postUserEntryResult.status + ', ' + postUserEntryResult.statusText)
                this.props.navigation.navigate('Entrances', {newPost: true} )    

            } else {
                // console.log('fetch POST request failed. Throwing error status...')
                throw new Error('Status: ' + postUserEntryResult.status + ', ' + postUserEntryResult.statusText)
            }

        } catch (error) {
        //   alert('Erro no servidor, não foi possível adicionar a entrada. Por favor, tente novamente.')
        //   console.log('Erro capturado:')
        console.log(error);

        } finally {
        this.setState({ isLoading: false });
        }

    }
  
    render() {
        console.log('Rendering "Post Entry" screen...')

        return(
            <ImageBackground source={require('../assets/wallpaper.jpg')} style={styles2.mainView}>
                <ScrollView style={styles2.scrollView}>
                    <View style={styles2.section}>
                            {this.postEntryHeader()}
                            {this.InputCard('Mood', 'Avaliação', 'activity', {justifyContent: 'space-between'}, this.MoodButtons())}
                            {this.InputCard('Emotions', 'Emoções', 'color-palette', {flexWrap: 'wrap', justifyContent: 'space-evenly'}, this.EmotionButtons)}
                            {this.InputCard('Jornal', 'Jornal', 'book-open', {flexDirection: 'column'}, this.JornalInput())}
                    </View>
                </ScrollView>  

                <Pressable 
                onPress={this.onSaveButtonPress} 
                style={styles.saveButton}
                >
                    <Text style={{fontWeight:'bold', fontSize: 17}}>Salvar</Text>
                </Pressable>
    
            </ImageBackground>
        )    
    }
}