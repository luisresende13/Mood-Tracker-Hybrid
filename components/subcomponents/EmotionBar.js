import { useContext, useState } from 'react'
import { View, Text } from 'react-native'
import UserContext from '../../shared/UserContext'
import { relativeToScreen } from '../../styles/loginStyles'
import { styles, periodMap, ModeControlRow } from '../Charts'
import { moodColorsHEX } from '../PostEntryComponent'
import Victory from '../victory'
import { objListIncludes, sortData } from './MoodLineTemporal'

function uniqueItems(objList, key) {
  var items = []
  for (let obj of objList) {
    for (let item of obj[key]) {
      if (!objListIncludes(items, item)) { items.push(item) }
    }
  }
  return items
}

function itemsCount(objList, key) {
  var uniqueItemsCount = {}
  const items = uniqueItems(objList, key)
  items.forEach(item => uniqueItemsCount[item.name] = 0);
  for (let obj of objList) {
    for (let item of obj[key]) {
      uniqueItemsCount[item.name] += 1
    }
  }
  return uniqueItemsCount
}

export function EmotionBarCard({entries, date, period, mode}) {//, setMode, secMode, setSecMode, thirdMode, setThirdMode, temporal, setTemporal}) {

  const uniqueEmotions = uniqueItems(entries, 'emotions')
  const emotionCount = itemsCount(entries, 'emotions')
  var emotionEntriesLength = 0
  uniqueEmotions.forEach(emotion => emotionEntriesLength += emotionCount[emotion.name])
  var data = uniqueEmotions.map((emotion, index) => ({
    x: index+1,
    y: emotionCount[emotion.name],
    entriesProportion: emotionCount[emotion.name] / entries.length,
    emotionEntriesProportion: emotionCount[emotion.name] / emotionEntriesLength,
    emotion: emotion.name,
    type: emotion.type,
    energy: emotion.energy      
  }))

  const y = mode=='contagem' ? 'y' : ( mode=='entradas %' ? 'entriesProportion' : 'emotionEntriesProportion' )
  data = sortData(data, y)

  const [by, setBy] = useState('positiva ou negativa')

  return(
    <View style={{width: '100%',  alignItems: 'center', justifyContent: 'center'}}>
      <View style={{width: '100%',  alignItems: 'center', justifyContent: 'center', height: data[0] ? null : 150 }}>
          { data[0]
            ? <EmotionBar data={data} y={y} mode={mode} by={by} />
            : (
              <Text
              style={[styles.h3, {width: '70%', textAlign: 'center', alignSelf: 'center'}]}
              >
                { `Você não possui emoções salvas ${period=='week' ? 'nessa' : 'nesse'} ${periodMap[period].toLowerCase()}.` }
              </Text>
            )
          }
      </View>
      <ModeControlRow
      containerStyle={{height: 40, marginTop: 5}}
    //   var1={interpolation}
    //   setVar1={setInterpolation}
    //   var1Options={interpolations}
      var2={by}
      setVar2={setBy}
      var2Options={['positiva ou negativa', 'calmo(a) ou energizado(a)']}
      />
    </View>
  )
}

const EmotionLabel = (props) => {
    const maxCount = props.data[props.data.length-1][props.variable]
    const labelLength = props.datum.emotion.length + 2 + 2
    const labelSize = labelLength * relativeToScreen(10) + relativeToScreen(10)
    const barHeight = props.datum[props.variable] / (props.variable=='y' ? maxCount : 1 ) * relativeToScreen(350)
    const labelOutside = labelSize > barHeight
    return <Victory.VictoryLabel {...props} labelOutside={labelOutside} textAnchor={ labelOutside ? 'start' : 'end' } dx={relativeToScreen(labelOutside ? 10 : -10)}  />
}

export function EmotionBar({data, mode, y, by}) {
  const emotionBarStyle = {
    parent: {},
    data: {
      fill: ({ datum }) =>  moodColorsHEX[ (by=='positiva ou negativa' ? datum.type=='Positiva' : datum.energy=='Energizado(a)') ? (by=='positiva ou negativa' ? 4 : 3) : (by=='positiva ou negativa' ? 0 : 1 ) ],
    },
    labels: {
      fontSize: styles.h3.fontSize,
      fontWeight: '600',
      fill: (props) => (by!='positiva ou negativa' && props.datum.energy=='Energizado(a)' && !props.labelOutside) ? '#000' : styles.h1.color
    },
  }

  const labelFormat = ({datum}) => `${datum.emotion} ${ y=='y' ? parseInt(datum[y])+'x' : Math.round(datum[y]*100)+'%' }`
  const y_domain = [0, mode=='contagem' ? data[data.length-1].y : 1]
  const animate = useContext(UserContext).user.settings.enableAnimations

  return(
    <Victory.VictoryBar
    horizontal
    data={data}
    x='emotion' y={y}
    animate={ animate ? {duration: 2000, onLoad: {duration: 1000}} : null }
    domain={{y: y_domain}}
    height={relativeToScreen(data.length * 40 - 5)}
    width={relativeToScreen(320)}
    barWidth={relativeToScreen(35)}
    padding={{top: relativeToScreen(20), bottom: relativeToScreen(20), left: relativeToScreen(0), right: relativeToScreen(0) }}
    labels={labelFormat}
    labelComponent={<EmotionLabel mode={mode} variable={y} />}
    style={emotionBarStyle}
    cornerRadius={{top: 8, bottom: 0}}
    />
  )
}