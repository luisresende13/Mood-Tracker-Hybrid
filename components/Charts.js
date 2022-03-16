import React, { Component, useState } from 'react';
import { ImageBackground, View, Text, Pressable, ScrollView, ActivityIndicator, Switch, StatusBar, Platform } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import "react-native";
import Victory from './victory'
import { blinkButton } from './SettingsScreen';
import { Today } from './EntrancesComponent';
import { moodColorsHEX, moodIcons } from './PostEntryComponent';
var moodColorsObj = {}
moodColorsHEX.forEach((color, index) => {
  moodColorsObj[index+1] = color
})
const moods = [1,2,3,4,5]

var styles = {
  background: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foreground: {
    width: 350,
    paddingBottom: 60
  },
  header: {
    height: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: '5%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
  },
  statsRowItem: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  h1: {
    fontSize: 25,
    color: 'white'
  },
  h2: {
    fontSize: 20,
    color: 'white',
  },
  h3: {
    fontSize: 17,
    color: 'white',
  },
  h4: {
    fontSize: 15,
    color: 'white',
  },
  h5: {
    fontSize: 13,
    color: 'white',
  },
}

let moodMap = {
  'Horrível': 1,
  'Mal': 2,
  'Regular': 3,
  'Bem': 4,
  'Ótimo': 5
}

const interpolations = ['natural', 'linear', 'step', 'cardinal', 'catmullRom', 'basis']
function nextInterpolation(current) {
  const index = interpolations.indexOf(current)
  const nextIndex = index==interpolations.length-1 ? 0 : index+1
  return interpolations[nextIndex]
}

const ChartCard = ({title, Chart, data}) => {
  return(
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.h2}>{ title }</Text>
      </View>
      <View style={{marginTop: 5, marginBottom: 5, alignItems: 'center', justifyContent: 'center'}}>
        <Chart data={data} />
      </View>
    </View>
  )
}

