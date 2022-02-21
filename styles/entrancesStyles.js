import { StatusBar } from 'expo-status-bar';

//import StatusBar from 'react-native'
// import { Platform } from 'react-native';

// import { Dimensions } from 'react-native';
// var windowWidth = Dimensions.get('window').width;
// var windowHeight = Dimensions.get('window').height;

// import DeviceInfo from 'react-native-device-info';
// import AsyncStorage from '@react-native-community/async-storage';

// // how can i do some code that will gives me if its "Handset"=> Smartphone , 
// //if its "unknown"=> Laptop/Computer 
// //and it will be saved as well in my async-storage.

// //this some example that i wanna get it works well coz now its not work good

// const funct1=  (type) => {
// let type = DeviceInfo.getDeviceType();

// if type==='Handset'{
//   AsyncStorage.setItem('PLATFORM-TYPE', 'Smartphone');
// }
// if type==='unknown'{
//   AsyncStorage.setItem('PLATFORM-TYPE', 'Laptop/Computer');
// }
// };

const styles = {
    mainView: {
        flex: 1,                 
        // marginTop: StatusBar.currentHeight,
    },
    postButton: {
        position: 'absolute',
        height: 60,
        width: 60,
        borderRadius: 30,
        bottom: '2%',
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,1)',
        justifyContent: 'center',  
    },
    postButtonLabel: {
        alignSelf: 'center',
    },
    scrollView: {
        // paddingHorizontal: Platform.OS != 'web' ? '5%' : '5%',
        flex: 1,
    },
    section: {
        width: 350,
        paddingVertical: '16%',
        borderBottomWidth: 1,
        borderColor: 'rgba(155,155,155,0.3)',
        alignSelf: 'center',
    },
    sectionTitle: {
        paddingVertical: 7.5,
        fontSize: 18,
        color: 'white',
        fontWeight: '400',
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
        alignItems: 'center',
    },
    moodBadge: {
        // fontFamily: 'sans-serif',
        backgroundColor: 'green',
        borderRadius: 30,
        paddingVertical: 6,
        width: 130,
        fontSize: 15,
        textAlign: 'center',
    },
    emotionBadge: {
        // fontFamily: 'sans-serif',
        backgroundColor: 'aliceblue',
        borderRadius: 18,
        paddingVertical: 6,
        paddingHorizontal: 12.5,
        marginRight: 6,
        fontSize: 14,
        textAlign: 'center',
    },
    textBadge: {
        backgroundColor: 'aliceblue',
        borderRadius: 17,
        paddingTop: 5,
        paddingBottom: 8,
        paddingHorizontal: 11,
        width: '100%',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'left',
        textAlignVertical: 'top',
},
    text: {
        // fontFamily: 'sans-serif',
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
        paddingRight: 0,
        borderWidth: 1,
    },
    editButtonsView: {
        flexDirection: 'row',
        height: 50,
        paddingBottom: 5,
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    editButton: {
        height: 34,
        width: 102,
        borderWidth: 1,
        borderColor: 'aliceblue',
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center'
    },
    editButtonLabel: {
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
    },
    msgBox: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 110,
        width: 300,
        paddingVertical: 5,
        paddingHorizontal: 3,
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