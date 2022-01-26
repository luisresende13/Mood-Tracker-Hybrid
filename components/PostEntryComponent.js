import React, {useState, Component} from 'react';
import { View, Text, ImageBackground, Pressable, ScrollView } from 'react-native';
import { TextInput} from 'react-native-gesture-handler';
import { Icon } from 'react-native-eva-icons'

import styles from '../styles/postEntryStyles'
import styles2 from '../styles/entrancesStyles'

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

const basicEmotions = ['Felicidade', 'Tristeza', 'Cansaço', 'Ansiedade', 'Drepressão','Desespero', 'Euforia', 'Concentração', 'Equilíbrio', 'Amor', 'Medo', 'Vergonha', 'Nojo']
var isSelectedEmotions = {}
for (var i=0; i<basicEmotions.length; i++){
isSelectedEmotions[basicEmotions[i]] = false
}
// Array(basicEmotions.length).fill(false)


export default class PostEntranceScreen extends Component {
  
    constructor(props) {
        super(props);

        this.state = {
            moodButtons: {
            colors: ['darkred', 'lightblue', 'darkgrey', 'pink', 'lightgreen'],
            colorsSelected: ['red', 'blue', 'grey', 'purple', 'green'],
            moods: ['Horrivel', 'Mau', 'Regular', 'Bem', 'Ótimo'],  
            },
            emotionButtons: {
                isSelectedEmotions: isSelectedEmotions,
                basicEmotions: basicEmotions,  
            },
            star: false,
            selectedMood: null,
            diaryEntry: '',    
            emotions: [],
            address: 'Missing',
        };

        this.onSaveButtonPress = this.onSaveButtonPress.bind(this);
        this.EmotionsCard = this.EmotionsCard.bind(this);
        this.EmotionButtons = this.EmotionButtons.bind(this);
        this.MoodButtons = this.MoodButtons.bind(this);
        this.MoodCard = this.MoodCard.bind(this);
        this.JornalCard = this.JornalCard.bind(this);
        this.postEntryHeader = this.postEntryHeader.bind(this);
        this.onEmotionButtonPress = this.onEmotionButtonPress.bind(this);
        this.onMoodButtonPress = this.onMoodButtonPress.bind(this);
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

    EmotionButtons() {
        return(
            this.state.emotionButtons.basicEmotions.map( emotion => (
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

    MoodCard() {
        return(
            <View style={[styles2.card]}>
                <View style={styles2.cardRow}>
                    <Icon name='activity' fill='rgba(255,255,255,0.75)' height={25} width={25} style={styles2.entryIcon}/>
                    <Text style={styles.entryTitle}>Avaliação </Text>
                </View>
                <View style={[styles2.cardRow, {justifyContent: 'space-between'}]}>
                    {this.MoodButtons()}
                </View>
            </View>
        )
    }

    EmotionsCard() {
        return (
            <View style={styles2.card}>
                <View style={styles2.cardRow}>
                    <Icon name='color-palette' fill='rgba(255,255,255,0.75)' height={25} width={25} style={styles2.entryIcon}/>
                    <Text style={[styles.entryTitle]}>Emoções</Text>
                </View>
                <View style={[styles2.cardRow, {flexWrap: 'wrap', justifyContent: 'space-evenly'}]}>
                    {this.EmotionButtons()}
                </View>
            </View>
        );
    }

    JornalCard() {
        return(
            <View style={[styles2.card]}>
                <View style={styles2.cardRow}>
                    <Icon name='book-open' fill='rgba(255,255,255,0.75)' height={25} width={25} style={styles2.entryIcon}/>
                    <Text style={styles.entryTitle}>Jornal</Text>
                </View>
                <View style={[styles2.cardRow, {flexDirection: 'column'}]}>
                    <TextInput multiline 
                    placeholder='Today was...' 
                    style={styles.diaryText}
                    onChangeText={text => this.setState({diaryEntry: text})}
                    value={this.state.diaryEntry}
                    >
                    </TextInput>
                </View>
            </View>
        )
    }

    onSaveButtonPress () {
        const datetime = new Date().toString().split(' ')
        const newDate = datetime.slice(1,4).join('-')
        var newTime = datetime[4].slice(0,5)
        var h = parseInt(newTime.slice(0,2))
        var m = parseInt(newTime.slice(3,5))
        newTime = h > 12 ? ( (h-12).toString().length==1 ? '0'+(h-12) : h-12 ) + ':' +  m + ' PM' : ( h.toString().length==1 ? '0'+ h : h ) + ' AM'

        const newPost = {
            diary: this.state.diaryEntry,
            mood: this.state.selectedMood,
            emotions: this.state.emotionButtons.basicEmotions.filter( emotion => this.state.emotionButtons.isSelectedEmotions[emotion] ) ,
            address: this.state.address,
            user_id: this.props.route.params.newId,
            _id: this.props.route.params.newId,
            date: newDate,
            time: newTime,
            star: this.state.star,
        }
        this.props.navigation.navigate('Entrances', {newPost: newPost} )
    }


    render() {

        return(
            <ImageBackground source={require('../assets/wallpaper.jpg')} style={{width: '100%', height: '100%'}}>
                <ScrollView style={styles2.scrollView}>
                    <View style={styles2.section}>
                            {this.postEntryHeader()}
                            {this.MoodCard()}            
                            {this.EmotionsCard()}
                            {this.JornalCard()}
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
