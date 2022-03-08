import { StatusBar } from 'expo-status-bar';
var styles = {
    login: {
        mainView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // paddingHorizontal: Platform.OS != 'web' ? '5%' : '5%',
        },
        titleView: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 50,
            marginTop: 30,
        },
        title: {
            // width: 200,
            textAlign: 'center',
            fontSize: 30,
            fontWeight: 'bold',
            color: 'white',
            alignSelf: 'center',
        },
        titleIcon: {
            width: 30,
            height: 30,
            marginLeft: 6,
            paddingTop: 3,
        },
        card: {
            height: 440,
            minHeight: 430,
            width: 350,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderWidth: 4,
            borderRadius: 10,
            borderColor: 'rgba(0,0,0,0.1)',
            justifyContent: 'space-between',
            backgroundColor: 'azure',
        },
        cardHeader: {
            height: 90,
            width: '100%',
            justifyContent: 'center'
            // borderWidth: 1
        },
        cardTitle: {
            position: 'relative',
            left: 5,
            fontSize: 24,
            fontWeight: 'bold',
            color: 'black',
        },
        cardSection: {
            height: 85,
            justifyContent: 'space-between',
            alignItems: 'center',
            // borderWidth: 1
        },
        loadingIcon: {
            alignSelf: 'center'
        },
        inputField: {
            minHeight: 40,
            width: '100%',
            paddingLeft: 10,
            fontSize: 14,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: 'rgba(0,0,0,0.1)',
            backgroundColor: 'white'
        },
        button: {
            height: 40,
            width: '100%',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderRadius: 5,
            borderColor: 'rgba(0,0,0,0)',
            backgroundColor: 'lightblue',        
        },
        buttonLabel: {
            fontSize: 15,
            fontWeight: 'bold',
            color: 'black',
        },
        text: {
            fontSize: 15,
            textAlign: 'center',
        },
        msgBox: {
            width: 300,
            paddingVertical: 5,
            paddingHorizontal: 3,
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
    }
};
export default styles;