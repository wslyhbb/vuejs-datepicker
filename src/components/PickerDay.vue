<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']"
       v-show="showDayView" :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader" />
    <picker-header
      :is-next-disabled="isNextMonthDisabled(pageTimestamp)"
      :is-previous-disabled="isPreviousMonthDisabled(pageTimestamp)"
      :is-rtl="isRtl"
      @pageChange="changePage($event)">
      <span class="day__month_btn" tabindex="0"
            :class="allowedToShowView('month') ? 'up' : ''"
            @click="showMonthCalendar">
            {{ isYmd ? currYearName : currMonthName }} {{ isYmd ? currMonthName : currYearName }}
      </span>
    </picker-header>
    <div :class="isRtl ? 'flex-rtl' : ''">
      <span class="cell day-header" v-for="d in daysOfWeek" :key="d.timestamp">{{ d }}</span>
      <template v-if="blankDays > 0">
        <span class="cell day blank" v-for="d in blankDays" :key="d.timestamp"></span>
      </template>
      <span class="cell day" tabindex="0"
          v-for="day in days"
          :key="day.timestamp"
          :class="dayClasses(day)"
          v-html="dayCellContent(day)"
          @click="selectDate(day)"
          @keypress.enter="selectDate(day)"
          @keypress.space="selectDate(day)"></span>
    </div>
  </div>
</template>

<script>
import PickerHeader from './PickerHeader.vue'
import { makeDateUtils, rtlLangs, langYearSuffix, ymdLangs } from '../utils/DateUtils'

