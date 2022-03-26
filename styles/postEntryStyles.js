import { Platform, StatusBar } from 'react-native';
import { relativeToScreen } from './loginStyles';

const styles = {
  login: {
    msgBox: {
      position: 'absolute',
      bottom: '10%',
      width: relativeToScreen(300),
      paddingHorizontal: 3,
      paddingVertical: 5,
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgb(30,30,30)',
      borderWidth: 1,
      borderColor: 'rgb(40,40,40)',
    },
    msg: {
        textAlign: 'center',
        color: 'white',
    },
  },
  mainView: {
    flex: 1,                 
    paddingTop: StatusBar.currentHeight,
    // paddingBottom: relativeToScreen(55),
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
    width: relativeToScreen(350),
    // width: 350,
    paddingVertical: '16%',
    borderBottomWidth: 1,
    borderColor: 'rgba(155,155,155,0.3)',
    alignSelf: 'center',
  },
  // contentRow: {
  //   flexDirection: 'column',
  //   padding: 10,
  //   marginTop: 22,
  //   borderWidth: 1,
  //   borderColor: 'rgba(155,155,155, 0.4)',
  //   borderRadius: 30,
  //   backgroundColor: 'rgba(255,255,255, 0.3)',

  // },
  entryTitle: {
    paddingVertical: relativeToScreen(3),
    paddingLeft: relativeToScreen(4),
    fontSize: relativeToScreen(19),
    color: '#fff',
  },
  entryIcon: {
    paddingRight: 0,
  },
  // postButtonView: {
  //   height: 60,
  //   width: 60,
  //   borderRadius: 30,
  //   alignSelf: 'center',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'white',
  // },
  // postButtonLabel: {
  //   fontSize: 45,
  //   fontWeight: 'bold',
  // },
  // moodButtonView: {
  //   width: 65,
  //   height: 65,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderWidth: 1,
  // },
  moodButton: {
    width: relativeToScreen(65),
    height: relativeToScreen(65),
    alignItems: 'center',
    justifyContent: 'center',
  },
  // date: {
  //   position: 'relative',
  //   left: '60%',
  //   paddingVertical: 8,
  //   paddingHorizontal: 10,
  //   fontSize: 15,
  //   alignSelf: 'center',
  //   backgroundColor: 'white',
  //   borderRadius: 20
  // },
  jornalText: {
    paddingVertical: 5,
    paddingHorizontal: relativeToScreen(12),
    flex: 1,
    textAlignVertical: 'top',
    width: '100%',
    borderRadius: relativeToScreen(20),
    color: 'white',
    fontSize: 16,
  },
  saveButton: {
    height: relativeToScreen(50),
    width: '100%',
    borderTopLeftRadius: relativeToScreen(25),
    borderTopRightRadius: relativeToScreen(25),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  saveButtonLabel: {
    fontWeight:'bold',
    fontSize: relativeToScreen(19)
  },
  card: {
    marginTop: '5%',
    paddingVertical: relativeToScreen(5),
    paddingHorizontal: relativeToScreen(10),
    borderRadius: relativeToScreen(20),
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  cardRow: {
      flexDirection: 'row',
      paddingVertical: relativeToScreen(5),
      alignItems: 'center',
  },
  // moodBadge: {
  //     backgroundColor: 'green',
  //     borderRadius: relativeToScreen(30),
  //     paddingVertical: relativeToScreen(6),
  //     width: relativeToScreen(130),
  //     fontSize: 16,
  //     textAlign: 'center',
  // },
  emotionBadge: {
      height: Platform.OS=='web' ? null : relativeToScreen(33),
      backgroundColor: 'rgba(1,1,1,0.5)',
      borderRadius: relativeToScreen(30),
      paddingVertical: Platform.OS=='web' ? 5 : null,
      paddingHorizontal: relativeToScreen(12.5),
      fontSize: relativeToScreen(15),
      textAlign: 'center',
      textAlignVertical: 'center',
      marginVertical: relativeToScreen(5),
      marginHorizontal: relativeToScreen(5)
  },
  entryCardEmotionBadge: {
    height: relativeToScreen(35),
    backgroundColor: 'aliceblue',
    borderRadius: relativeToScreen(32.5),
    // paddingVertical: 7,
    paddingHorizontal: relativeToScreen(12.5),
    marginRight: relativeToScreen(6),
    fontSize: relativeToScreen(15),
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  datetimeTitle: {
    fontSize: relativeToScreen(16),
    marginRight: relativeToScreen(3),
  },
  editButtonsView: {
    flexDirection: 'row',
    height: relativeToScreen(55),
    paddingVertical: relativeToScreen(5),
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
}

export default styles;