function MoodLineCard({data}) {
  const [temporal, setTemporal] = useState(false)
  const [interpolation, setInterpolation] = useState('natural')
  const [temporalClicked, setTemporalClicked] = useState(false)
  const [interpolationClicked, setInterpolationClicked] = useState(false)
  return(
    <View style={{width: '100%',  alignItems: 'center', justifyContent: 'center'}}>
      <View style={{width: '100%',  alignItems: 'center', justifyContent: 'flex-start'}}>
        { temporal ? <MoodLineTemporal data={data} interpolation={interpolation} /> : <MoodLine data={data} interpolation={interpolation} /> }
      </View>
      <View style={{width: '100%', height: 55, paddingHorizontal: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name='swap-outline' width={15} height={15} fill={interpolationClicked ? '#fff6' : '#fff'} />
          <Text
          style={[styles.h4, { fontSize: 16, color: interpolationClicked ? '#fff6' : '#fff' }]}
          onPress={() => {blinkButton(setInterpolationClicked, 100); setInterpolation(nextInterpolation(interpolation))}}
          >
            { ' ' + interpolation }
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name='swap-outline' width={15} height={15} fill={temporalClicked ? '#fff6' : '#fff'} />
          <Text
          style={[styles.h4, { fontSize: 16, color: temporalClicked ? '#fff6' : '#fff' }]}
          onPress={() => {blinkButton(setTemporalClicked, 100); setTemporal(!temporal)}}
          >
            { temporal ? ' temporal' : ' atemporal' }
          </Text>
        </View>
      </View>
    </View>
  )
}

function MoodLineTemporal({data, interpolation}) {
  var time, time_s
  var times = []
  data.forEach((entry, index) => {
    time = entry.startTime
    time_s = parseInt(time.slice(0,2))*3600 + parseInt(time.slice(3,5))*60 + parseInt(time.slice(6,8))
    data[index]['time_s'] = time_s
    times.push(time_s)
  })
  data = data.sort((a, b) => {
    return a.time_s - b.time_s;
  })
  let x_min = data[0].time_s-600
  let x_max = data[data.length-1].time_s
  let x_range = x_max - x_min
  let x_dif = (x_range/data.length-1)*0.4
  let X_m = x_min - x_dif
  let X_M = x_max + x_dif
  const x_domain = [ X_m, X_M ]
  return(
    <Victory.VictoryChart 
    width={330}
    height={225}
    padding={{left: 40, right: 20, top: 0, bottom: 65}}
    domain={{x: x_domain, y: [0.5, 5.5]}}
    >
      <Victory.VictoryAxis
      dependentAxis
      domain={[0.5, 5.5]}
      tickFormat={ tick => parseInt(tick) }
      style={{
        axis: {stroke: "#fff0"},
        grid: {stroke: "#fff7"},
        tickLabels: {fontSize: 17, padding: 15 + (330-40)*x_dif/x_range, fill: '#fff'},
      }}
      />
      <Victory.VictoryAxis
      tickValues={data.map(entry => entry.time_s)}
      tickFormat={ tick => data.filter(entry => entry.time_s==tick)[0].startTime.slice(0,5) }
      tickLabelComponent={<Victory.VictoryLabel angle={-90} dx={-25} dy={-8} />}
      style={{
        axis: {stroke: "#fff0"},
        grid: {stroke: "#fff0"},
        tickLabels: {fontSize: 15, padding: 0, fill: '#fff'},
        ticks: {stroke: "#fff8", size: 10},
      }}
      />
      <Victory.VictoryLine
      data={data}
      x='time_s' y='y'
      interpolation={interpolation}
      style={{
        data: {
          stroke: '#fff',
          strokeWidth: 3,
        },
      }}
      />
      <Victory.VictoryScatter
      data={data}
      x='time_s' y='y'
      size={5.7}
      style={{ data: { fill: ({datum}) => moodColorsHEX[datum.y-1] } }}
      />
    </Victory.VictoryChart>
  )
}

function MoodLine({data, interpolation}) {
  return(
    <Victory.VictoryChart 
    width={330}
    height={160}
    padding={{left: 40, right: 20, top: 0, bottom: 0}}
    domain={{x: [ 0.6, data.length + 0.4 ], y: [0.5, 5.5]}}
    >
      <Victory.VictoryAxis
      dependentAxis
      domain={[0.5, 5.5]}
      tickFormat={ tick => parseInt(tick) }
      style={{
        axis: {stroke: "#fff0"},
        grid: {stroke: "#fff7"},
        tickLabels: {fontSize: 17, padding: 15, fill: '#fff'},
      }}
      />
      <Victory.VictoryLine
      data={data}
      x='x' y='y'
      interpolation={interpolation}
      style={{
        data: {
          stroke: '#fff',
          strokeWidth: 3,
        },
      }}
      />
      <Victory.VictoryScatter
      data={data}
      size={5.7}
      style={{ data: { fill: ({datum}) => moodColorsHEX[datum.y-1] }}}
      />
    </Victory.VictoryChart>
  )
}

function MoodPieCard({data}) {
  return(
    <View style={{width: 330, height: 180, flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 10}}>
      { data.entries[0]
        ? <MoodPie data={data.data} />
        : <Text style={[styles.h3, {width: '60%', textAlign: 'center'}]}>Você ainda não fez nenhuma entrada.</Text>
      }
      <MoodPieStats data={data} />
    </View>
  )
}

function MoodPieStats({data}) {
  return(
    <View style={{width: 150, height: 160, alignItems: 'center', justifyContent: 'space-between'}}>
      {moods.map(mood => (<MoodStat key={mood} mood={mood} data={data} />))}
    </View>
  )
}

function MoodStat({mood, data}) {
  const moodCountObj = data.data.filter(countObj => countObj.x==mood)[0]
  const moodCount = moodCountObj ? moodCountObj.y : 0
  const moodProp = Math.round(100*moodCount/data.entries.length) + '%'
  return(
    <View style={{width: '100%', height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
      <View style={styles.statsRowItem}>
        <View style={{alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 12.5, backgroundColor: moodColorsHEX[mood-1]}}>
          <Text style={[styles.h4, {color: mood==3|mood==4|mood==5 ? '#000' : '#fff'}]}>{mood}</Text>
        </View>
      </View>
      <View style={styles.statsRowItem}>
        <Text style={styles.h4}>{`${moodCount}/${data.entries.length}` }</Text>
      </View>
      <View style={styles.statsRowItem}>
        <Icon name='arrow-forward-outline' width={15} height={15} fill='#fff' />
      </View>
      <View style={styles.statsRowItem}>
        <Text style={styles.h4}>{ moodProp }</Text>
      </View>
    </View>
  )
}

function MoodPie({data}) {
  var colorScale = []
  data.forEach(row => {colorScale.push(moodColorsHEX[row.x-1])})
  return(
    <Victory.VictoryPie
    data={data}
    x='x' y='y'
    width={180}
    height={150}
    padding={{left: 0, right: 0, top: 0, bottom: 0}}
    innerRadius={37}
    padAngle={4}
    cornerRadius={4}
    colorScale={colorScale}
    labels={[]}
    />
  )
}

export default class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    console.log('Rendering "Charts" screen component...')
    const settings = this.props.appState.user.settings
    const backgroundImage = settings.backgroundImage
    const imgURI =  settings.displayBackgroundImage ? (backgroundImage ? ( settings.enableHighResolution ? backgroundImage.urls.raw : backgroundImage.urls.regular ) : null ) : null
    const backgroundColor = settings.backgroundColor

    const entries = this.props.appState.user.entries
    const todayEntries = entries.filter(entry => entry.date==Today())

    const moodData = todayEntries.map( (entry, index) => ({ x: index+1, y: moodMap[entry.mood], startTime: entry.startTime }) )

    var moodCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    todayEntries.forEach((entry) => {
      moodCount[moodMap[entry.mood]] += 1
    })
    var moodPieData = []
    moods.forEach(mood => {
      if (moodCount[mood]) {
        moodPieData.push({ x: mood, y: moodCount[mood] })
      }
    })
    
    return(
      <ImageBackground
      source={{uri : imgURI}}
      style={[ styles.background, {backgroundColor: backgroundColor} ]}
      >
        <ScrollView style={{width: '100%'}}>
          <View style={[styles.foreground, {alignSelf: 'center'}]}>
            <View style={styles.header}>
              <Text style={styles.h1}>Relatório</Text>
            </View>

            <ChartCard title='Avaliações de Hoje' Chart={MoodLineCard} data={moodData} />
            <ChartCard title='Proporção das Avaliações' Chart={MoodPieCard} data={{data: moodPieData, entries: todayEntries}} />

          </View>
        </ScrollView>
      </ImageBackground>
    )  
  }
}