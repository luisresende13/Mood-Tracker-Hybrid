import React, { useContext } from 'react';
import Victory from '../victory';
import { relativeToScreen } from '../../styles/loginStyles';
import { moodColorsHEX } from '../PostEntryComponent';
import { FullDates, intWeekDayMap, portugueseMonthSigs, YearTicks, datePeriodFilters, fullDateMap, dateDiff } from '../../shared/dates';
import { groupByMap, periodMap, styles } from '../Charts';
import UserContext from '../../shared/UserContext';

function stringTimeToSec(time) { // Expects 'hh:mm:ss' string format
  return parseInt(time.slice(0,2))*3600 + parseInt(time.slice(3,5))*60 + parseInt(time.slice(6,8))
}

export function appendTimeData(data, date, period, uniform) {
  var datePeriodDates = FullDates.filter(datePeriodFilters(date, period))
  var time_s, time_d
  data.forEach((entry, index) => {
    const dateDifDays = ((new Date(entry.date)) - (new Date(datePeriodDates[0].date))) / (1000*60*60*24)
    time_s = stringTimeToSec(entry.startTime)
    time_d = dateDifDays + time_s / (60*60*24)
    data[index]['time_s'] = time_s
    data[index]['time_d'] = uniform ? index+1 : time_d
    data[index]['x'] = index+1
  })
 return data
}

export function sortData(data, by='time_s', ascending=true) {
  return data.sort((a, b) => {
    if (ascending)
      return a[by] - b[by];
    else 
      return b[by] - a[by];
  })
}

function range(i=0, n=10, m=1) {
  const list = []
  let index=0
  for (let item = i; item < n; item+=m) {
    list[index] = item; index += 1
  }
  return list
}

function lastDayOfTheMonth(date, period) {
  const monthDays = FullDates.filter(datePeriodFilters(date, period))
  return monthDays[monthDays.length-1].day
}

export function xTicks(date, period, mode) {
  let interval = ['expandir', 'enforcar'].includes(mode) ? 1 : 2
  return {
    'day': () => range(0, 1, interval/24),
    'month': () => range(0, lastDayOfTheMonth(date, period), interval),
    'week': () => range(0, 7),
    'year': () => YearTicks
  }[period]()
}

export function expandDomains(date, period) {
  return {
    'day': () => [0,1],
    'week': () => [0, 7],
    'month': () => [0,  lastDayOfTheMonth(date, period)],
    'year' : () => [0, 365],
  }[period]()
}

export function getDomain(data, by='time_s', space=0) {
  if (data[1]) {
    let x_min = data[0][by]
    let x_max = data[data.length-1][by]
    let x_dif = (x_max - x_min) * space
    let x_lim = [ x_min - x_dif, x_max + x_dif ]
    if (x_lim[0] < 0) { x_lim[0] = 0 }
    return x_lim
  } else if (data[0]) {
    return [data[0][by] * 3 / 4, data[0][by] * 1.25]
  } else {
    return [0,1]
  }
}

function x_domains(data, date, period) {
  return {
  'enquadrar': () => expandDomains(date, period),
  'expandir': () => getDomain(data, 'time_d', 0.1),
  'enforcar': () => getDomain(data, 'time_d', 0),
  }
};

const xAxisLabel = {
  'day': 'Hora',
  'week': 'Dia da semana',
  'month': 'Dia do mês',
  'year': 'Mês'
}

function tickFormats(ticks) {
  return {
    'day' : tick => Math.round(tick*24),// + 'h',
    'week': tick => intWeekDayMap[tick],
    'month': tick => parseInt(tick+1),
    'year': tick => portugueseMonthSigs[ticks.indexOf(tick)]
  }
}

const dateObj = {
  'hour': entry => ({ 'hour': parseInt(entry.startTime.slice(0,2)), 'date': entry.date }),
  'day': entry => entry.date,
  'week': entry => ({
    'week': fullDateMap(entry.date).week,
    'year': fullDateMap(entry.date).year
  }),
  'month': entry => ({
    'month': fullDateMap(entry.date).month,
    'year': fullDateMap(entry.date).year
  }),
  'year': entry => fullDateMap(entry.date).year
}