export default {
  name: 'PickerDay',
  components: {
    PickerHeader
  },
  props: {
    allowedToShowView: Function,
    calendarClass: [String, Object, Array],
    calendarStyle: {
      type: Object
    },
    dayCellContent: {
      type: Function,
      default: day => day.date
    },
    disabledDates: {
      type: Object
    },
    firstDayOfWeek: {
      type: String
    },
    highlighted: {
      type: Object,
      default () {
        return {}
      }
    },
    language: {
      type: Object
    },
    mondayFirst: Boolean,
    pageDate: Date,
    pageTimestamp: Number,
    selectedDate: Date,
    showDayView: Boolean,
    showFullMonthName: {
      type: Boolean,
      default: false
    },
    twoLetterAbbr: {
      type: Boolean,
      default: false
    },
    useUtc: Boolean
  },
  data () {
    const constructedDateUtils = makeDateUtils(this.useUtc, this.language)
    return {
      utils: constructedDateUtils
    }
  },
  watch: {
    language (newLanguage) {
      this.utils = makeDateUtils(this.useUtc, newLanguage)
    },
    useUtc (newUtc) {
      this.utils = makeDateUtils(newUtc, this.language)
    }
  },
  computed: {
    isRtl () {
      return rtlLangs.indexOf(this.language) !== -1
    },
    /**
     * Returns an array of day names
     * @return {String[]}
     */
    daysOfWeek () {
      return this.utils.getDaysStartingOn(this.firstDayOfWeekNumber, this.twoLetterAbbr)
    },
    /**
     * Returns first-day-of-week as a number (Sunday is 0)
     * @return {Number}
     */
    firstDayOfWeekNumber () {
      if (this.mondayFirst) {
        return 1
      } else if (this.firstDayOfWeek) {
        return this.utils.getDayFromAbbr(this.firstDayOfWeek)
      } else {
        return 0
      }
    },
    /**
     * Returns the day number of the week less one for the first of the current month
     * Used to show amount of empty cells before the first in the day calendar layout
     * @return {Number}
     */
    blankDays () {
      const dObj = this.newPageDate()
      if (this.mondayFirst) {
        return (6 + this.utils.getDay(dObj)) % 7
      }
      return (7 - this.firstDayOfWeekNumber + this.utils.getDay(dObj)) % 7
    },
    /**
     * @return {Object[]}
     */
    days () {
      const days = []
      const dObj = this.newPageDate()
      const daysInMonth = this.utils.daysInMonth(
        this.utils.getFullYear(dObj), this.utils.getMonth(dObj))
      for (let i = 0; i < daysInMonth; i++) {
        days.push({
          date: this.utils.getDate(dObj),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedDate(dObj),
          isDisabled: this.isDisabledDate(dObj),
          isHighlighted: this.isHighlightedDate(dObj),
          isHighlightStart: this.isHighlightStart(dObj),
          isHighlightEnd: this.isHighlightEnd(dObj),
          isToday: this.utils.compareDates(dObj, new Date()),
          isWeekend: this.utils.getDay(dObj) === 0 || this.utils.getDay(dObj) === 6,
          isSaturday: this.utils.getDay(dObj) === 6,
          isSunday: this.utils.getDay(dObj) === 0
        })
        this.utils.setDate(dObj, this.utils.getDate(dObj) + 1)
      }
      return days
    },
    /**
     * Gets the name of the month the current page is on
     * @return {String}
     */
    currMonthName () {
      return this.utils.getMonthNameAbbr(this.pageDate)
    },
    /**
     * Gets the name of the year that current page is on
     * @return {Number}
     */
    currYearName () {
      const yearSuffix = langYearSuffix[this.language] || ''
      return `${this.utils.getFullYear(this.pageDate)}${yearSuffix}`
    },
    /**
     * Is this language using year/month/day format?
     * @return {Boolean}
     */
    isYmd () {
      return ymdLangs.indexOf(this.language) !== -1
    }
  },
  methods: {
    selectDate (date) {
      if (date.isDisabled) {
        this.$emit('selectedDisabled', date)
        return false
      }
      this.$emit('selectDate', date)
    },
    /**
     * @return {Number}
     */
    getPageMonth () {
      return this.utils.getMonth(this.pageDate)
    },
    /**
     * Emit an event to show the month picker
     */
    showMonthCalendar () {
      this.$emit('showMonthCalendar')
    },
    /**
     * Change the page month
     * @param {Number} incrementBy
     */
    changeMonth (incrementBy) {
      const date = this.pageDate
      this.utils.setMonth(date, this.utils.getMonth(date) + incrementBy)
      this.$emit('changedMonth', date)
    },
    /**
     * Is the previous month disabled?
     * @return {Boolean}
     */
    isPreviousMonthDisabled () {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false
      }
      const d = this.pageDate
      return this.utils.getMonth(this.disabledDates.to) >= this.utils.getMonth(d) &&
        this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(d)
    },
    /**
     * Changes the page up or down
     * @param {Number} incrementBy
     */
    changePage ({ incrementBy }) {
      if (incrementBy === 1) {
        if (!this.isNextMonthDisabled()) {
          this.changeMonth(incrementBy)
        }
      } else if (incrementBy === -1) {
        if (!this.isPreviousMonthDisabled()) {
          this.changeMonth(incrementBy)
        }
      }
    },
    /**
     * Is the next month disabled?
     * @return {Boolean}
     */
    isNextMonthDisabled () {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false
      }
      const d = this.pageDate
      return this.utils.getMonth(this.disabledDates.from) <= this.utils.getMonth(d) &&
        this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(d)
    },
    /**
     * Whether a day is selected
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedDate (dObj) {
      return this.selectedDate && this.utils.compareDates(this.selectedDate, dObj)
    },
    /**
     * Whether a day is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledDate (date) {
      let disabledDates = false

      if (typeof this.disabledDates === 'undefined') {
        return false
      }

      if (typeof this.disabledDates.dates !== 'undefined') {
        this.disabledDates.dates.forEach((d) => {
          if (this.utils.compareDates(date, d)) {
            disabledDates = true
            return true
          }
        })
      }
      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to && date < this.disabledDates.to) {
        disabledDates = true
      }
      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from && date > this.disabledDates.from) {
        disabledDates = true
      }
      if (typeof this.disabledDates.ranges !== 'undefined') {
        this.disabledDates.ranges.forEach((range) => {
          if (typeof range.from !== 'undefined' && range.from && typeof range.to !== 'undefined' && range.to) {
            if (date < range.to && date > range.from) {
              disabledDates = true
              return true
            }
          }
        })
      }
      if (typeof this.disabledDates.days !== 'undefined' && this.disabledDates.days.indexOf(this.utils.getDay(date)) !== -1) {
        disabledDates = true
      }
      if (typeof this.disabledDates.daysOfMonth !== 'undefined' && this.disabledDates.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
        disabledDates = true
      }
      if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
        disabledDates = true
      }
      return disabledDates
    },
    /**
     * Whether a day is highlighted (only if it is not disabled already except when highlighted.includeDisabled is true)
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightedDate (date) {
      if (!(this.highlighted && this.highlighted.includeDisabled) && this.isDisabledDate(date)) {
        return false
      }

      let highlighted = false

      if (typeof this.highlighted === 'undefined') {
        return false
      }

      if (typeof this.highlighted.dates !== 'undefined') {
        this.highlighted.dates.forEach((d) => {
          if (this.utils.compareDates(date, d)) {
            highlighted = true
            return true
          }
        })
      }

      if (this.isDefined(this.highlighted.from) && this.isDefined(this.highlighted.to)) {
        highlighted = date >= this.highlighted.from && date <= this.highlighted.to
      }

      if (typeof this.highlighted.days !== 'undefined' && this.highlighted.days.indexOf(this.utils.getDay(date)) !== -1) {
        highlighted = true
      }

      if (typeof this.highlighted.daysOfMonth !== 'undefined' && this.highlighted.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
        highlighted = true
      }

      if (typeof this.highlighted.customPredictor === 'function' && this.highlighted.customPredictor(date)) {
        highlighted = true
      }

      return highlighted
    },
    dayClasses (day) {
      return {
        selected: day.isSelected,
        disabled: day.isDisabled,
        highlighted: day.isHighlighted,
        today: day.isToday,
        weekend: day.isWeekend,
        sat: day.isSaturday,
        sun: day.isSunday,
        'highlight-start': day.isHighlightStart,
        'highlight-end': day.isHighlightEnd
      }
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightStart (date) {
      return this.isHighlightedDate(date) &&
        (this.highlighted.from instanceof Date) &&
        (this.utils.getFullYear(this.highlighted.from) === this.utils.getFullYear(date)) &&
        (this.utils.getMonth(this.highlighted.from) === this.utils.getMonth(date)) &&
        (this.utils.getDate(this.highlighted.from) === this.utils.getDate(date))
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightEnd (date) {
      return this.isHighlightedDate(date) &&
        (this.highlighted.to instanceof Date) &&
        (this.utils.getFullYear(this.highlighted.to) === this.utils.getFullYear(date)) &&
        (this.utils.getMonth(this.highlighted.to) === this.utils.getMonth(date)) &&
        (this.utils.getDate(this.highlighted.to) === this.utils.getDate(date))
    },
    /**
     * Helper
     * @param  {mixed}  prop
     * @return {Boolean}
     */
    isDefined (prop) {
      return typeof prop !== 'undefined' && prop
    },
    /**
     * Set up a new date object to the first day of the current 'page'
     * @return Date
     */
    newPageDate () {
      const d = this.pageDate
      return this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
        : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
    }
  }
}
</script>
