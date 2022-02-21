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
            minHeight: 60,
        },
        title: {
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
            height: '55%',
            minHeight: 390,
            width: 350,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: 'azure',
        },
        cardHeader: {
            height: '25%',
            width: '100%',
        },
        cardTitle: {
            position: 'relative',
            top: '30%',
            left: '5%',
            fontSize: 24,
            fontWeight: 'bold',
            color: 'black',
        },
        cardSection: {
            height: '25%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
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
            borderColor: 'white',
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