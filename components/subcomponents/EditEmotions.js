import React, { Component, useState } from 'react';
import { View, Text,  Pressable, TextInput, ActivityIndicator, Platform } from 'react-native';
import { Icon } from 'react-native-eva-icons'
import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../styles/postEntryStyles'

// cors-midpoint uri (needed to avoid cors' allow-cross-origin error when fetching in web platforms)
const corsURI = Platform.OS == 'web' ? 'https://morning-journey-78874.herokuapp.com/' : ''
const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

function capitalize(multipleWordString) {
    var words = multipleWordString.trim().split(' ');
    var CapitalizedWords = [];
    words.forEach(element => {
    CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
    });
    return CapitalizedWords.join(' ');
}

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
        }
        this.EditEmotionsMenu = this.EditEmotionsMenu.bind(this);
        this.EditEmotionsSection = this.EditEmotionsSection.bind(this);
        this.onSaveEmotionButtonPress = this.onSaveEmotionButtonPress.bind(this);
    }

    EditEmotionsSection() {

        const emotionTypes = ['Positiva', 'Negativa']
        const emotionEnergy = ['Calmo(a)', 'Energizado(a)']
        const emotionLayoutMap = {
            'Positiva ou Negativa': 'type',
            'Calmo(a) ou Energizado(a)': 'energy',
            'Grade': 'grid',
            'Espalhado': 'spread'
        }

        const inputSectionStyle = {marginTop: 0, marginTop: 0   , alignItems: 'center'}
        const textStyle = {color: 'white', fontSize: 16, alignSelf: 'center', marginBottom: 8}
        const inputStyle = {width: '70%', height: 35, borderRadius: 16.5, color: 'white', backgroundColor: 'rgba(0,0,0,0.7)', fontSize: 15, textAlign: 'center' }
        const tagStyle = {width: '45%', height: 28, borderRadius: 13.5,  marginBottom: 7, color: 'white', alignItems: 'center', justifyContent: 'center'}
        const createEmotionViewStyle = {height: 420, marginTop: 20, paddingTop: 10, justifyContent: 'space-evenly', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)'}

        const [isButtonPressed, setIsButtonPressed] = useState({
            'Salvar': false,
            'Voltar': false,
            'Terminar': false,
            'Salvar-Layout': false,
            'Voltar-Layout': false
        })
        function highlightButtonFor(label) {
            function highlightButton() {
                setIsButtonPressed({ ...isButtonPressed, [label]: !isButtonPressed[label] })
            }
            return highlightButton.bind(this);
        }

        const isLoading = (
            this.props.isDeleteEmotionLoading |
            this.props.isSaveEmotionLoading |
            this.props.isPostEntryLoading |
            this.props.isUserDataSyncing |
            this.props.isUpdateUserDataLoading
        )

        const isNewEmotionFormComplete = !this.state.newEmotionName | !this.state.selectedEmotionType | !this.state.selectedEmotionEnergy

        switch (this.state.mode) {

            case 'hidden':
                return null

            case 'create':
                return(
                    <View style={createEmotionViewStyle}>
                        <Text style={{color: 'white', fontSize: 22, alignSelf: 'center'}}>Criar emoção</Text>
                        <View style={inputSectionStyle}>
                            <Text style={textStyle}>Nome</Text>
                            <TextInput
                            placeholder='Nome da emoção...'
                            placeholderTextColor={'rgba(255,255,255,0.4)'}
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
                        <View style={[inputSectionStyle, {flexDirection: 'row', justifyContent: 'space-evenly'}]}>
                            <Pressable
                            onPress={() => {
                                highlightButtonFor('Salvar')()
                                this.onSaveEmotionButtonPress()
                                setIsButtonPressed({'Salvar': false})
                            }}
                            onPressIn={highlightButtonFor('Salvar')}
                            disabled={isLoading | isNewEmotionFormComplete}
                            style={[styles.editButton, {
                                alignSelf: 'center',
                                backgroundColor: isButtonPressed['Salvar'] ? '#fff5' : '#fff0',
                                borderColor: isLoading | isNewEmotionFormComplete ? '#fff5' : '#ffff',
                                }]}>
                                <Text style={[styles.editButtonLabel, {color: isLoading | isNewEmotionFormComplete ? '#fff5' : '#ffff'}]}>Salvar</Text>
                            </Pressable>
                            <Pressable
                            onPress={() => {
                                highlightButtonFor('Voltar')()
                                this.setState({showEditMenu: true, showExpandMenuButton: true, mode: 'hidden'})
                                setIsButtonPressed({'Voltar': false})
                            }}
                            onPressIn={highlightButtonFor('Voltar')}
                            disabled={isLoading}
                            style={[styles.editButton, {
                                alignSelf: 'center',
                                borderColor: isLoading ? '#fff5' : '#ffff',
                                backgroundColor: isButtonPressed['Voltar'] ? '#fff5' : '#fff0'
                                }]}>
                                <Text style={[styles.editButtonLabel, {color: isLoading ? '#fff5' : '#ffff'}]}>Voltar</Text>
                            </Pressable>
                        </View>
                    </View>
                )

            case 'delete':
                return(
                    <View style={[createEmotionViewStyle, {height: 180}]}>
                        <Text style={{color: 'white', fontSize: 22, alignSelf: 'center'}}>Excluir emoções</Text>
                        <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>Pressione e segure para excluir uma emoção.</Text>
                        <View style={[styles.cardRow, {justifyContent: 'space-evenly'}]}>
                            <Pressable
                            onPress={() => {
                                highlightButtonFor('Terminar')();
                                this.props.setParentState({deleteEmotionMode: false});
                                this.setState({showEditMenu: true, showExpandMenuButton: true, mode: 'hidden'});
                                setIsButtonPressed({'Terminar': false})
                            }}
                            onPressIn={highlightButtonFor('Terminar')}
                            disabled={isLoading}
                            style={[styles.editButton, {
                                alignSelf: 'center',
                                borderColor: isLoading ? '#fff5' : '#ffff',
                                backgroundColor: isButtonPressed['Terminar'] ? '#fff5' : '#fff0'
                            }]}
                            >
                                <Text style={[styles.editButtonLabel, {color: isLoading ? '#fff5' : '#ffff'}]}>Terminar</Text>
                            </Pressable>
                        </View>
                    </View>
                )

            case 'layout':
                return(

                    <View style={[createEmotionViewStyle, {height: 320}]}>
                        <View style={inputSectionStyle}>
                            <Text style={{color: 'white', fontSize: 22, alignSelf: 'center', paddingBottom: 25}}>Escolha o layout</Text>
                            { ['Positiva ou Negativa', 'Calmo(a) ou Energizado(a)', 'Grade', 'Espalhado'].map((layout) => {
                                const isLayoutSelected = this.props.selectedEmotionLayout === emotionLayoutMap[layout]
                                return(
                                    <Pressable
                                    key={'emotion-'+layout}
                                    onPress={() => this.props.setParentState({selectedEmotionLayout: emotionLayoutMap[layout] })}
                                    style={[tagStyle, {width: 230, height: 30, borderRadius: 15, marginBottom: 10, backgroundColor: isLayoutSelected ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)'}]}>
                                        <Text style={[{fontSize: 15, color: 'white'}]}>{layout}</Text>
                                    </Pressable>
                                )
                            }) }
                        </View>
                        <View style={[inputSectionStyle, {flexDirection: 'row', justifyContent: 'space-evenly'}]}>
                            <Pressable
                            onPress={() => {
                                highlightButtonFor('Salvar-Layout')()
                                this.onSaveEmotionLayoutButtonPress()
                                setIsButtonPressed({'Salvar-Layout': false})
                            }}
                            onPressIn={highlightButtonFor('Salvar-Layout')}
                            disabled={ isLoading }
                            style={[styles.editButton, {
                                alignSelf: 'center',
                                backgroundColor: isButtonPressed['Salvar-Layout'] ? '#fff5' : '#fff0',
                                borderColor: isLoading ? '#fff5' : '#ffff',
                                }]}>
                                <Text style={[styles.editButtonLabel, {color: isLoading ? '#fff5' : '#ffff'}]}>Salvar</Text>
                            </Pressable>
                            <Pressable
                            onPress={() => {
                                highlightButtonFor('Voltar-Layout')()
                                this.setState({showEditMenu: true, showExpandMenuButton: true, mode: 'hidden'})
                                setIsButtonPressed({'Voltar-Layout': false})
                            }}
                            onPressIn={highlightButtonFor('Voltar-Layout')}
                            disabled={isLoading}
                            style={[styles.editButton, {
                                alignSelf: 'center',
                                borderColor: isLoading ? '#fff5' : '#ffff',
                                backgroundColor: isButtonPressed['Voltar-Layout'] ? '#fff5' : '#fff0'
                                }]}>
                                <Text style={[styles.editButtonLabel, {color: isLoading ? '#fff5' : '#ffff'}]}>Voltar</Text>
                            </Pressable>
                        </View>
                    </View>
                )

            default:
                return null

        }

    }

    EditEmotionsMenu() {

        const buttonLabels = ['Criar', 'Excluir', 'Layout']
        const onButtonPress = { 
            'Criar': () => this.setState({showEditMenu: false, showExpandMenuButton: false, mode: 'create'}),
            'Excluir': () => {
                this.props.setParentState({deleteEmotionMode: !this.props.deleteEmotionMode})
                this.setState({showEditMenu: false , showExpandMenuButton: false, mode: 'delete'})
            },
            'Layout': () => this.setState({showEditMenu: false, showExpandMenuButton: false, mode: 'layout'})
        }
        const [isButtonPressed, setIsButtonPressed] = useState({
            'Criar': false,
            'Excluir': false,
            'Layout': false,
        })
        function highlightButtonFor(label) {
            function highlightButton() {
                setIsButtonPressed({ ...isButtonPressed, [label]: !isButtonPressed[label] })
            }
            return highlightButton.bind(this);
        }

        const showEditMenu =  this.state.showEditMenu
        const showExpandMenuButton = this.state.showExpandMenuButton
        const hidden = this.state.mode == 'hidden'
        const anyOpen = showEditMenu || !hidden

        const isLoading = (
            this.props.isPostEntryLoading |
            this.props.isUserDataSyncing |
            this.props.isUpdateUserDataLoading |
            this.props.isDeleteEmotionLoading |
            this.props.isSaveEmotionLoading
        )

        return(
            <>
                { showExpandMenuButton ? (
                    <View style={[styles.cardRow, {height: 50, marginTop: 25, paddingTop: 10, justifyContent: showEditMenu ? 'space-between' : 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)'}]}>
                        { showEditMenu ? ( 
                            buttonLabels.map((label) => (
                                <Pressable
                                key={`emotion-${label}`}
                                style={[styles.editButton,  {
                                    backgroundColor: isButtonPressed[label] ? '#fff5' : '#0000',
                                    borderColor: isLoading ? '#fff5' : '#ffff',
                                    width: 75
                                }]}
                                disabled={ isLoading }
                                onPress={() => {
                                    highlightButtonFor(label)(); onButtonPress[label]()
                                    setIsButtonPressed({ [label]: false })
                                } }
                                onPressIn={highlightButtonFor(label)}
                                >
                                    <Text style={[styles.editButtonLabel, {color: isLoading ? '#fff5' : '#ffff'}]}>{label}</Text>                    
                                </Pressable>
                            ))
                        ) : null }
                        <Pressable
                        onPress={() => this.setState({ showEditMenu:  !showEditMenu })}
                        // disabled={isLoading}
                        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, width: 75}}>
                            <Icon name={ !showEditMenu ? 'more-horizontal-outline' : 'arrow-back-outline' } fill='white' width={20} height={20} />
                            <Text style={{color: 'white', fontSize: 15, marginLeft: 0}}> {anyOpen ? 'menos' : 'mais'}</Text>
                        </Pressable>
                    </View> 
                ) :  null  }
            </>

        )
    }

    async onSaveEmotionButtonPress() {

        const newEmotionAlreadyExists = Object.keys(this.props.isSelectedEmotions).includes(capitalize(this.state.newEmotionName))
        if (newEmotionAlreadyExists) {
            this.props.setAlertMsg('Essa emoção já foi criada, escolha outro nome para continuar.')
            return
        }

        try {
            this.props.setParentState({ isSaveEmotionLoading: true });
            var user = this.props.route.params.user;
            const newEmotion = {
                name: capitalize(this.state.newEmotionName),
                type: this.state.selectedEmotionType,
                energy: this.state.selectedEmotionEnergy,
            }

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
            this.props.setParentState({ isSaveEmotionLoading: false });
            if (postEmotionResult.ok) {
                this.props.setParentState({ isUserDataSyncing: true });
                await this.props.route.params.syncUserData();
                this.props.setParentState({ isUserDataSyncing: false, isUpdateUserDataLoading: true });
                this.props.updateUserData();
                this.props.setParentState({ isUpdateUserDataLoading: false });
            }
        } 
    }
    
    async onSaveEmotionLayoutButtonPress() {

        try {
            this.props.setParentState({ isSaveEmotionLayoutLoading: true });
            var user = this.props.route.params.user;
            
            console.log('POST EMOTION LAYOUT STATUS: Started...')
            var postEmotionLayoutResult = {ok: false, status: '999', statusText: 'Post not fetched yet.'}
            const postEmotionLayoutOpts = { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( {layout: this.props.selectedEmotionLayout} ),
            }
            postEmotionLayoutResult = await fetch( corsURI + appServerURI + 'Users/' + user.username + '/layout', postEmotionLayoutOpts);
            // var postUserEntryResult = await fetch('http://localhost:3000/Users/' + info.username + '/emotions', postEmotionLayoutOpts);
            const postEmotionLayoutStatus = 'Status: ' + postEmotionLayoutResult.status + ', ' + postEmotionLayoutResult.statusText

            if (postEmotionLayoutResult.ok) {
                console.log('POST EMOTION LAYOUT STATUS: Successful.')
                console.log(postEmotionLayoutStatus)
                this.setState({
                    showEditMenu: true,
                    showExpandMenuButton: true,
                    mode: 'hidden',
                })
                    
            } else {
                console.log('POST EMOTION LAYOUT STATUS: Failed. Throwing error...')
                throw new Error(postEmotionLayoutStatus)
            }

        } catch (error) {
            this.props.setAlertMsg('Erro no servidor. Tente novamente...')
            console.log('Erro capturado:')
            console.log(error);

        } finally {
            console.log('POST EMOTION LAYOUT STATUS: Finished.')
            this.props.setParentState({ isSaveEmotionLayoutLoading: false });
            if (postEmotionLayoutResult.ok) {
                this.props.setParentState({ isUserDataSyncing: true });
                await this.props.route.params.syncUserData();
                this.props.setParentState({ isUserDataSyncing: false, isUpdateUserDataLoading: true });
                this.props.updateUserData();
                this.props.setParentState({ isUpdateUserDataLoading: false });
            }
        } 
    }


    render() {
        return(
            <>
                <this.EditEmotionsSection />
                <this.EditEmotionsMenu />
            </>
        )
    }

}