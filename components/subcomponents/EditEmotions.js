import React, { Component, useState } from 'react';
import { View, Text,  Pressable, TextInput, ActivityIndicator, Platform } from 'react-native';
import { Icon } from 'react-native-eva-icons'
import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../styles/postEntryStyles'

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const corsURI = Platform.OS == 'web' ? 'https://morning-journey-78874.herokuapp.com/' : ''
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

export default class EditEmotions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showEditMenu: false,
            showExpandMenuButton: true,
            mode: 'hidden',
            newEmotionName: '',
            selectedEmotionType: null,
            selectedEmotionEnergy: null,
            isLoading: false,
        }
        this.EditEmotionsButtons = this.EditEmotionsButtons.bind(this);
        this.EditEmotionsSection = this.EditEmotionsSection.bind(this);
        this.onSaveEmotionButtonPress = this.onSaveEmotionButtonPress.bind(this);
    }

    async onSaveEmotionButtonPress() {
        this.setState({ isLoading: true });
        var user = this.props.user;
        const newEmotion = {
            name: this.state.newEmotionName,
            type: this.state.selectedEmotionType,
            energy: this.state.selectedEmotionEnergy,
        }
        try {
            console.log('POST EMOTION STATUS: Started...')
            var postEmotionResult = {ok: false, status: '999', statusText: 'Post not fetched yet.'}
            const postUserEntryOpts = { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( newEmotion ),
            }
            // var postUserEntryResult = await fetch('http://localhost:3000/Users/' + info.username + '/emotions', postUserEntryOpts);
            postEmotionResult = await fetch( corsURI + appServerURI + 'Users/' + user.username + '/emotions', postUserEntryOpts);
            const postEmotionStatus = 'Status: ' + postEmotionResult.status + ', ' + postEmotionResult.statusText

            if (postEmotionResult.ok) {
                console.log('POST EMOTION STATUS: Successful.')
                console.log(postEmotionStatus)
                this.setState({
                    showEditMenu: true,
                    showExpandMenuButton: true,
                    mode: 'hidden',
                    newEmotionName: '',
                    selectedEmotionType: null,
                    selectedEmotionEnergy: null,        
                })
                    
            } else {
                console.log('POST EMOTION STATUS: Failed. Throwing error...')
                throw new Error(postEmotionStatus)
            }

        } catch (error) {
            this.props.setAlertMsg('Erro no servidor. Tente novamente...')
            console.log('Erro capturado:')
            console.log(error);

        } finally {
            console.log('POST EMOTION STATUS: Finished.')
            this.setState({ isLoading: false });
            if (postEmotionResult.ok) {
                await this.props.syncUserData();
                this.props.updateUserData();
            }
        }
 
    }

    onDeleteEmotionsButtonPress() {
        this.props.setDeleteMode()
    }

    EditEmotionsSection() {

        const emotionTypes = ['Positiva', 'Negativa']
        const emotionEnergy = ['Calmo(a)', 'Energizado(a)']

        const inputSectionStyle = {marginTop: 0, marginBottom: 0, alignItems: 'center'}
        const textStyle = {color: 'white', fontSize: 16, alignSelf: 'center', marginBottom: 8}
        const inputStyle = {width: '55%', height: 30, borderRadius: 16.5, color: 'white', backgroundColor: 'rgba(0,0,0,0.3)', fontSize: 15, textAlign: 'center' }
        const tagStyle = {width: '45%', height: 28, borderRadius: 13.5,  marginBottom: 7, color: 'white', alignItems: 'center', justifyContent: 'center'}
        const createEmotionViewStyle = {height: 420, marginTop: 25, paddingVertical: 0, justifyContent: 'space-evenly', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)'}

        switch (this.state.mode) {
            case 'hidden':
                return null
                // break;

            case 'create':

                return(
                    <View style={createEmotionViewStyle}>
                        <Text style={{color: 'white', fontSize: 22, alignSelf: 'center'}}>Criar emoção</Text>
                        <View style={inputSectionStyle}>
                            <Text style={textStyle}>Nome</Text>
                            <TextInput
                            placeholder='Nome da emoção...'
                            style={inputStyle}
                            onChangeText={text => this.setState({newEmotionName: text})}
                            value={this.state.newEmotionName}
                            />
                        </View>
                        <View style={inputSectionStyle}>
                            <Text style={textStyle}>Tipo</Text>
                            { emotionTypes.map((type) => {
                                const typeSelected = this.state.selectedEmotionType === type
                                return(
                                    <Pressable
                                    key={'emotion-'+type}
                                    onPress={() => this.setState({selectedEmotionType: typeSelected ? null : type })}
                                    style={[tagStyle, {backgroundColor: typeSelected ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)'}]}>
                                        <Text style={[{fontSize: 15, color: 'white'}]}>{type}</Text>
                                    </Pressable>
                                )
                            }) }
                        </View>
                        <View style={inputSectionStyle}>
                            <Text style={textStyle}>Energia</Text>
                            { emotionEnergy.map((type) => {
                                const typeSelected = this.state.selectedEmotionEnergy === type
                                return(
                                    <Pressable
                                    key={'emotion-'+type}
                                    onPress={() => this.setState({selectedEmotionEnergy: typeSelected ? null : type })}
                                    style={[tagStyle, {backgroundColor: typeSelected ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)'}]}>
                                        <Text style={[{fontSize: 15, color: 'white'}]}>{type}</Text>
                                    </Pressable>
                                )
                            }) }
                        </View>
                        <View style={[styles.cardRow, {justifyContent: 'space-evenly'}]}>
                            <Pressable onPress={this.onSaveEmotionButtonPress} style={[styles.editButton, {alignSelf: 'center'}]}>
                                <Text style={styles.editButtonLabel}>Salvar</Text>
                            </Pressable>
                            <Pressable onPress={() => this.setState({showEditMenu: true, showExpandMenuButton: true, mode: 'hidden'}) } style={[styles.editButton, {alignSelf: 'center', borderColor: 'white'}]}>
                                <Text style={[styles.editButtonLabel, {color: 'white'}]}>Cancelar</Text>
                            </Pressable>
                            </View>
                    </View>
                )
                break

            case 'delete':
                return(
                    <View style={[createEmotionViewStyle, {height: 150}]}>
                        <Text style={{color: 'white', fontSize: 22, alignSelf: 'center'}}>Excluir emoções</Text>
                        <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>Pressione e segure para excluir uma emoção.</Text>
                        <View style={[styles.cardRow, {justifyContent: 'space-evenly'}]}>
                            <Pressable
                            onPress={() => {this.props.setDeleteMode(); this.setState({showEditMenu: true, showExpandMenuButton: true, mode: 'hidden'})}}
                            style={[styles.editButton, {alignSelf: 'center', borderColor: 'white'}]}
                            >
                                <Text style={[styles.editButtonLabel, {color: 'white'}]}>Terminar</Text>
                            </Pressable>
                        </View>
                    </View>
                )
                break

            default:
                return null

        }

    }

    EditEmotionsButtons() {

        const buttonLabels = ['Criar', 'Excluir', 'Layout']
        const onButtonPress = { 
            'Criar': () => this.setState({showEditMenu: false, showExpandMenuButton: false, mode: 'create'}),
            'Excluir': () => {this.setState({showEditMenu: false , showExpandMenuButton: false, mode: 'delete'}); this.props.setDeleteMode()},
            'Layout': () => {}
        }
        const [isButtonPressed, setIsButtonPressed] = useState({
            'Criar': false,
            'Excluir': false,
            'Layout': false,
        })
        const showEditMenu =  this.state.showEditMenu
        const showExpandMenuButton = this.state.showExpandMenuButton
        const hidden = this.state.mode=='hidden'
        const anyOpen = showEditMenu || !hidden

        return(
            <>
                { this.state.showExpandMenuButton ? (
                    <View style={[styles.cardRow, {height: 50, marginTop: 25, paddingTop: 10, justifyContent: showEditMenu ? 'space-between' : 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)'}]}>
                        { showEditMenu ? ( 
                            buttonLabels.map((label) => (
                                <Pressable
                                key={`emotion-${label}`}
                                style={[styles.editButton,  {backgroundColor: isButtonPressed[label] ? '#fff2' : '#0000', width: 75}]}
                                disabled={ this.state.isLoading }
                                onPress={ onButtonPress[label] }
                                onPressIn={() => setIsButtonPressed({ ...isButtonPressed, [label]: !isButtonPressed[label] })}
                                onPressOut={() => setIsButtonPressed({ ...isButtonPressed, [label]: !isButtonPressed[label] })}
                                >
                                    <Text style={[styles.editButtonLabel, {color:  'white' }]}>{label}</Text>                    
                                </Pressable>
                            ))
                        ) : null }
                        <Pressable
                        onPress={() => this.setState({ showEditMenu:  !showEditMenu })}
                        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, width: 75}}>
                            <Icon name={ !showEditMenu ? 'more-horizontal-outline' : 'arrow-back-outline' } fill='white' width={20} height={20} />
                            <Text style={{color: 'white', fontSize: 16, marginLeft: 0}}> {anyOpen ? 'menos' : 'mais'}</Text>
                        </Pressable>
                    </View> 
                ) :  null  }
            </>

        )
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