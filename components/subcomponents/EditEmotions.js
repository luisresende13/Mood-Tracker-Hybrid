import React, { Component, useState } from 'react';
import { View, Text,  Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-eva-icons'
import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../styles/postEntryStyles'


export default class EditEmotions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showMore: false,
            mode: 'hidden',
            newEmotionName: '',
            selectedEmotionType: null,
            isLoading: false,
        }
        this.EditEmotionsButtons = this.EditEmotionsButtons.bind(this);
        this.EditEmotionsSection = this.EditEmotionsSection.bind(this);
    }

    EditEmotionsSection() {

        switch (this.state.mode) {
            case 'hidden':
                return null
                // break;

            case 'create':

                const emotionTypes = ['Bem & Calmo', 'Bem & Energizado', 'Mal & Calmo', 'Mal & Energizado']
                const inputSectionStyle = {marginTop: 18, marginBottom: 0, alignItems: 'center'}
                const textStyle = {color: 'white', fontSize: 16, alignSelf: 'center', marginBottom: 12}
                const inputStyle = {width: '50%', height: 30, borderRadius: 16.5, backgroundColor: 'white', fontSize: 15 }
                const tagStyle = {width: '65%', height: 27, borderRadius: 13.5, backgroundColor: 'white',  marginBottom: 10, alignItems: 'center', justifyContent: 'center'}
                return(
                    <View style={{marginTop: 15, marginBottom: 10, paddingTop: 20, paddingBottom: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.2)'}}>
                        <Text style={{color: 'white', fontSize: 20, alignSelf: 'center'}}>Criar emoção</Text>
                        <View style={inputSectionStyle}>
                            <Text style={textStyle}>Nome</Text>
                            <TextInput style={inputStyle} onChangeText={text => this.setState({newEmotionName: text})}/>
                        </View>
                        <View style={inputSectionStyle}>
                            <Text style={textStyle}>Categoria</Text>
                            { emotionTypes.map((type) => {
                                const typeSelected = this.state.selectedEmotionType === type
                                return(
                                    <View style={[tagStyle, {backgroundColor: typeSelected===type ? 'black' : 'white'}]}>
                                        <Text onPress={() => this.setState({selectedEmotionType: typeSelected ? null : type })} style={[{fontSize: 15, color: typeSelected ? 'white' : 'black'}]}>{type}</Text>
                                    </View>
                                )
                            }) }
                        </View>
                        <View style={[styles.editButtonsView, {marginTop: 5, justifyContent: 'center'}]}>
                            <Pressable onPress={() => {}} style={styles.editButton}>
                                <Text style={styles.editButtonLabel}>Salvar</Text>
                            </Pressable>
                        </View>
                   </View>
                )
                // break

            case 'delete':
                return null
                // break

            default:
                return null

        }

    }

    EditEmotionsButtons() {

        const buttonLabels = ['Criar', 'Excluir']
        const onButtonPress = { 'Criar': () => this.setState({mode: this.state.mode=='create' ? null : 'create'}), 'Excluir': () => this.setState({mode: this.state.mode=='delete' ? null : 'delete'}) }
        const [isButtonPressed, setIsButtonPressed] = useState({
            'Criar': false,
            'Excluir': false,
        })
    
        if (this.state.showMore) {
            return(
                <View style={[styles.editButtonsView]}>
                    { buttonLabels.map( (label) => (
                        <Pressable
                        key={`emotion-${label}`}
                        style={[styles.editButton,  {backgroundColor: isButtonPressed[label] ?  '#fff2' : '#0000', borderColor:  'white' }]}
                        disabled={ this.state.isLoading }
                        onPress={ onButtonPress[label] }
                        onPressIn={() => setIsButtonPressed({ ...isButtonPressed, [label]: !isButtonPressed[label] })}
                        onPressOut={() => setIsButtonPressed({ ...isButtonPressed, [label]: !isButtonPressed[label] })}
                        >
                            <Text style={[styles.editButtonLabel, {color:  'white' }]}>{label}</Text>                    
                        </Pressable>
                    )) }
    
                    <Pressable onPress={() => this.setState({showMore: false, mode: 'hidden'})} style={[styles.editButton, {flexDirection: 'row', alignItems: 'center', borderWidth: 0}]}>
                        <Icon name='close-outline' fill='white' width={20} height={20} />
                        <Text style={{color: 'white', fontSize: 15, marginLeft: 5}}>Menos</Text>
                    </Pressable>
            </View>
            )
        } else {
            return(
                <View style={[styles.editButtonsView, {justifyContent: 'center'}]}>
                    <Pressable onPress={() => this.setState({showMore: true})} style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 10}}>
                        <Icon name='more-horizontal-outline' fill='white' width={20} height={20} />
                        <Text style={{color: 'white', fontSize: 15, marginLeft: 5}}>Mais</Text>
                    </Pressable>
                </View>
            )
        }
    }
        
    render() {
        
        return(
            <>
                <this.EditEmotionsSection />
                <this.EditEmotionsButtons />
            </>
        )
    }

}