//import StatusBar from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

const styles = {
    mainView: {
        flex: 1,                 
        marginTop: StatusBar.currentHeight,
    },
    postButton: {
        position: 'absolute',
        height: 60,
        width: 60,
        borderRadius: 30,
        bottom: '0%',
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,1)',
        justifyContent: 'center',  
    },
    postButtonLabel: {
        alignSelf: 'center',
    },
    scrollView: {
        paddingHorizontal: Platform.OS != 'web' ? '5%' : '25%',
        width: '100%',
        alignSelf: 'center'
    },
    section: {
        paddingVertical: '16%',
        borderBottomWidth: 1,
        borderColor: 'rgba(155,155,155,0.3)',

    },
    sectionTitle: {
        paddingVertical: 7.5,
        fontSize: 18,
        color: 'white',
        fontWeight: '400',
        // backgroundColor: 'blue',    
    },
    card: {
        marginTop: '5%',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    cardRow: {
        flexDirection: 'row',
        paddingVertical: 5,
        // justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'blue',  
        // borderWidth: 2,  
    },
    moodBadge: {
        fontFamily: 'sans-serif',
        backgroundColor: 'green',
        borderRadius: 30,
        paddingVertical: 6,
        width: 130,
        fontSize: 16,
        textAlign: 'center',
        // left: 5,
    },
    emotionBadge: {
        fontFamily: 'sans-serif',
        backgroundColor: 'aliceblue',
        borderRadius: 30,
        paddingVertical: 7,
        paddingHorizontal: 12.5,
        marginRight: 6,
        // width: '100%', //must be removed, badge should have text width
        fontSize: 15,
        textAlign: 'center',
    },
    textBadge: {
        fontFamily: 'sans-serif',
        backgroundColor: 'aliceblue',
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 10,
        width: '100%', //must be removed, badge should have text width
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'left',
    },
    text: {
        fontFamily: 'sans-serif',
        fontSize: 14,
        color: 'white'
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
    icon: {
        paddingHorizontal: 12,
        },
    entryIcon: {
        paddingRight: 30,
        },
    
};

export default styles;