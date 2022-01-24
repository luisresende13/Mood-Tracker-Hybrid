//import StatusBar from 'react-native'
import { StatusBar } from 'expo-status-bar';

const styles = {
    mainView: {
        flex: 1,                 
        marginTop: StatusBar.currentHeight,
    },
    absoluteView: {
        position: 'absolute',
        width: '100%', 
        height: '100%',
        flexDirection: 'column-reverse',
    },
    postButton: {
        // position: 'absolute',
        height: 65,
        width: 65,
        borderRadius: 32.5,
        top: '1%',
        alignSelf: 'center',
        backgroundColor: 'black',    
    },
      postButtonLabel: {
        lineHeight: 65,
        fontSize: 55,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    scrollView: {
        paddingHorizontal: '5%',
    },
    section: {
        paddingVertical: '16%',
        borderBottomWidth: 1,
        borderColor: 'rgba(155,155,155,0.3)',

    },
    sectionTitle: {
        paddingVertical: 7.5,
        fontSize: 17.5,
        // backgroundColor: 'blue',    
    },
    card: {
        marginTop: '5%',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
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
        backgroundColor: 'green',
        borderRadius: 30,
        paddingVertical: 6,
        width: 130,
        fontSize: 16,
        textAlign: 'center',
        // left: 5,
    },
    emotionBadge: {
        backgroundColor: 'rgba(1,1,1,0.5)',
        borderRadius: 30,
        paddingVertical: 7,
        paddingHorizontal: 12.5,
        marginRight: 6,
        // width: '100%', //must be removed, badge should have text width
        fontSize: 15,
        textAlign: 'center',
    },
    textBadge: {
        backgroundColor: 'rgba(1,1,1,0.5)',
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 10,
        width: '100%', //must be removed, badge should have text width
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'left',
    },
    text: {
        fontSize: 14
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
    
};

export default styles;