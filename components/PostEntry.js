import React, {useState, Component} from 'react';
import { View, Text, ImageBackground, Pressable, ScrollView } from 'react-native';
import { TextInput} from 'react-native-gesture-handler';

import styles from '../styles/postEntryStyles'

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
const datetime = now[2] + ' ' + now[1] + ' ' + now[3] + ' - ' + now[4].slice(0,5)

// export default class PostEntranceScreen extends Component {
  
//     render() {
//         return(
//             <View> 
//                 <Text>{now}</Text>
//             </View>
//         )
//     }
// }

const basicEmotions = ['Felicidade', 'Tristeza', 'Cansaço', 'Ansiedade', 'Drepressão', 'Desespero', 'Euforia', 'Concentração', 'Equilíbrio', 'Amor', 'Medo', 'Vergonha', 'Nojo']
var isSelectedEmotions = {}
for (var i=0; i<basicEmotions.length; i++){
isSelectedEmotions[basicEmotions[i]] = false
}

export default class PostEntranceScreen extends Component {
  
  constructor(props) {
      super(props);

      this.state = {
        moodButtons: {
          colors: ['darkred', 'lightblue', 'darkgrey', 'pink', 'lightgreen'],
          colorsSelected: ['red', 'blue', 'grey', 'purple', 'green'],
          moods: ['Horrivel', 'Mau', 'Regular', 'Bom', 'Ótimo'],  
        },
        emotionButtons: {
            isSelectedEmotions: isSelectedEmotions,
            basicEmotions: basicEmotions,  
        },
        selectedMood: null,
        diaryEntry: '',    
        emotions: [],
        address: 'Missing',
    };

    this.onSaveButtonPress = this.onSaveButtonPress.bind(this);
    this.EmotionsCard = this.EmotionsCard.bind(this);
  }

  onSaveButtonPress () {
    const datetime = new Date().toString().split(' ')
    const newDate = datetime.slice(1,4).join('-')
    const newTime = datetime[4].slice(0,5)
    const newPost = {
        diary: this.state.diaryEntry,
        mood: this.state.selectedMood,
        emotions: this.state.emotionButtons.basicEmotions.filter( emotion => this.state.emotionButtons.isSelectedEmotions[emotion] ) ,
        address: this.state.address,
        user_id: this.props.route.params.newId,
        _id: this.props.route.params.newId,
        date: newDate,
        time: newTime,
    }
    this.props.navigation.navigate('Entrances', {newPost: newPost} )
}

EmotionsCard() {
    return (
        <View style={styles.card}>
            <View style={[styles.cardRow, {flexDirection: 'column', alignItems: 'center'}]}>
                <Text style={[styles.rowTitle]}>Emoções</Text>
            </View>
            <View style={[styles.cardRow, {flexWrap: 'wrap', justifyContent: 'space-evenly'}]}>
                {
                    this.state.emotionButtons.basicEmotions.map( emotion => (
                        <Pressable
                        title={emotion}
                        onPress={() => {
                                this.setState({emotionButtons: {...this.state.emotionButtons, isSelectedEmotions: {...this.state.emotionButtons.isSelectedEmotions, [emotion]: !this.state.emotionButtons.isSelectedEmotions[emotion]}}})
                        }}
                        style={[{
                            paddingTop: 10,
                        }
                        ]}
                        >
                            <Text style={[styles.emotionBadge, {backgroundColor: this.state.emotionButtons.isSelectedEmotions[emotion] ? 'steelblue' : 'white' }]}>{emotion}</Text>
                        </Pressable>

                    ))
                }
            </View>
        </View>
    );
}



  render() {

    // alert('this.props.route.params: '+Boolean(this.props.route.params))

    return(
        <ImageBackground source={require('../assets/wallpaper.jpg')} style={{width: '100%', height: '100%'}}>
            <ScrollView>
                <View style={styles.entrances}>
                    <View style={styles.content}>
            
                        <View style={{paddingTop: '10%', flexDirection: 'row', width: '100%', backgroundColor: 'rgba(0,0,0,0)'}}>
                            <View style={[styles.postButtonView]} >
                                <Pressable onPress={() => {this.props.navigation.goBack()}}  style={styles.postButton}>
                                <Text style={styles.postButtonLabel}>{'<'}</Text>
                                </Pressable>
                            </View>
                            <Text style={styles.date}> {datetime} </Text>
                        </View>
            
                        <View style={[styles.contentRow]}>
                            <Text style={styles.rowTitle}>Avaliação </Text>
                            <View style={{paddingHorizontal: 0, minHeight: 90,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                {   
                                    this.state.moodButtons.moods.map((item, index) => (
                                        <View key={'mood '+index} style={{width: 65, height: 65, alignItems: 'center', justifyContent: 'center'}} >
                                            <Pressable
                                            title={item}
                                            onPress={() => {
                                                if (this.state.selectedMood==item) {
                                                    this.setState({selectedMood: null})
                                                } else {
                                                    this.setState({selectedMood: item})
                                                }
                                            }}
                                            style={[
                                                styles.moodButton,
                                                this.state.selectedMood==item ? {
                                                    height: 65,
                                                    width: 65,
                                                    fontWeight: 'bold',
                                                    backgroundColor: this.state.moodButtons.colorsSelected[index],
                                                    borderWidth: 2,
                                                    borderColor: this.state.moodButtons.colors[index],
                                                } : {
                                                    height: 55,
                                                    width: 55,
                                                    fontWeight: null,
                                                    backgroundColor: this.state.moodButtons.colors[index]
                                                }
                                            ]}
                                            >
                                                <Text style={{textAlign: 'center', textAlignVertical: 'center'}}>{item}</Text>
                                            </Pressable>
                                        </View>
                                    ))                    
                                }

                            </View>
                        </View>

                        {this.EmotionsCard()}

                        <View style={[styles.contentRow]}>
                            <Text style={styles.rowTitle}>Diário</Text>
                            <View style={styles.diaryText}>
                                <TextInput multiline 
                                placeholder='Today was...' 
                                style={{padding: 0, backgroundColor: 'rgba(255,255,255,0)'}}
                                onChangeText={text => this.setState({diaryEntry: text})}
                                value={this.state.diaryEntry}
                                >
                                </TextInput>
                            </View>
                        </View>

                    </View>                    
                </View>

                <View style={{height: 75}}></View>
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
