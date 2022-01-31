var styles = {
    login: {
      mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: Platform.OS != 'web' ? '5%' : '5%',
      },
      card: {
        height: '70%',
        width: 370,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'azure',
      },
      cardHeader: {
        height: '30%',
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
        paddingTop: 30,
        paddingBottom: 50,
        paddingLeft: 15,
      },
      cardSection: {
        height: '25%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      },
      inputField: {
        height: 40,
        width: '100%',
        paddingLeft: 10,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white'
      },
      button: {
        height: 40,
        width: '100%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'grey',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: 'dodgerblue',        
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
      loadingIcon: {
        alignSelf: 'center'
    },
    }
};
export default styles;