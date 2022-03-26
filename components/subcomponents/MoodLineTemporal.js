import React from 'react';
import Victory from '../victory';
import { relativeToScreen } from '../../styles/loginStyles';
import { moodColorsHEX } from '../PostEntryComponent';
import { FullDates, intWeekDayMap, portugueseMonthSigs, YearTicks, datePeriodFilters, fullDateMap, dateDiff } from '../../shared/dates';
import { stats, styles } from '../Charts';

function stringTimeToSec(time) { // Expects 'hh:mm:ss' string format
  return parseInt(time.slice(0,2))*3600 + parseInt(time.slice(3,5))*60 + parseInt(time.slice(6,8))
}

export function appendTimeData(data, date, period) {
  var datePeriodDates = FullDates.filter(datePeriodFilters(date, period))
  var time_s, time_d
  data.forEach((entry, index) => {
    const dateDifDays = ((new Date(entry.date)) - (new Date(datePeriodDates[0].date))) / (1000*60*60*24)
    time_s = stringTimeToSec(entry.startTime)
    time_d = dateDifDays + time_s / (60*60*24)
    data[index]['time_s'] = time_s
    data[index]['time_d'] = time_d
  })
 return data
}

export function sortData(data, by='time_s') {
  return data.sort((a, b) => {
    return a[by] - b[by];
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
  let interval = ['enquadrar', 'enforcar'].includes(mode) ? 1 : 2
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
    if (x_lim[0] < 0) x_lim[0] = 0
    return x_lim
  } else if (data[0]) {
    return [data[0][by] * 3 / 4, data[0][by] * 1.25]
  } else {
    return [0,1]
  }
}

function x_domains(data, date, period) {
  return {
  'expandir': () => expandDomains(date, period),
  'enquadrar': () => getDomain(data, 'time_d', 0.1),
  'enforcar': () => getDomain(data, 'time_d', 0),
  }
};

const xAxisLabel = {
  'day': 'Horário',
  'week': 'Dia da semana',
  'month': 'Dia do mês',
  'year': 'Mês'
}

function tickFormats(ticks) {
  return {
    'day' : tick => Math.round(tick*24) + 'h',
    'week': tick => intWeekDayMap[tick],
    'month': tick => tick+1,
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
  console.log(typeof(obj1))
  var equal = true
  if (typeof(obj1)!='object') {
    if (obj1!=obj2) equal = false
  }
  else {
    for (let key of Object.keys(obj1)) {
      if (obj1[key] != obj2[key]) {
        equal = false
      }
    }  
  }
  return equal
}

function objListIncludes(objList, obj) {
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
  data.map(entry => {
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
      const thisDatePeriodDate = FullDates.filter(datePeriodFilters({[key]: uniqueDate}, key))[0].date
      var time_d = dateDiff(firstDatePeriodDate, thisDatePeriodDate)
      if (key=='hour') {
        time_d += uniqueDate['hour'] * 1/24
      }
      avgData.push({
        x: index,
        y: subsetAverage,
        time_d: time_d,
      })
      index += 1
    }
  })
  return avgData    
}

const statsMap = {
  'sequencial': 'sequencial',
  'Média (hora)': 'hour', 
  'Média (dia)': 'day',
  'Média (semana)': 'week',
  'Média (mês)': 'month',
  'Variância (hora)': 'hour',
  'Variância (dia)': 'day',
  'Variância (semana)': 'week',
  'Variância (mês)': 'month',
}

export function MoodLineTemporal({ data, interpolation, date, period, mode, secMode }) {
  
  // Filter entries with non-empty startTime
  data = data.filter(entry => entry.startTime);

  // Calculate and append 'time(s)' and 'time(d)' variables to each entry
  data = appendTimeData(data, date, period);

  // Calculates and append averages by specified variable if average mode is active
  const isVariance = stats.slice(stats.length-4, stats.length).includes(secMode)
  if (secMode!='sequencial') data = dateAverage(data, isVariance, statsMap[secMode], date, period) 

  // Sort entries by variable
  const by = 'time_d';
  data = sortData(data, by);
  
  // Calculate tick values based on selected period and date
  const xTickValues = xTicks(date, period, mode);

  // Calculate x domain values based on selected period and date
  const x_domain = x_domains(data, date, period)[mode]();
  const y_domain = isVariance ? [0, 5.5] : [1, 5.5]

  const chartStyles = {
    yAxis: {
      axis: { stroke: "#fff0" },
      grid: { stroke: styles.h1.color + '7' },
      tickLabels: { fontSize: relativeToScreen(17), padding: relativeToScreen(15), fill: styles.h1.color },
    },
    xAxis: {
      // parent: { padding: relativeToScreen(15) },
      grid: { stroke: "#fff0" },
      axis: { stroke: "#fff0" },
      axisLabel: {
        width: '70%',
        padding: relativeToScreen(!data[0] ? 35 : 65),
        fontSize: styles.h3.fontSize,
        fill: styles.h1.color,
        // padding: 0
      },
      ticks: { stroke: styles.h1.color + (!data[0] ? '0' : ''), size: relativeToScreen(10) },
      tickLabels: { fontSize: relativeToScreen(15), padding: relativeToScreen(0), fill: data[0] ? styles.h1.color : '#0000' },
    },
    line: {
      data: {
        stroke: styles.h1.color,
        strokeWidth: 3,
      },
    },
    scatter: {
      data: { fill: ({ datum }) => moodColorsHEX[Math.round(datum.y - 1)] }
    }
  }

  const chartPaddings = {
    chart: { left: relativeToScreen(40), right: relativeToScreen(20), top: relativeToScreen(0), bottom: relativeToScreen(90) }
  }

  return (
    <Victory.VictoryChart
    width={relativeToScreen(330)}
    height={relativeToScreen(isVariance ? 255 : 225)}
    padding={chartPaddings.chart}
    domain={{ x: x_domain, y: y_domain }}
    >
      <Victory.VictoryAxis
      dependentAxis
      tickValues={range( isVariance ? 0 : 1, 6, 1)}
      tickFormat={tick => parseInt(tick)}
      style={chartStyles.yAxis}
        />
      <Victory.VictoryAxis
      label={data[0] ? xAxisLabel[period] : 'Você não possui entradas nesse período.' }
      tickComponent={<Victory.LineSegment y1={relativeToScreen( isVariance ? 180 : 150 )} y2={relativeToScreen( isVariance ? 190 : 160 )} />}
      tickValues={data[0] ? xTickValues : null}
      tickFormat={data[0] ? tickFormats(xTickValues)[period] : null}
      tickLabelComponent={<Victory.VictoryLabel angle={-90} dx={relativeToScreen(-32)} dy={relativeToScreen(-8)} />}
      style={chartStyles.xAxis}
    />
      { interpolation == 'scatter' ? null : (
        <Victory.VictoryLine
        data={data}
        x={by} y='y'
        interpolation={interpolation}
        style={chartStyles.line}
        />
      )}
      <Victory.VictoryScatter
      data={data}
      x={by} y='y'
      size={['month', 'year'].includes(period) ? 4.5 : 5.7}
      style={chartStyles.scatter}
      />
    </Victory.VictoryChart>
  );
}
