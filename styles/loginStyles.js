import { Platform, Dimensions, StatusBar } from 'react-native';
import * as Device from 'expo-device';

const isWindowsBroswer = Platform.OS=='web' & (Device.osName!='iOS' & Device.osName!='Android')
const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height

export function relativeToScreen(size, axis='width') {
    if (typeof(size)=='string') {
        return parseInt(size.slice(0, size.length-1)) / 100 * ( axis=='width' ? screenWidth : screenHeight )
    } else {
        return isWindowsBroswer ? size : size * ( axis=='width' ? screenWidth/392.72 : screenHeight/850.9 )
    }
}

var styles = {
    login: {
        mainView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // paddingHorizontal: Platform.OS != 'web' ? '5%' : '5%',
            paddingTop: StatusBar.currentHeight,
        },
        titleView: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: relativeToScreen(50, 'height'),
        },
        title: {
            // width: '70%',
            textAlign: 'center',
            fontSize: relativeToScreen(30),
            fontWeight: 'bold',
            color: 'white',
            alignSelf: 'center',
        },
        titleIcon: {
            width: relativeToScreen(30),
            height: relativeToScreen(30),
            marginLeft: relativeToScreen(6),
            paddingTop: relativeToScreen(3),
        },
        card: {
            height: relativeToScreen(440),
            minHeight: relativeToScreen(430),
            width: relativeToScreen(350),
            paddingHorizontal: relativeToScreen(10),
            paddingVertical: relativeToScreen(10),
            borderWidth: relativeToScreen(4),
            borderRadius: relativeToScreen(10),
            borderColor: 'rgba(0,0,0,0.1)',
            justifyContent: 'space-between',
            backgroundColor: 'azure',
        },
        cardHeader: {
            height: '21.42%',
            width: '100%',
            justifyContent: 'center'
            // borderWidth: 1
        },
        cardTitle: {
            position: 'relative',
            left: relativeToScreen(5),
            fontSize: relativeToScreen(24),
            fontWeight: 'bold',
            color: 'black',
        },
        cardSection: {
            height: '20.5%',
            justifyContent: 'space-between',
            alignItems: 'center',
            // borderWidth: 1
        },
        loadingIcon: {
            alignSelf: 'center'
        },
        inputField: {
            // minHeight: 40,
            height: '47%',
            width: '100%',
            paddingLeft: relativeToScreen(10),
            fontSize: relativeToScreen(14),
            borderWidth: 1,
            borderRadius: relativeToScreen(5),
            borderColor: 'rgba(0,0,0,0.1)',
            backgroundColor: 'white'
        },
        button: {
            height: '29%',
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
            fontSize: relativeToScreen(15),
            fontWeight: 'bold',
            color: 'black',
        },
        text: {
            fontSize: relativeToScreen(15),
            textAlign: 'center',
        },
        msgBox: {
            width: relativeToScreen(300),
            paddingVertical: relativeToScreen(5),
            paddingHorizontal: relativeToScreen(3),
            marginBottom: relativeToScreen(3),
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