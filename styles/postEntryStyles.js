import { StatusBar } from 'expo-status-bar';
// import { Platform } from 'react-native';

const styles = {
  
  entrances: {
    marginTop: StatusBar.currentHeight,
    borderWidth: 0,
    flex:1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  content: {
    flexGrow: 1,
    paddingBottom: '0%',
    paddingHorizontal: '5%',
    alignSelf: 'stretch',
    borderColor: 'black',
  },
  section: {
    paddingVertical: '10%',
    paddingHorizontal: '10%',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderBottomWidth: 1,
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
    paddingBottom: 3,
    paddingLeft: 5,
    fontSize: 19,
    color: 'white'
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
  postButton: {
  },
  postButtonLabel: {
    fontSize: 45,
    fontWeight: 'bold',
  },
  moodButtonView: {
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center'
  },
  moodButton: {
      borderRadius: 30,
      justifyContent: 'center',
      marginColor: 'black',
      marginWidth: 2,
  },
  moodButtonBorder: {

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
    paddingHorizontal: 10,
    minHeight:170,
    width: '100%',
    borderRadius: 20,
    color: 'white',
    fontSize: 14,
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
    paddingVertical: 7,
    paddingHorizontal: 12.5,
    marginRight: 6,
    fontSize: 15,
    textAlign: 'center',
},

}

export default styles;