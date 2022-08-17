import React, { Component, useContext, useState } from 'react';
import { ImageBackground, View, Text, ScrollView, StatusBar, Pressable } from 'react-native';
import "react-native";
import { Icon } from 'react-native-eva-icons';
// import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Victory from './victory'

import { MoodLineTemporal } from './subcomponents/MoodLineTemporal';
import { EmotionBarCard } from './subcomponents/EmotionBar'

import { relativeToScreen } from '../styles/loginStyles';
import { blinkButton } from './SettingsScreen';
import { Today, current, getNext, datePeriodFilters, formatPeriodDate } from '../shared/dates';

import { capitalize } from './subcomponents/EditEmotions';
import UserContext from '../shared/UserContext';

import { moodColorsHEX } from './PostEntryComponent';
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
    paddingHorizontal: relativeToScreen(15),
    borderRadius: relativeToScreen(20),
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardRow: {
    flexDirection: 'row',
    // paddingVertical: relativeToScreen(5),
    alignItems: 'center',
  },
  cardHeader: {
    height: relativeToScreen(40),
    justifyContent: 'space-between',
    // paddingHorizontal: relativeToScreen(5),
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
  // paddingHorizontal: relativeToScreen(5),
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
export const moodMap = {
  'Horrível': 1,
  'Mal': 2,
  'Regular': 3,
  'Bem': 4,
  'Ótimo': 5
}

const periods = ['day', 'week', 'month', 'year']
export const periodMap = {
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

// export const stats = [
//   'sequência', 'Média (hora)', 'Média (dia)',
//   'Média (semana)', 'Média (mês)', 'Variância (hora)',
//   'Variância (dia)', 'Variância (semana)', 'Variância (mês)'
// ]

export const stats = [ 'sequência', 'média', 'variância' ] 
export const groupBy = [ 'hora', 'dia', 'semana', 'mês' ]
const domainModes = [ 'enquadrar', 'expandir', 'enforcar' ]
export const groupByMap = {
  'sequência': 'sequência',
  'hora': 'hour',
  'dia': 'day',
  'semana': 'week',
  'mês': 'month',
}

function ChartPanel({entries, imgURI, backgroundColor, animate}) {

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
          title={'Avaliações ' + ( period=='week' ? 'da ' : 'do ' )  + periodMap[period].toLowerCase() }
          Chart={MoodLineCard}
          entries={entries}
          date={date}
          period={period}
          initialMode='enquadrar'
          modes={domainModes}
          initialSecMode='sequência'
          secModes={stats}
          initialThirdMode='hora'
          thirdModes={groupBy}
          />
          <ChartCard
          title='Repartição das avaliações'
          Chart={MoodPieCard}
          entries={entries}
          date={date}
          period={period}
          initialMode={null}
          modes={null}
          />
          <ChartCard
          title={'Emoções ' + ( period=='week' ? 'da ' : 'do ' )  + periodMap[period].toLowerCase()}
          Chart={EmotionBarCard}
          entries={entries}
          date={date}
          period={period}
          initialMode='contagem'
          modes={['contagem', 'entradas %', 'repartição %']}
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
      <Text selectable={false} style={[styles.h3, {color: styles.h1.color   + ( isClicked ? 'a' : 'f' ), fontWeight: 'bold'}]}>{ ' ' + periodMap[period] }</Text>
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

const ChartCard = ({title, Chart, entries, date, period, initialMode, modes, initialSecMode, secModes, initialThirdMode, thirdModes}) => {
  const filter = datePeriodFilters(date, period)
  entries = entries.filter(filter)
  const [ mode, setMode ] = useState(initialMode)
  const [ secMode, setSecMode ] = useState(initialSecMode)
  const [ thirdMode, setThirdMode ] = useState(initialThirdMode)
  const [ temporal, setTemporal ] = useState('temporal')
  return(
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={[styles.cardRow, styles.cardHeader]}>
          <Text style={styles.h2}>{ title }</Text>
          { initialMode
            ? ( temporal=='temporal'
              ? <ModeSwapButton mode={mode} setMode={setMode} modes={ modes } />
              : null
            )
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
          thirdMode={thirdMode}
          setThirdMode={setThirdMode}
          temporal={temporal}
          setTemporal={setTemporal}
          />
        </View>
      </View>
        { temporal=='temporal'
          ? ( secMode
            ? (
              <ModeControlRow
              containerStyle={{ ...styles.bottomControlRow, justifyContent: 'space-between', paddingHorizontal: relativeToScreen(15)}}
              var1={secMode}
              setVar1={setSecMode}
              var1Options={secModes}
              var2={thirdMode}
              setVar2={setThirdMode}
              var2Options={thirdModes}
              />        
            ) : null
          ) : null
        }
    </View>
  )
}

export function ModeControlRow(props) {
  return props.var1 || props.var2 ? (
    <View style={[styles.controlRow, props.containerStyle]}>
      { props.var1 ? <ModeSwapButton mode={props.var1} setMode={props.setVar1} modes={props.var1Options} /> : null }
      { props.var2 ? <ModeSwapButton mode={props.var2} setMode={props.setVar2} modes={props.var2Options} /> : null }
    </View>
  ) : null
}

function ModeSwapButton({mode, setMode, modes}) {
  const [ modeClicked, setModeClicked ] = useState(false)
  return(
    <Pressable
    style={styles.cardRow}
    onPressIn={() => blinkButton(setModeClicked, 300)}
    onPress={() => setMode(next(mode, modes))}
    >
      <Icon
      name='swap-outline'
      width={relativeToScreen(15)}
      height={relativeToScreen(15)}
      fill={ styles.h1.color + (modeClicked ? '6' : '')}
      />
      <Text selectable={false} style={[styles.h3, { color: styles.h1.color + (modeClicked ? '6' : '') } ]}>{ ' ' + capitalize(mode) }</Text>
    </Pressable>
  )
}

function setStatForPeriod(stat, by, setBy, period) {
  if (stat=='sequência') {
    setBy(null)
  } else if (!by) {
    setBy('hora')
  } else {
    periods.forEach((per, index) => {
      if (period==per) {
        if ( groupBy.slice(index+1, 4).includes(by) )
          setBy('hora')
      }
    })      
  }
}

const interpolations = [ 'catmullRom', 'linear', 'natural', 'step', 'basis','cardinal', 'scatter' ]

function MoodLineCard({entries, date, period, mode, setMode, secMode, setSecMode, thirdMode, setThirdMode, temporal, setTemporal}) {

  const [interpolation, setInterpolation] = useState('catmullRom')
  if (!entries[1]) {
    setMode('enquadrar'); setSecMode('sequência')
  }
  setStatForPeriod(secMode, thirdMode, setThirdMode, period)

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
      <View style={{width: '100%',  alignItems: 'center', justifyContent: 'center'}}>
        <MoodLineTemporal
        data={data} temporal={temporal} interpolation={interpolation}
        date={date} period={period} mode={mode} secMode={secMode}
        thirdMode={thirdMode} setThirdMode={setThirdMode}
        />
      </View>
      <ModeControlRow
      containerStyle={{height: 40}}
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

function MoodPieCard({entries, period}) {
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
    <View style={[styles.moodPieCard, {justifyContent: entries[0] ? 'flex-start' : 'center'}]}>
        { entries[0]
          ? (
            <>
              <View style={styles.moodPieCardSection}>
                <MoodPie data={moodPieData} />
              </View>
              <View style={styles.moodPieCardSection}>
                <MoodPieStats data={moodPieData} nEntries={entries.length} />
              </View>
            </>
          )
          : <Text style={[styles.h3, {width: '60%', textAlign: 'center', alignSelf: 'center'}]}>{ `Você não possui entradas ${period=='week' ? 'nessa' : 'nesse'} ${periodMap[period].toLowerCase()}.` }</Text>
        }
    </View>
  )
}

function MoodPie({data}) {
  const animate = useContext(UserContext).user.settings.enableAnimations
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
    animate={ animate ? {duration: 2000, onLoad: {duration: 1000}} : null }
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
      <View style={[styles.statsRowItem, {width: null}]}>
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
    var entries = this.props.appState.user.entries
    const settings = this.props.appState.user.settings
    const backgroundColor = settings.backgroundColor
    const backgroundImage = settings.backgroundImage
    const imgURI =  settings.displayBackgroundImage
    ? ( backgroundImage
      ? ( settings.enableHighResolution
        ? backgroundImage.urls.raw
        : backgroundImage.urls.regular
      ) : null
    ) : null
    return(
      <ChartPanel
      entries={entries}
      backgroundColor={backgroundColor}
      imgURI={imgURI}
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