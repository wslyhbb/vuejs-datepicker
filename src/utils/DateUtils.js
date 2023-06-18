import { toDate, format, setMonth, setDay, parse } from 'date-fns'
import { enUS } from 'date-fns/locale'

const utils = {
  /**
   * @type {Boolean}
   */
  useUtc: false,
  /**
   * @type {Locale}
   */
  language: enUS,
  /**
   * Returns the full year, using UTC or not
   * @param {Date} date
   */
  getFullYear (date) {
    return this.useUtc ? date.getUTCFullYear() : date.getFullYear()
  },

  /**
   * Returns the month, using UTC or not
   * @param {Date} date
   */
  getMonth (date) {
    return this.useUtc ? date.getUTCMonth() : date.getMonth()
  },

  /**
   * Returns the number of days in the month, using UTC or not
   * @param {Date} date
   */
  getDaysInMonth (date) {
    return this.daysInMonth(this.getFullYear(date), this.getMonth(date))
  },

  /**
   * Returns the date, using UTC or not
   * @param {Date} date
   */
  getDate (date) {
    return this.useUtc ? date.getUTCDate() : date.getDate()
  },

  /**
   * Returns the day, using UTC or not
   * @param {Date} date
   */
  getDay (date) {
    return this.useUtc ? date.getUTCDay() : date.getDay()
  },

  /**
   * Returns the hours, using UTC or not
   * @param {Date} date
   */
  getHours (date) {
    return this.useUtc ? date.getUTCHours() : date.getHours()
  },

  /**
   * Returns the minutes, using UTC or not
   * @param {Date} date
   */
  getMinutes (date) {
    return this.useUtc ? date.getUTCMinutes() : date.getMinutes()
  },

  /**
   * Sets the full year, using UTC or not
   * @param {Date} date
   * @param {String, Number} value
   */
  setFullYear (date, value) {
    return this.useUtc ? date.setUTCFullYear(value) : date.setFullYear(value)
  },

  /**
   * Sets the month, using UTC or not
   * @param {Date} date
   * @param {String, Number} value
   */
  setMonth (date, value) {
    return this.useUtc ? date.setUTCMonth(value) : date.setMonth(value)
  },

  /**
   * Sets the date, using UTC or not
   * @param {Date} date
   * @param {String, Number} value
   */
  setDate (date, value) {
    return this.useUtc ? date.setUTCDate(value) : date.setDate(value)
  },

  /**
   * Check if date1 is equivalent to date2, without comparing the time
   * @see https://stackoverflow.com/a/6202196/4455925
   * @param {Date} date1
   * @param {Date} date2
   */
  compareDates (date1, date2) {
    const d1 = new Date(date1.getTime())
    const d2 = new Date(date2.getTime())

    if (this.useUtc) {
      d1.setUTCHours(0, 0, 0, 0)
      d2.setUTCHours(0, 0, 0, 0)
    } else {
      d1.setHours(0, 0, 0, 0)
      d2.setHours(0, 0, 0, 0)
    }
    return d1.getTime() === d2.getTime()
  },

  /**
   * Validates a date object
   * @param {Date} date - an object instantiated with the new Date constructor
   * @return {Boolean}
   */
  isValidDate (date) {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      return false
    }
    return !isNaN(date.getTime())
  },

  /**
   * Return abbreviated week day name
   * @param {Date} date
   * @return {String}
   */
  getDayNameAbbr (date) {
    if (typeof date !== 'object') {
      throw TypeError('Invalid Type')
    }
    return format(date, 'ccc', { locale: this.language })
  },

  /**
   * Return day number from abbreviated week day name
   * @param {String} abbr
   * @return {Number}
   */
  getDayFromAbbr (abbr) {
    const now = new Date()
    const dates = [0, 1, 2, 3, 4, 5, 6]
    let days = dates.map((day) => format(
      setDay(now, day), 'ccc',
      { locale: enUS }))
    for (let i = 0; i < days.length; i++) {
      if (abbr.toLowerCase() === days[i].toLowerCase()) {
        return i
      }
    }

    // check if day is in language days
    if (this.language !== enUS) {
      days = dates.map((day) => format(
        setDay(now, day), 'ccc',
        { locale: this.language }))
      for (let i = 0; i < days.length; i++) {
        if (abbr.toLowerCase() === days[i].toLowerCase()) {
          return i
        }
      }
    }

    throw TypeError('Invalid week day')
  },

  /**
   * Return name of the month
   * @param {Number|Date} date
   * @return {String}
   */
  getMonthName (date) {
    if (typeof date === 'object') {
      return format(date, 'LLLL', { locale: this.language })
    }
    if (typeof date === 'number') {
      return format(setMonth(new Date(), date), 'LLLL', { locale: this.language })
    }
    throw TypeError('Invalid type')
  },

  /**
   * Return an abbreviated version of the month
   * @param {Number|Date} date
   * @return {String}
   */
  getMonthNameAbbr (date) {
    if (typeof date === 'object') {
      return format(date, 'LLL', { locale: this.language })
    }
    if (typeof date === 'number') {
      return format(setMonth(new Date(), date), 'LLL', { locale: this.language })
    }
    throw TypeError('Invalid type')
  },

  /**
   * Alternative get total number of days in month
   * @param {Number} year
   * @param {Number} month
   * @return {Number}
   */
  daysInMonth (year, month) {
    return /8|3|5|10/.test(month) ? 30 : month === 1 ? (!(year % 4) && year % 100) || !(year % 400) ? 29 : 28 : 31
  },

  /**
   * Get nth suffix for date
   * @param {Number} day
   * @return {String}
   */
  getNthSuffix (day) {
    switch (day) {
      case 1:
      case 21:
      case 31:
        return 'st'
      case 2:
      case 22:
        return 'nd'
      case 3:
      case 23:
        return 'rd'
      default:
        return 'th'
    }
  },

  /**
   * Return abbreviated week day name
   * @param {Number} firstDayOfWeek
   * @param {Boolean} twoLetter
   * @returns {Array}
   */
  getDaysStartingOn (firstDayOfWeek, twoLetter = false) {
    const now = new Date()
    const dates = [0, 1, 2, 3, 4, 5, 6]
    let formatString = 'ccc'
    if (twoLetter) {
      formatString = 'cccccc'
    }
    return dates.map((day) => format(
      setDay(now, day + firstDayOfWeek),
      formatString,
      { locale: this.language }
    ))
  },

  /**
   * Formats date object
   * @param {Date} date
   * @param {String} formatString
   * @return {String}
   */
  formatDate (date, formatString) {
    return format(date, formatString, { locale: this.language })
  },

  /**
   * Parses a date from a string
   * @param {String}          dateStr
   * @param {Strin}           formatString
   * @return {Date}
   */
  parseDate (dateValue, formatString = 'yyyy-MM-dd') {
    if (typeof dateValue === 'string') {
      return parse(dateValue, formatString, new Date(), { locale: this.language })
    } else if (typeof dateValue === 'number') {
      return toDate(dateValue)
    }
  },

  /**
   * method used as a prop validator for input values
   * @param {*} val
   * @return {Boolean}
   */
  validateDateInput (val) {
    return val === null || val instanceof Date || typeof val === 'string' || typeof val === 'number'
  },

  /**
   * Remove hours/minutes/seconds/milliseconds from a date object
   * @param {Date} date
   * @return {Date}
   */
  resetDateTime (date) {
    return new Date(
      this.useUtc ? date.setUTCHours(0, 0, 0, 0) : date.setHours(0, 0, 0, 0)
    )
  },

  /**
   * Return a new date object with hours/minutes/seconds/milliseconds removed.
   * Defaults to today's date, if no parameter is provided
   * @param {Date=} date
   * @return {Date}
   */
  getNewDateObject (date) {
    return date
      ? this.resetDateTime(new Date(date))
      : this.resetDateTime(new Date())
  }
}

export const makeDateUtils = (useUtc = false, language = enUS) => {
  return { ...utils, useUtc, language }
}

export default {
  ...utils
}

/** special cases to keep backwards compatibilty for older vue js datepicker versions */
// 1. right to left languages
export const rtlLangs = ['dv', 'fa', 'ha', 'he', 'kwh', 'ks', 'ku', 'ps', 'ur', 'yi']

// 2. translation using year/month/day format
export const ymdLangs = ['ja', 'lt', 'mn', 'ko']

// 3. special year suffix
export const langYearSuffix = {
  zh: '年',
  ja: '年',
  ko: '년'
}
