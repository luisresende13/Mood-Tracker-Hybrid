
import React, { Component } from 'react';
import { View, Text, ImageBackground, Button, Pressable, ScrollView} from 'react-native';

import DATA from '../shared/DatabaseReduced'
const data = DATA['7007']

import styles from '../styles/entrancesStyles'

function LoadAddress ({entry}) {
    if (entry.address!='Missing') {
        return <Text style={styles.text}>{entry.address}</Text>
    } else {
        return <></>
    }
}
function LoadEmotions ({entry}) {
    if (entry.emotions.length>0) {
        return (
            <View style={styles.cardRow}>
                {
                    entry.emotions.map((emotion, index) => {
                        return(
                            <Text key={index} style={styles.emotionBadge}>{emotion}</Text>
                        )
                    })
                }
            </View>        
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
                <Text style={styles.text}>{entry.time}</Text>
            </View>

            <LoadEmotions entry={entry} />
            <LoadAddress entry={entry} />

            <View style={styles.cardRow}>
                <Text style={styles.textBadge}>{entry.diary}</Text>
            </View>
        
        </View>
    );
}

const now = new Date().toString().split(' ')
const date = now[2]+'th ' + now[1]

export default class EntrancesScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            data: data,
            date: date,

        };
        this.postIfNewEntry = this.postIfNewEntry.bind(this);
        this.newEntryId = this.newEntryId.bind(this);
    }

    postIfNewEntry() {
        if (this.props.route.params) {
            if (this.props.route.params.newPost) {

                this.setState({
                    data: [this.props.route.params.newPost, ...this.state.data],
                });
                this.props.navigation.setParams({newPost: null});
            }
        }
    }

    newEntryId() {
        var ids = Array(this.state.data.length)
        for (var i=0; i<this.state.data.length; i++) {
            ids[i] = parseInt(this.state.data[i]._id)
        };
        const newId = Math.max(...ids) + 1
        return newId
    }   

    render() {

        this.postIfNewEntry();

        return(

            <ImageBackground source={require('../assets/wallpaper.jpg')} style={[styles.mainView]}>

                <ScrollView style={styles.scrollView}>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{'Suas entradas  •  Hoje, ' + this.state.date}</Text>
                        {this.state.data.map(entry => <EntryCard entry={entry} />)}
                    </View>
                    
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Gratidão</Text>
                        {this.state.data.map(entry => <EntryCard key={entry._id} entry={entry} />)}
                    </View>

                </ScrollView>

                <View style={styles.absoluteView}>
                    <Pressable onPress={() => {this.props.navigation.navigate('PostEntrance', {newId: this.newEntryId()})}}  style={[styles.postButton]}>
                            <Text style={styles.postButtonLabel}>+</Text>
                    </Pressable>
                </View>
  
            </ImageBackground>
            )
      
    }
  }
