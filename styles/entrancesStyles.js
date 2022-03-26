// import { StatusBar } from 'expo-status-bar';
import { Platform, StatusBar } from 'react-native';
import { relativeToScreen } from './loginStyles';

var styles = {
    mainView: {
        flex: 1,                 
        paddingTop: StatusBar.currentHeight,
        paddingBottom: relativeToScreen(55)
    },
    scrollView: {
        flex: 1,
    },
    header: {
        height: relativeToScreen(120),
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigationRow: {
        height: relativeToScreen(60),
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    section: {
        width: relativeToScreen(350),
        paddingBottom: '16%',
        borderBottomWidth: 1,
        borderColor: '#fff3',
        alignSelf: 'center',
    },
    sectionHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        height: relativeToScreen(100)
    },
    sectionTitle: {
        fontSize: relativeToScreen(25),
        color: 'white',
        // fontWeight: '400',   
    },
    card: {
        marginBottom: '5%',
        paddingVertical: relativeToScreen(5),
        paddingHorizontal: relativeToScreen(10),
        borderRadius: relativeToScreen(20),
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    cardRow: {
        flexDirection: 'row',
        paddingVertical: relativeToScreen(5),
        alignItems: 'center',
    },
    postButton: {
        position: 'absolute',
        height: relativeToScreen(59),
        width: relativeToScreen(59),
        borderRadius: relativeToScreen(30),
        bottom: relativeToScreen(25 + 55),
        // bottom: '2%',
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,1)',
        justifyContent: 'center',
    },
    postButtonLabel: {
        alignSelf: 'center',
    },
    moodBadge: {
        height: Platform.OS=='web' ? null : relativeToScreen(30),
        paddingVertical: Platform.OS=='web' ? 5 : null,
        borderRadius: relativeToScreen(30),
        width: relativeToScreen(130),
        fontSize: relativeToScreen(15),
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    moodHeaderItem: {
        height: relativeToScreen(30),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    emotionBadge: {
        // fontFamily: 'sans-serif',
        height: Platform.OS=='web' ? null : relativeToScreen(29),
        backgroundColor: '#f4f3f4',
        borderRadius: relativeToScreen(14.5),
        paddingVertical: Platform.OS=='web' ? 5 : null,
        paddingHorizontal: relativeToScreen(12.5),
        marginRight: relativeToScreen(6),
        fontSize: relativeToScreen(14),
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    textBadge: {
        backgroundColor: 'aliceblue',
        borderRadius: relativeToScreen(17),
        paddingTop: relativeToScreen(5),
        paddingBottom: relativeToScreen(8),
        paddingHorizontal: relativeToScreen(11),
        width: '100%',
        fontSize: relativeToScreen(15),
        lineHeight: relativeToScreen(22),
        textAlign: 'left',
        textAlignVertical: 'top',
},
    text: {
        // fontFamily: 'sans-serif',
        fontSize: relativeToScreen(14),
        color: 'white'
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
    icon: {
        paddingHorizontal: relativeToScreen(12),
    },
    entryIcon: {
        paddingRight: 0,
        borderWidth: 1,
    },
    editButtonsView: {
        flexDirection: 'row',
        height: relativeToScreen(50),
        paddingBottom: relativeToScreen(5),
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    editButton: {
        height: relativeToScreen(34),
        width: relativeToScreen(102),
        borderWidth: 1,
        borderColor: 'aliceblue',
        borderRadius: relativeToScreen(17),
        alignItems: 'center',
        justifyContent: 'center'
    },
    editButtonLabel: {
        fontSize: relativeToScreen(15),
        fontWeight: '400',
        color: 'white',
    },
    msgBox: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: relativeToScreen(110),
        width: relativeToScreen(300),
        paddingVertical: relativeToScreen(10),
        paddingHorizontal: relativeToScreen(10),
        // height: 36,
        justifyContent: 'center',
        backgroundColor: 'rgb(30,30,30)',
        borderWidth: 1,
        borderColor: 'rgb(40,40,40)',
    },
    msg: {
        textAlign: 'center',
        color: 'white',
        // paddingHorizontal: 20,
    },
};

export default styles;