function subsetFilters(date, key) {
  return {
    'hour': entry => parseInt(entry.startTime.slice(0,2)) == date.hour && entry.date == date.date,
    'day': entry => entry.date == date,
    'week': entry => fullDateMap(entry.date).week == date.week && fullDateMap(entry.date).year == date.year ,
    'month': entry => fullDateMap(entry.date).month == date.month && fullDateMap(entry.date).year == date.year ,
    'year': entry => fullDateMap(entry.date).year == date,
    }[key]
}

function objListAverage(objList, by) {
  var sum = 0
  objList.forEach(obj => sum += obj[by])
  return sum / objList.length
}

function objListVariance(objList, by) {
  const avg = objListAverage(objList, by)
  var sum = 0
  objList.forEach(obj => sum += (avg - obj[by])**2 )
  return sum / (objList.length - 1)
}

function equalObjects(obj1, obj2) {
  var equal = true
  if (typeof(obj1)!='object') {
    if (obj1!=obj2) equal = false
  } else {
    for (let key of Object.keys(obj1)) {
      if (obj1[key] != obj2[key]) {
        equal = false
      }
    }  
  }
  return equal
}

export function objListIncludes(objList, obj) {
  var includes = false
  for (let listObj of objList) {
    if (equalObjects(listObj, obj)) {
      includes=true
    }
  }
  return includes
}

function dateAverage(data, isVariance, key, date, period) {
  const firstDatePeriodDate = FullDates.filter(datePeriodFilters(date, period))[0].date
  let uniqueDates = []
  data.forEach(entry => {
    let uniqueDate = dateObj[key](entry)
    if (!objListIncludes(uniqueDates, uniqueDate)) uniqueDates.push(uniqueDate)
  })

  var avgData = []
  var index = 0
  const subsetSizeThreshold = isVariance ? 2 : 1
  uniqueDates.forEach(uniqueDate => {
    const dataSubset = data.filter(subsetFilters(uniqueDate, key))
    if (dataSubset.length >= subsetSizeThreshold) {
      const subsetAverage = isVariance
        ? objListVariance(dataSubset, 'y')
        : objListAverage(dataSubset, 'y')
      const thisSubsetFirstDate = FullDates.filter(datePeriodFilters({[key]: uniqueDate}, key))[0].date
      var time_d = dateDiff(firstDatePeriodDate, thisSubsetFirstDate)
      if (key=='hour') {
        time_d += uniqueDate['hour'] * 1/24
      }
      if (time_d > 0) {
        avgData.push({
          x: index,
          y: subsetAverage,
          time_d: time_d,
        })
        index += 1          
      }
    }
  })
  return avgData    
}

