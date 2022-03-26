import React, { Component, useState } from 'react';
import { View, Text,  Pressable, TextInput } from 'react-native';
import { Icon } from 'react-native-eva-icons'
import { relativeToScreen } from '../../styles/loginStyles';
import styles from '../../styles/postEntryStyles'
// import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const appServerURI = 'https://mood-tracker-server.herokuapp.com/'

export function capitalize(multipleWordString) {
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
            initialEmotionLayout: null,
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
        const textStyle = {color: styles.theme.color, fontSize: relativeToScreen(16), alignSelf: 'center', marginBottom: relativeToScreen(8)}
        const inputStyle = {width: '70%', height: relativeToScreen(35), borderRadius: relativeToScreen(15), color: styles.theme.color, backgroundColor: styles.altTheme.color+'8', fontSize: relativeToScreen(15), textAlign: 'center' }
        const tagStyle = {width: '45%', height: relativeToScreen(28), borderRadius: relativeToScreen(14),  marginBottom: relativeToScreen(7), color: 'white', alignItems: 'center', justifyContent: 'center'}
        const createEmotionViewStyle = {height: relativeToScreen(420), marginTop: relativeToScreen(10), paddingTop: relativeToScreen(10), justifyContent: 'space-evenly', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)'}

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
            this.props.appState.isUserDataSyncing |
            this.props.isUpdateUserDataLoading
        )

        const isNewEmotionFormComplete = !this.state.newEmotionName | !this.state.selectedEmotionType | !this.state.selectedEmotionEnergy
        const unselectedLayout = this.props.selectedEmotionLayout==this.state.initialEmotionLayout

        switch (this.state.mode) {

            case 'hidden':
                return null

            case 'create':
                return(
                    <View style={createEmotionViewStyle}>
                        <Text style={[ styles.theme, {fontSize: relativeToScreen(22), alignSelf: 'center'}]}>Criar emoção</Text>
                        <View style={inputSectionStyle}>
                            <Text style={textStyle}>Nome</Text>
                            <TextInput
                            placeholder='Nome da emoção...'
                            placeholderTextColor={styles.theme.color+'8'}
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
                                    style={[tagStyle, { backgroundColor: styles.altTheme.color + (typeSelected ? 'd' : '6') }]}>
                                        <Text style={[{fontSize: relativeToScreen(15)}, styles.theme]}>{type}</Text>
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
                                    style={[tagStyle, { backgroundColor: styles.altTheme.color + (typeSelected ? 'd' : '6') }]}>
                                        <Text style={[{fontSize: relativeToScreen(15)}, styles.theme]}>{type}</Text>
                                    </Pressable>
                                )
                            }) }
                        </View>
                        <View style={[inputSectionStyle, {flexDirection: 'row', justifyContent: 'space-evenly'}]}>
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
                                backgroundColor: isButtonPressed['Voltar'] ? styles.theme.color+'5' : '#0000',
                                borderColor: isLoading ? styles.theme.color+'5' : styles.theme.color,
                                }]}>
                                <Text style={[styles.editButtonLabel, {color: isLoading ? styles.theme.color+'5' : styles.theme.color}]}>Voltar</Text>
                            </Pressable>
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
                                backgroundColor: isButtonPressed['Salvar'] ? styles.theme.color+'5' : '#0000',
                                borderColor: isLoading | isNewEmotionFormComplete ? styles.theme.color+'5' : styles.theme.color,
                                }]}>
                                <Text style={[ styles.editButtonLabel, {
                                    color: isLoading | isNewEmotionFormComplete ? styles.theme.color+'5' : styles.theme.color
                                }]}
                                >
                                {'Salvar'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )

            case 'delete':
                return(
                    <View style={[createEmotionViewStyle, {height: relativeToScreen(180)}]}>
                        <Text style={{color: styles.theme.color, fontSize: relativeToScreen(22), alignSelf: 'center'}}>Excluir emoções</Text>
                        <Text style={{color: styles.theme.color, fontSize: relativeToScreen(16), textAlign: 'center'}}>Pressione e segure para excluir uma emoção.</Text>
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
                                borderColor: isLoading ? styles.theme.color+'5' : styles.theme.color,
                                backgroundColor: isButtonPressed['Terminar'] ? styles.theme.color+'5' : '#0000'
                            }]}
                            >
                                <Text style={[styles.editButtonLabel, {color: isLoading ? styles.theme.color+'5' : styles.theme.color}]}>Terminar</Text>
                            </Pressable>
                        </View>
                    </View>
                )

            case 'layout':
                return(
                    <View style={[createEmotionViewStyle, {height: relativeToScreen(320)}]}>
                        <View style={inputSectionStyle}>
                            <Text style={{color: styles.theme.color, fontSize: relativeToScreen(22), alignSelf: 'center', paddingBottom: relativeToScreen(25)}}>Escolha o layout</Text>
                            { ['Positiva ou Negativa', 'Calmo(a) ou Energizado(a)', 'Grade', 'Espalhado'].map((layout) => {
                                const isLayoutSelected = this.props.selectedEmotionLayout === emotionLayoutMap[layout]
                                return(
                                    <Pressable
                                    key={'emotion-'+layout}
                                    onPress={() => this.props.setParentState({selectedEmotionLayout: emotionLayoutMap[layout] })}
                                    style={[tagStyle, {width: relativeToScreen(230), height: relativeToScreen(30), borderRadius: relativeToScreen(15), marginBottom: relativeToScreen(10), backgroundColor: isLayoutSelected ? styles.altTheme.color+'d' : styles.altTheme.color+'5'}]}>
                                        <Text style={[{fontSize: 15, color: styles.theme.color}]}>{layout}</Text>
                                    </Pressable>
                                )
                            }) }
                        </View>
                        <View style={[inputSectionStyle, {flexDirection: 'row', justifyContent: 'space-evenly'}]}>
                            <Pressable
                            onPress={() => {
                                highlightButtonFor('Voltar-Layout')()
                                this.props.setParentState({selectedEmotionLayout: this.state.initialEmotionLayout})
                                this.setState({showEditMenu: true, showExpandMenuButton: true, mode: 'hidden', initialEmotionLayout: null})
                                setIsButtonPressed({'Voltar-Layout': false})
                            }}
                            onPressIn={highlightButtonFor('Voltar-Layout')}
                            disabled={isLoading}
                            style={[styles.editButton, {
                                alignSelf: 'center',
                                borderColor: isLoading ? styles.theme.color+'5' : styles.theme.color,
                                backgroundColor: isButtonPressed['Voltar-Layout'] ? styles.theme.color+'5' : '#0000'
                                }]}>
                                <Text style={[styles.editButtonLabel, {color: isLoading ? styles.theme.color+'5' : styles.theme.color}]}>Voltar</Text>
                            </Pressable>
                            <Pressable
                            onPress={() => {
                                highlightButtonFor('Salvar-Layout')()
                                this.onSaveEmotionLayoutButtonPress()
                                setIsButtonPressed({'Salvar-Layout': false})
                            }}
                            onPressIn={highlightButtonFor('Salvar-Layout')}
                            disabled={ isLoading || unselectedLayout }
                            style={[styles.editButton, {
                                alignSelf: 'center',
                                backgroundColor: isButtonPressed['Salvar-Layout'] ? styles.theme.color+'5' : '#0000',
                                borderColor: isLoading || unselectedLayout ? styles.theme.color+'5' : styles.theme.color,
                                }]}>
                                <Text style={[styles.editButtonLabel, {color: isLoading || unselectedLayout ? styles.theme.color+'5' : styles.theme.color}]}>Salvar</Text>
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
            'Layout': () => this.setState({showEditMenu: false, showExpandMenuButton: false, mode: 'layout', initialEmotionLayout: this.props.selectedEmotionLayout})
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
            this.props.appState.isUserDataSyncing |
            this.props.isUpdateUserDataLoading |
            this.props.isDeleteEmotionLoading |
            this.props.isSaveEmotionLoading
        )

        return(
            <>
                { showExpandMenuButton ? (
                    <View style={[styles.cardRow, {
                        height: relativeToScreen(60),
                        marginTop: relativeToScreen(10),
                        paddingTop: relativeToScreen(10),
                        justifyContent: showEditMenu ? 'space-between' : 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)'
                    }]}>
                        { showEditMenu ? ( 
                            buttonLabels.map((label) => (
                                <Pressable
                                key={`emotion-${label}`}
                                style={[styles.editButton,  {
                                    backgroundColor: isButtonPressed[label] ? styles.theme.color+'5' : '#0000',
                                    borderColor: isLoading ? styles.theme.color+'5' : styles.theme.color,
                                    width: relativeToScreen(75)
                                }]}
                                disabled={ isLoading }
                                onPress={() => {
                                    highlightButtonFor(label)(); onButtonPress[label]()
                                    setIsButtonPressed({ [label]: false })
                                } }
                                onPressIn={highlightButtonFor(label)}
                                >
                                    <Text style={[styles.editButtonLabel, {color: isLoading ? styles.theme.color+'5' : styles.theme.color}]}>{label}</Text>                    
                                </Pressable>
                            ))
                        ) : null }
                        <Pressable
                        onPress={() => this.setState({ showEditMenu:  !showEditMenu })}
                        // disabled={isLoading}
                        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: relativeToScreen(5), width: relativeToScreen(75)}}>
                            <Icon name={ !showEditMenu ? 'more-horizontal-outline' : 'arrow-back-outline' } fill={styles.theme.color} width={relativeToScreen(20)} height={relativeToScreen(20)} />
                            <Text style={{color: styles.theme.color, fontSize: relativeToScreen(15), marginLeft: 0}}> {anyOpen ? 'menos' : 'mais'}</Text>
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
            var user = this.props.appState.user;
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
            postEmotionResult = await fetch( appServerURI + 'Users/' + user.username + '/emotions', postUserEntryOpts);
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
                await this.props.appState.syncUserData();
                this.props.updateUserData();
            }
        } 
    }
    
    async onSaveEmotionLayoutButtonPress() {

        try {
            this.props.setParentState({ isSaveEmotionLayoutLoading: true });
            var user = this.props.appState.user;
            
            console.log('POST EMOTION LAYOUT STATUS: Started...')
            var postEmotionLayoutResult = {ok: false, status: '999', statusText: 'Post not fetched yet.'}
            const postEmotionLayoutOpts = { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( {layout: this.props.selectedEmotionLayout} ),
            }
            postEmotionLayoutResult = await fetch( appServerURI + 'Users/' + user.username + '/layout', postEmotionLayoutOpts);
            // var postUserEntryResult = await fetch('http://localhost:3000/Users/' + info.username + '/emotions', postEmotionLayoutOpts);
            const postEmotionLayoutStatus = 'Status: ' + postEmotionLayoutResult.status + ', ' + postEmotionLayoutResult.statusText

            if (postEmotionLayoutResult.ok) {
                console.log('POST EMOTION LAYOUT STATUS: Successful.')
                console.log(postEmotionLayoutStatus)
                this.setState({
                    showEditMenu: true,
                    showExpandMenuButton: true,
                    mode: 'hidden',
                    initialEmotionLayout: null,
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
                await this.props.appState.syncUserData();
                this.props.updateUserData();
            }
        } 
    }

    setFontColor() {
        const fontColorDark = this.props.appState.user.settings.fontColorDark
        const fontColor = fontColorDark ? '#000' : '#fff'
        const altFontColor = fontColorDark ? '#fff' : '#000'
        for (let style of ['theme', ]) {
            styles[style] = { ...styles[style], color: fontColor }
        }
        styles.altTheme.color = altFontColor
        // styles.altTheme.backgroundColor = altFontColor
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