import React, { Component, useState } from 'react';
import { ImageBackground, View, Text, ScrollView, StatusBar, Pressable } from 'react-native';
import "react-native";
import { Icon } from 'react-native-eva-icons';
// import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Victory from './victory'

import { relativeToScreen } from '../styles/loginStyles';
import { blinkButton } from './SettingsScreen';
import { Today, current, getNext, datePeriodFilters, formatPeriodDate } from '../shared/dates';

import { moodColorsHEX } from './PostEntryComponent';
import { capitalize } from './subcomponents/EditEmotions';
import { MoodLineTemporal, appendTimeData, sortData } from './subcomponents/MoodLineTemporal';
var moodColorsObj = {}
moodColorsHEX.forEach((color, index) => {
  moodColorsObj[index+1] = color
})

export var styles = {
  background: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingBottom: relativeToScreen(55),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foreground: {
    width: relativeToScreen(350),
    paddingBottom: relativeToScreen(60),
  },
  header: {
    height: relativeToScreen(120),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationRow: {
    justifyContent: 'space-between',
    height: relativeToScreen(60),
    alignItems: 'flex-start',
  },
  cardContainer: {
    width: '100%',
    marginBottom: '5%',
  },
  card: {
    paddingVertical: relativeToScreen(5),
    paddingHorizontal: relativeToScreen(10),
    borderRadius: relativeToScreen(20),
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardRow: {
    flexDirection: 'row',
    // paddingVertical: relativeToScreen(5),
    alignItems: 'center',
  },
  cardHeader: {
    height: relativeToScreen(39),
    justifyContent: 'space-between',
  },
  periodButton: {
    width: '35%',
    height: relativeToScreen(40),
    position: 'absolute',
    bottom: relativeToScreen(20 + 55),
    // right: relativeToScreen(20),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: relativeToScreen(20),
    backgroundColor: '#fff',
  },
  chartView: {
    marginTop: relativeToScreen(5),
    marginBottom: relativeToScreen(5),
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlRow: {
  width: '100%',
  height: relativeToScreen(30),
  paddingHorizontal: relativeToScreen(5),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between'
  },
  bottomControlRow: {
    flexDirection: 'row',
    height: relativeToScreen(50),
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  moodPieCard: {
    width: relativeToScreen(330),
    height: relativeToScreen(180),
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: relativeToScreen(5),
    paddingBottom: relativeToScreen(10)
  },
  moodPieCardSection: {
    height: '100%',
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  moodPieStatsView: {
    width: relativeToScreen(150),
    height: relativeToScreen(150),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  moodStatRow: {
    width: '100%',
    height: relativeToScreen(25),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  statsRowItem: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
  },
  moodCircleBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: relativeToScreen(22),
    height: relativeToScreen(22),
    borderRadius: relativeToScreen(11)
  },
  h1: {
    fontSize: relativeToScreen(25),
    color: '#fff'
  },
  h2: {
    fontSize: relativeToScreen(20),
    color: '#fff',
  },
  h3: {
    fontSize: relativeToScreen(17),
    color: '#fff',
  },
  h4: {
    fontSize: relativeToScreen(15),
    color: '#fff',
  },
  h5: {
    fontSize: relativeToScreen(13),
    color: '#fff',
  },
  altTheme: {
    color: '#000',
  }
}

const moods = [1,2,3,4,5]
let moodMap = {
  'Horrível': 1,
  'Mal': 2,
  'Regular': 3,
  'Bem': 4,
  'Ótimo': 5
}

const periods = ['day', 'week', 'month', 'year']
const periodMap = {
  'day': 'Dia',
  'week': 'Semana',
  'month':'Mês',
  'year': 'Ano'
}

function ChartScreenHeader({title}) {
  return(
    <View style={styles.header}>
      <Text style={styles.h1}>{ title }</Text>
    </View>
  )
}

export const stats = [ 'sequencial', 'Média (hora)', 'Média (dia)', 'Média (semana)', 'Média (mês)', 'Variância (hora)', 'Variância (dia)', 'Variância (semana)', 'Variância (mês)']
const domainModes = ['expandir', 'enquadrar', 'enforcar']

function ChartPanel({imgURI, backgroundColor, entries}) {

  const currentDates = {
    'day': Today(),
    'week': { week: current('week'), year: current('year') },
    'month': { month: current('month'), year: current('year') },
    'year': current('year')
  }
  
  const [ period, setPeriod ] = useState('day')
  const [ date, setDate ] = useState(currentDates)

  return(
    <ImageBackground
    source={{uri : imgURI}}
    style={[ styles.background, {backgroundColor: backgroundColor} ]}
    >
      <ScrollView style={{width: '100%'}}>
        <View style={[styles.foreground, {alignSelf: 'center'}]}>
          <ChartScreenHeader title={'Painel'} />
          <NavigationRow date={date} setDate={setDate} period={period} />
          <ChartCard
          title={'Avaliações ' + ( period=='week' ? 'da ' : 'do ' )  + periodMap[period] }
          Chart={MoodLineCard}
          entries={entries}
          date={date}
          period={period}
          initialMode={'expandir'}
          modes={domainModes}
          initialSecMode='sequencial'
          secModes={stats}
          />
          <ChartCard
          title='Divisão das Avaliações'
          Chart={MoodPieCard}
          entries={entries}
          date={date}
          period={period}
          initialMode='expandir'
          modes={['expandir', 'enforcar', 'enquadrar']}
          />
        </View>
      </ScrollView>
      <PeriodButton period={period} setPeriod={setPeriod} />
    </ImageBackground>
  )
}

function PeriodButton({period, setPeriod}) {
  const [ isClicked, setIsClicked ] = useState(false)
  return(
    <Pressable
    style={[styles.periodButton, {
      backgroundColor: styles.altTheme.color + ( isClicked ? '4' : '8' ),
      borderColor: styles.h1.color + ( isClicked ? '6' : '8' )
    }]}
    onPressIn={() => blinkButton(setIsClicked, 300)}
    onPress={() => setPeriod(periods[ periods[periods.length-1]==period ? 0 : periods.indexOf(period)+1 ])}
    >
      <Icon name='swap-outline' width={15} height={15} fill={styles.h1.color  + ( isClicked ? 'a' : 'f' )} />
      <Text style={[styles.h3, {color: styles.h1.color   + ( isClicked ? 'a' : 'f' ), fontWeight: 'bold'}]}>{ ' '+periodMap[period] }</Text>
    </Pressable>
  )
}

function NavigationRow({date, setDate, period}) {
  return(
    <View style={[styles.cardRow, styles.navigationRow]}>
      <DateNavigationButton
      icon='arrow-back'
      next='previous'
      date={date}
      setDate={setDate}
      period={period}
      />
      <Text style={[styles.h2]}>{ formatPeriodDate[period](date[period]) }</Text>                                
      <DateNavigationButton
      icon='arrow-forward'
      next='next'
      date={date}
      setDate={setDate}
      period={period}
      />
    </View>
  )
}

function DateNavigationButton({icon, next, date, setDate, period}) {
  const [ isClicked, setIsClicked ] = useState(false)
  return(
    <Pressable
    onPressIn={() => blinkButton(setIsClicked, 300)}
    onPress={() => setDate({
      ...date,
      [period]: getNext(date[period], next, period)
    })}
    hitSlop={relativeToScreen(15)}
    >
      <Icon
      name={icon}
      width={relativeToScreen(29)}
      height={relativeToScreen(29)}
      fill={  styles.h1.color + (isClicked ? '6' : '') }
      />
    </Pressable>
  )
}

function next(current, list) {
  let index = list.indexOf(current)
  return list[ index == list.length-1 ? 0 : index+1 ]
}

const ChartCard = ({title, Chart, entries, date, period, initialMode, modes, initialSecMode, secModes=null}) => {
  const filter = datePeriodFilters(date, period)
  entries = entries.filter(filter)

  const [ mode, setMode ] = useState(initialMode)
  const [ secMode, setSecMode ] = useState(initialSecMode)
  const [ temporal, setTemporal ] = useState('temporal')
  return(
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={[styles.cardRow, styles.cardHeader]}>
          <Text style={styles.h2}>{ title }</Text>
          { temporal=='temporal'
            ? <ModeSwapButton mode={ entries[1] ? mode : 'expandir' } setMode={setMode} modes={ modes } />
            : null
          }
        </View>
        <View style={styles.chartView}>
          <Chart
          entries={entries}
          date={date}
          period={period}
          mode={mode}
          setMode={setMode}
          secMode={secMode}
          setSecMode={setSecMode}
          temporal={temporal}
          setTemporal={setTemporal}
          />
        </View>
      </View>
        { temporal=='temporal'
          ? ( secModes
            ? (
              <View style={styles.bottomControlRow}>
                <ModeSwapButton mode={secMode} setMode={setSecMode} modes={secModes} />
              </View>
            ) : null
          ) : null
        }
    </View>
  )
}

function setStatForPeriod(stat, setStat, entries, period) {
  if (!entries[1])
    setStat('sequencial')
  else {
    ['day', 'week', 'month', 'year'].forEach((per, index) => {
      if (period==per) {
        if ( stats.slice(index+2, 5).includes(stat) )
          setStat('Variância (hora)')
        else if ( stats.slice(6+index, stats.length).includes(stat) )
          setStat('sequencial')
      }
    })
  }
}

const interpolations = [ 'catmullRom', 'linear', 'natural', 'step', 'basis','cardinal', 'scatter' ]

function MoodLineCard({entries, date, period, mode, setMode, secMode, setSecMode, temporal, setTemporal}) {

  const [interpolation, setInterpolation] = useState('catmullRom')
  setMode(entries[1] ? mode : 'expandir')
  setStatForPeriod(secMode, setSecMode, entries, period)

  const data = entries.map((entry, index) => {
    return({
      x: index+1,
      y: moodMap[entry.mood],
      date: entry.date,
      startTime: entry.startTime
    })
  })

  return(
    <View style={{width: '100%',  alignItems: 'center', justifyContent: 'center'}}>
      <View style={{width: '100%',  alignItems: 'center', justifyContent: 'flex-start'}}>
        { temporal=='temporal'
          ? <MoodLineTemporal data={data} interpolation={interpolation} date={date} period={period} mode={mode} setMode={setMode} secMode={secMode} />
          : <MoodLine data={data} interpolation={interpolation} date={date} period={period} /> 
        }
      </View>
      <ModeControlRow
      var1={interpolation}
      setVar1={setInterpolation}
      var1Options={interpolations}
      var2={temporal}
      setVar2={setTemporal}
      var2Options={['temporal', 'atemporal']}
      />
    </View>
  )
}

function ModeControlRow(props) {
  return(
    <View style={styles.controlRow}>
      <ModeSwapButton mode={props.var1} setMode={props.setVar1} modes={props.var1Options} />
      <ModeSwapButton mode={props.var2} setMode={props.setVar2} modes={props.var2Options} />
    </View>
  )
}

function ModeSwapButton({mode, setMode, modes}) {
  const [ modeClicked, setModeClicked ] = useState(false)
  return(
    <Pressable
    style={styles.cardRow}
    onPressIn={() => blinkButton(setModeClicked, 300)}
    onPress={() => {
      setMode(next(mode, modes))
    }}
    >
      <Icon
      name='swap-outline'
      width={relativeToScreen(15)}
      height={relativeToScreen(15)}
      fill={ styles.h1.color + (modeClicked ? '6' : '')}
      />
      <Text style={[styles.h3, { color: styles.h1.color + (modeClicked ? '6' : '') } ]}>{ ' ' + capitalize(mode) }</Text>
    </Pressable>
  )
}

function MoodLine({data, date, period, interpolation}) {
  data = data.filter(entry => entry.startTime)
  data = data.map((entry, index) => ({ ...entry, x:index+1 }))
  data = appendTimeData(data, date, period)
  const by = 'time_d'
  data = sortData(data, by)
  return(
    <Victory.VictoryChart 
    width={relativeToScreen(330)}
    height={relativeToScreen(150)}
    padding={{left: relativeToScreen(40), right: relativeToScreen(20), top: relativeToScreen(0), bottom: relativeToScreen(0)}}
    domain={{x: [ 0.6, data.length + 0.4 ], y: [0.5, 5.5]}}
    >
      <Victory.VictoryAxis
      dependentAxis
      domain={[0.5, 5.5]}
      tickFormat={ tick => parseInt(tick) }
      style={{
        axis: {stroke: "#fff0"},
        grid: {stroke: "#fff7"},
        tickLabels: {fontSize: relativeToScreen(17), padding: relativeToScreen(15), fill: styles.h1.color},
      }}
      />
      { interpolation == 'scatter' ? null : (
        <Victory.VictoryLine
        data={data}
        x='x' y='y'
        interpolation={interpolation}
        style={{
          data: {
            stroke: styles.h1.color,
            strokeWidth: 3,
          },
        }}
        />
      )}
      <Victory.VictoryScatter
      data={data}
      size={['month', 'year'].includes(period) ? 4.5 : 5.7}
      style={{ data: { fill: ({datum}) => moodColorsHEX[datum.y-1] }}}
      />
    </Victory.VictoryChart>
  )
}

function MoodPieCard({entries}) {
  // const entries = entries.filter(entry => entry.date==Today())
  var moodCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  entries.forEach((entry) => {
    moodCount[moodMap[entry.mood]] += 1
  })
  var moodPieData = []
  moods.forEach(mood => {
    if (moodCount[mood]) {
      moodPieData.push({ x: mood, y: moodCount[mood] })
    }
  })
  return(
    <View style={styles.moodPieCard}>
      <View style={styles.moodPieCardSection}>
        { entries[0]
          ? <MoodPie data={moodPieData} />
          : <Text style={[styles.h3, {width: '85%', textAlign: 'center'}]}>Você não possui entradas nesse período.</Text>
        }
      </View>
      <View style={styles.moodPieCardSection}>
        <MoodPieStats data={moodPieData} nEntries={entries.length} />
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
    width={relativeToScreen(180)}
    height={relativeToScreen(130)}
    padding={{left: 0, right: 0, top: 0, bottom: 0}}
    innerRadius={relativeToScreen(32)}
    padAngle={4}
    cornerRadius={4}
    colorScale={colorScale}
    labels={[]}
    />
  )
}

function MoodPieStats({data, nEntries}) {
  const moodCounts = [5,4,3,2,1].filter(mood => data.filter(countObj => countObj.x==mood)[0])
  return(
    <View style={[styles.moodPieStatsView, {height: relativeToScreen( 30 * moodCounts.length )}]}>
      { [5,4,3,2,1].map(mood => <MoodStat key={mood} mood={mood} data={data} nEntries={nEntries}/>) }
    </View>
  )
}

function MoodStat({mood, data, nEntries}) {
  const moodCountObj = data.filter(countObj => countObj.x==mood)[0]
  const moodCount = moodCountObj ? moodCountObj.y : 0
  const moodProp = Math.round(100*moodCount/nEntries)
  return moodCount==0 ? null : (
    <View style={styles.moodStatRow}>
      <View style={[styles.statsRowItem, ]}>
        <View style={[ styles.moodCircleBadge, {backgroundColor: moodColorsObj[mood]}]}>
          <Text style={[styles.h4, {color: '#000'}]}>{mood}</Text>
        </View>
      </View>
      <View style={[styles.statsRowItem, {width: '31%'}]}>
        <Text style={styles.h4}>{`${moodCount}/${nEntries}` }</Text>
      </View>
      <View style={[styles.statsRowItem, {width: '13%'}]}>
        <Icon name='arrow-forward-outline' width={relativeToScreen(15)} height={relativeToScreen(15)} fill={styles.h1.color} />
      </View>
      <View style={[styles.statsRowItem,  {width: '31%'}]}>
        <Text style={styles.h4}>{ (moodProp ? moodProp : 0) + '%' }</Text>
      </View>
    </View>
  )
}

export default class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setFontColor = this.setFontColor.bind(this);
    this.ChartsScreen = this.ChartsScreen.bind(this);
  }

  ChartsScreen() {
    const settings = this.props.appState.user.settings
    const backgroundImage = settings.backgroundImage
    const imgURI =  settings.displayBackgroundImage
    ? ( backgroundImage
      ? ( settings.enableHighResolution
        ? backgroundImage.urls.raw
        : backgroundImage.urls.regular
      ) : null
    ) : null
    const backgroundColor = settings.backgroundColor
    var entries = this.props.appState.user.entries
    return(
      <ChartPanel
      imgURI={imgURI}
      backgroundColor={backgroundColor}
      entries={entries}
      />
    )  
  }

  setFontColor(color) {
    styles['altTheme'] = {color: color=='#fff' ? '#000' : '#fff'}
    for (let h of ['h1', 'h2', 'h3', 'h4']) {
      styles[h] = {
        ...styles[h],
        ['color']: color
      }
    }
  }

  render() {
    console.log('Rendering "Charts" screen component...')
    this.setFontColor(this.props.appState.user.settings.fontColorDark ? '#000' : '#fff')
    return <this.ChartsScreen />
  }
}