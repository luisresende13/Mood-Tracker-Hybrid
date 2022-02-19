import { StatusBar } from 'expo-status-bar';
// import { Platform } from 'react-native';

const styles = {
  login: {
    msgBox: {
      position: 'absolute',
      bottom: '10%',
      width: 300,
      alignSelf: 'center',
      // width: 350,
      height: 36,
      justifyContent: 'center',
      backgroundColor: 'rgb(30,30,30)',
      borderWidth: 1,
      borderColor: 'rgb(40,40,40)',
    },
    msg: {
        textAlign: 'center',
        color: 'white',
        // paddingHorizontal: 15,
    },
  },
  mainView: {
    flex: 1,                 
    marginTop: StatusBar.currentHeight,
  },
  entrances: {
    marginTop: StatusBar.currentHeight,
    borderWidth: 0,
    flex:1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scrollView: {
    // paddingHorizontal: Platform.OS != 'web' ? '5%' : '5%',
    width: '100%',
    alignSelf: 'center',
  },
  content: {
    flexGrow: 1,
    paddingBottom: '0%',
    paddingHorizontal: '5%',
    alignSelf: 'stretch',
    borderColor: 'black',
  },
  section: {
    width: 350,
    paddingVertical: '16%',
    borderBottomWidth: 1,
    borderColor: 'rgba(155,155,155,0.3)',
    alignSelf: 'center',
  },
  contentRow: {
    flexDirection: 'column',
    padding: 10,
    marginTop: 22,
    borderWidth: 1,
    borderColor: 'rgba(155,155,155, 0.4)',
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255, 0.3)',

  },
  entryTitle: {
    paddingVertical: 3,
    paddingLeft: 4,
    fontSize: 19,
    color: 'white',
  },
  entryIcon: {
    paddingRight: 0,
  },
  postButtonView: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  postButtonLabel: {
    fontSize: 45,
    fontWeight: 'bold',
  },
  moodButtonView: {
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  moodButton: {
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    position: 'relative',
    left: '60%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20
  },
  jornalText: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    flex: 1,
    textAlignVertical: 'top',
    width: '100%',
    borderRadius: 20,
    color: 'white',
    fontSize: 16,
  },
  saveButton: {
    height: 50,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  saveButtonLabel: {
    fontWeight:'bold',
    fontSize: 19
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
      backgroundColor: 'green',
      borderRadius: 30,
      paddingVertical: 6,
      width: 130,
      fontSize: 16,
      textAlign: 'center',
  },
  emotionBadge: {
      backgroundColor: 'rgba(1,1,1,0.5)',
      borderRadius: 30,
      paddingVertical: 6,
      paddingHorizontal: 12.5,
      fontSize: 15,
      textAlign: 'center',
      marginVertical: 5,
      marginHorizontal: 5
  },
  entryCardEmotionBadge: {
    backgroundColor: 'aliceblue',
    borderRadius: 30,
    paddingVertical: 7,
    paddingHorizontal: 12.5,
    marginRight: 6,
    fontSize: 15,
    textAlign: 'center',
  },
  datetimeTitle: {
    fontSize: 16,
    marginRight: 3,
  },
  editButtonsView: {
    flexDirection: 'row',
    height: 55,
    paddingVertical: 5,
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
}

export default styles;