export function MoodLineTemporal({ data, temporal, interpolation, date, period, mode, secMode, thirdMode, setThirdMode }) {
  
  // Filter entries with non-empty startTime
  data = data.filter(entry => entry.startTime);

  // Calculate and append 'time(s)' and 'time(d)' variables to each entry
  data = appendTimeData(data, date, period, temporal=='atemporal');

  // Calculates and append averages by specified variable if average mode is active
  const isVariance = secMode=='variância'
  if (temporal=='temporal' && secMode!='sequência' && thirdMode) {
    data = dateAverage(data, isVariance, groupByMap[thirdMode], date, period)
  }

  // Sort entries by variable
  data = sortData(data, 'time_d');
  
  let x_domain, y_domain, xTickValues
  if (temporal=='temporal') {
    // Calculate x domain values based on selected period and date
    x_domain = x_domains(data, date, period)[mode]();
    y_domain = isVariance ? [0, 5.5] : [1, 5.5]
    // Calculate tick values based on selected period and date
    xTickValues = xTicks(date, period, mode);
  }

  // Defining chart styles
  const chartStyles = {
    chartPadding: {
      left: relativeToScreen(40),
      right: relativeToScreen(20),
      top: relativeToScreen(0),
      bottom: relativeToScreen( temporal=='temporal' ? 90 : 0 )
    },
    yAxis: {
      axis: { stroke: "#fff0" },
      grid: { stroke: styles.h1.color + '7' },
      tickLabels: {
        fontSize: relativeToScreen(17),
        padding: relativeToScreen(15),
        fill: styles.h1.color
      },
    },
    xAxis: {
      // parent: { padding: relativeToScreen(15) },
      grid: { stroke: "#fff0" },
      axis: { stroke: "#fff0" },
      axisLabel: {
        padding: relativeToScreen(!data[0] ? 45 : 65),
        fontSize: styles.h3.fontSize,
        fill: styles.h1.color,
        // padding: 0
      },
      ticks: {
        stroke: styles.h1.color + (!data[0] ? '0' : ''),
        size: relativeToScreen(10)
      },
      tickLabels: {
        fontSize: relativeToScreen(15),
        padding: relativeToScreen(0),
        fill: data[0] ? styles.h1.color : '#0000'
      },
    },
    line: {
      data: {
        stroke: styles.h1.color,
        strokeWidth: 3,
      },
    },
    scatter: {
      data: { fill: ({ datum }) => moodColorsHEX[Math.round(( isVariance ? - (datum.y-5) : datum.y )- 1)] }
    }
  }

  const chartProps = {
    'temporal': {
      height: relativeToScreen(isVariance ? 255 : 225),
      domain: { x: x_domain, y: y_domain },
      yAxisDomain: null,
    },
    'atemporal': {
      height: relativeToScreen(150),
      domain: {x: [ 0.6, data.length + 0.4 ], y: [0.5, 5.5]},
      yAxisDomain: [0.5, 5.5],
    }
  }
  
  const animate = useContext(UserContext).user.settings.enableAnimations

  return (
    <Victory.VictoryChart
    width={relativeToScreen(330)}
    height={chartProps[temporal].height}
    domain={chartProps[temporal].domain}
    padding={chartStyles.chartPadding}
    animate={ !animate ? null : {
      duration: 2000,
      onLoad: {duration: 1000}
    }}
    >
      <Victory.VictoryAxis
      dependentAxis
      // domain={[0.5, 5.5]}  // only for temporal chart maybe...
      domain={chartProps[temporal].yAxisDomain}  // only for temporal chart maybe...
      tickValues={range( isVariance ? 0 : 1 , 6, 1)}
      tickFormat={tick => parseInt(tick)}
      style={chartStyles.yAxis}
      />
      { temporal!='temporal' ? null : (
        <Victory.VictoryAxis
        label={data[0] ? xAxisLabel[period] : `Você não possui entradas ${period=='week' ? 'nessa' : 'nesse'} ${periodMap[period].toLowerCase()}.` }
        tickComponent={<Victory.LineSegment y1={relativeToScreen( isVariance ? 180 : 150 )} y2={relativeToScreen( isVariance ? 190 : 160 )} />}
        tickValues={data[0] ? xTickValues : null}
        tickFormat={data[0] ? tickFormats(xTickValues)[period] : null}
        tickLabelComponent={<Victory.VictoryLabel angle={-90} dx={relativeToScreen(-32)} dy={relativeToScreen(-8)} />}
        style={chartStyles.xAxis}
        />
      )}
      { interpolation == 'scatter' ? null : (
        <Victory.VictoryLine
        data={data}
        x='time_d' y='y'
        interpolation={interpolation}
        style={chartStyles.line}
        />
      )}
      <Victory.VictoryScatter
      data={data}
      x='time_d' y='y'
      size={['month', 'year'].includes(period) ? 4.5 : 5.7}
      style={chartStyles.scatter}
      />
    </Victory.VictoryChart>
  );
}
