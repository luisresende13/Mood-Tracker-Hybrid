// 1. Imports

import dateRange from "./dateRange"

// 2. Definitions

const monthDict = {
  'Jan': '01', 'Feb': '02', 'Mar': '03',
  'Apr': '04', 'May': '05', 'Jun': '06',
  'Jul': '07', 'Ago': '08', 'Sep': '09',
  'Oct': '10', 'Nov': '11', 'Dec': '12'
}

export function Today() {
    const now = new Date().toString().split(' ')
    const today = [ now[3], monthDict[now[1]], now[2] ].join('-')
    return today
}

export function oneDigit(stringNumber) {
    if (stringNumber[0] == '0') return stringNumber.slice(1, stringNumber.length)
    else return stringNumber
}

export function getNextDate(date, next='next') {
    const nextDate = dateRange[dateRange.indexOf(date) + (next=='previous' ? -1 : 1)]
    return nextDate
}

function getUniqueYears() {
    var uniqueYears = []
  for (let date of dateRange) {
    let year = date.slice(0,4)
    if (!uniqueYears.includes(year)) {
      uniqueYears.push(year)
    }
  }
  return uniqueYears
}

function fullDates() {
  var dates = []
  var currentYear = getUniqueYears()[0]
  var currentWeek = 1
  for (let date of dateRange) {
    const dateObj = new Date(date)
    var newDate = {
      date: date,
      day: parseInt(oneDigit(date.slice(8,10))),
      weekday: dateObj.getDay(),
      week: null ,
      month: parseInt(oneDigit(date.slice(5,7))),
      year: parseInt(date.slice(0,4)),
    }

    if (newDate.year != currentYear) {
      currentYear = newDate.year
      currentWeek = 1
    } else {
      if (newDate.weekday==0) {
        currentWeek += 1
      }
    }
    newDate.week = currentWeek
    dates.push(newDate)
  }
  return dates
}

function getWeeks() {
  const FullDates = fullDates()
  var weeks = [ {week: FullDates[0].week, year: FullDates[0].year} ]
  for (let fullDate of FullDates) {
    if ( fullDate.week != weeks[weeks.length-1].week ) {
      weeks.push({
          week: fullDate.week,
          year: fullDate.year
      })
    }
  }
  return weeks
}

export function getMonths() {
  const FullDates = fullDates()
  var months = [ {month: FullDates[0].month, year: FullDates[0].year} ]
  for (let fullDate of FullDates) {
      if ( fullDate.month != months[months.length-1].month ) {
      months.push({
        month: fullDate.month,
        year: fullDate.year
      })
    }
  }
  return months
}

export const Years = getUniqueYears()
export const FullDates = fullDates()
export const Weeks = getWeeks()
export const Months = getMonths()

export function fullDateMap(date) {
  return FullDates[dateRange.indexOf(date)]
}

export function current(period) {
  return fullDateMap(Today())[period]
}

export const dateCollections = {
  'day': dateRange,
  'week': Weeks,
  'month': Months,
  'year': Years
  }
  
export function getNext(date, next='next', period) {
  const dateCollection = dateCollections[period]
  const nDates = dateCollection.length
  var currentIndex
  if (['day', 'year'].includes(period))
    currentIndex = dateCollection.indexOf(date.toString())
  else {
    dateCollection.forEach((collDate, index) => {
    if (collDate[period]==date[period] && collDate.year==date.year )
      currentIndex = index
    })
  }
  const lastDateIndex = next=='next' ? nDates-1 : 0
  const isInLastDateIndex = currentIndex==lastDateIndex
  const nextIndex = isInLastDateIndex
  ? ( next=='next' ? 0 : nDates-1 )
  : currentIndex + (next=='next' ? 1 : -1)

  return dateCollection[nextIndex]
}

export const intWeekDayMap = {
  0: 'Seg',
  1: 'Ter',
  2: 'Qua',
  3: 'Qui',
  4: 'Sex',
  5: 'Sab',
  6: 'Dom',
}

export const portugueseMonthSigs = [
  'Jan', 'Fev', 'Mar', 'Abr',
  'Mai', 'Jun', 'Jul', 'Ago',
  'Set', 'Out', 'Nov', 'Dez'
]

export function formatDate(date) {
  const newDate = new Date(date)
  const weekday = intWeekDayMap[newDate.getDay()]
  const day = parseInt(oneDigit(date.slice(8,10)))
  const month = portugueseMonthSigs[parseInt(oneDigit(date.slice(5,7)))-1]
  var prefix
  if (date === Today()) prefix = 'Hoje, '
  else if (date === getNextDate(Today(), 'previous')) prefix = 'Ontem, '
  else prefix = weekday + ', '
  return prefix + day + ' ' + month  
}

export function formatWeek(date) {
  const thisWeek = {week: current('week'), year: current('year')}
  const lastWeek = getNext(thisWeek, 'previous', 'week')
  const isThisWeek = date.week==thisWeek.week && date.year==thisWeek.year
  const isLastWeek = date.week==lastWeek.week && date.year==lastWeek.year
  if (isThisWeek) return `Esta semana, ${date.year}`
  else if (isLastWeek) return `Semana passada, ${date.year}`
  else return `Semana ${date.week}, ${date.year}`
}

export function formatMonth(date) {
  const thisMonth = {month: current('month'), year: current('year')}
  const lastMonth = getNext(thisMonth, 'previous', 'month')
  const isThisMonth = date.month==thisMonth.month && date.year==thisMonth.year
  const isLastMonth = date.month==lastMonth.month && date.year==lastMonth.year
  const month = portugueseMonthSigs[date.month-1]
  if (isThisMonth) return `Este mês, ${month} ${date.year}`
  else if (isLastMonth) return `Mês passado, ${month} ${date.year}`
  else return `${month}, ${date.year}`
}

export const formatPeriodDate = {
  'day': formatDate,
  'week': formatWeek,
  'month': formatMonth,
  'year': date => `Ano ${date}`
}

export function datePeriodFilters(date, period) {
  return {
    'hour': entry => entry.date == date[period].date,
    'day': entry => entry.date == date[period],
    'week': entry => fullDateMap(entry.date).week==date[period].week && fullDateMap(entry.date).year==date[period].year,
    'month': entry => fullDateMap(entry.date).month==date[period].month && fullDateMap(entry.date).year==date[period].year,
    'year': entry => fullDateMap(entry.date).year==date[period]
  }[period]
}

export function dateDiff(date0, date1) {
  return ((new Date(date1)) - (new Date(date0))) / (1000*60*60*24) // Date difference in days
}

function yearTicks() {
  const firstDayOfEachMonth = FullDates.filter(datePeriodFilters({'year': 2021}, 'year')).filter(date => date.day==1)
  const firstDayOfTheYear = firstDayOfEachMonth.filter(fullDate => fullDate.day == 1 && fullDate.month == 1 )[0].date
  return firstDayOfEachMonth.map(fullDate => dateDiff(firstDayOfTheYear, fullDate.date))
}

export const YearTicks = yearTicks()