<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']"
       v-show="visible" :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader" />
    <picker-header
      :bootstrap-styling="bootstrapStyling"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      @pageChange="changePage($event)">
      <button class="day__month_btn"
            :class="{ 'up': !isUpDisabled, 'btn': bootstrapStyling }"
            :disabled="isUpDisabled"
            @click="$emit('setView', 'month')">
        {{ pageTitleDay }}
      </button>
    </picker-header>
    <div :class="{ 'flex-rtl': isRtl }">
      <span class="cell day-header" v-for="d in daysOfWeek" :key="d.timestamp">{{ d }}</span>
      <picker-cells
        ref="cells"
        v-slot="{ cell }"
        :cells="days"
        :show-edge-dates="showEdgeDates"
        view="day"
        @select="select($event)">
        {{ dayCellContent(cell) }}
      </picker-cells>
    </div>
  </div>
</template>

<script>
import PickerHeader from './PickerHeader.vue'
import PickerCells from './PickerCells.vue'
import pickerMixin from '@/mixins/pickerMixin.js'
import { langYearSuffix, ymdLangs } from '../utils/DateUtils'
import DisabledDate from '@/utils/DisabledDate'
import HighlightedDate from '@/utils/HighlightedDate'

export default {
  name: 'PickerDay',
  components: { PickerHeader, PickerCells },
  mixins: [pickerMixin],
  props: {
    dayCellContent: {
      type: Function,
      default: (day) => day.date
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
    mondayFirst: {
      type: Boolean,
      default: false
    },
    showEdgeDates: {
      type: Boolean,
      default: false
    },
    showFullMonthName: {
      type: Boolean,
      default: false
    },
    twoLetterAbbr: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    /**
     * Gets the name of the month the current page is on
     * @return {String}
     */
    currMonthName () {
      return this.showFullMonthName
        ? this.utils.getMonthName(this.pageMonth)
        : this.utils.getMonthNameAbbr(this.pageMonth)
    },
    /**
     * Gets the name of the year that current page is on
     * @return {String}
     */
    currYearName () {
      const yearSuffix = langYearSuffix[this.language] || ''
      return `${this.pageYear}${yearSuffix}`
    },
    /**
     * @return {Object[]}
     */
    days () {
      const days = []
      const daysInCalendar =
        this.daysFromPrevMonth + this.daysInMonth + this.daysFromNextMonth
      const dObj = this.firstDayCellDate()

      for (let i = 0; i < daysInCalendar; i++) {
        days.push(this.makeDay(dObj))
        this.utils.setDate(dObj, this.utils.getDate(dObj) + 1)
      }

      return days
    },
    /**
     * Calculates how many days to show from the next month
     * @return {number}
     */
    daysFromNextMonth () {
      const daysThisAndPrevMonth = this.daysFromPrevMonth + this.daysInMonth
      return (Math.ceil(daysThisAndPrevMonth / 7) * 7) - daysThisAndPrevMonth
    },
    /**
     * Calculates how many days to show from the previous month
     * @return {number}
     */
    daysFromPrevMonth () {
      const firstOfMonthDayNumber = this.utils.getDay(this.pageDate)
      return (7 - this.firstDayOfWeekNumber + firstOfMonthDayNumber) % 7
    },
    /**
     * Returns the number of days in this month
     * @return {String[]}
     */
    daysInMonth () {
      return this.utils.getDaysInMonth(this.pageDate)
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
     * The first day of the next page's month.
     * @return {Date}
     */
    firstOfNextMonth () {
      const d = new Date(this.pageDate)
      return new Date(this.utils.setMonth(d, this.utils.getMonth(d) + 1))
    },
    /**
     * Is the next month disabled?
     * @return {Boolean}
     */
    isNextDisabled () {
      if (!this.disabledConfig.has.from) {
        return false
      }
      return this.disabledConfig.from.month <= this.pageMonth &&
        this.disabledConfig.from.year <= this.pageYear
    },
    /**
     * Is the previous month disabled?
     * @return {Boolean}
     */
    isPreviousDisabled () {
      if (!this.disabledConfig.has.to) {
        return false
      }
      return this.disabledConfig.to.month >= this.pageMonth &&
        this.disabledConfig.to.year >= this.pageYear
    },
    /**
     * Returns the current page's month as an integer.
     * @return {Number}
     */
    pageMonth () {
      return this.utils.getMonth(this.pageDate)
    },
    /**
     * Display the current page's month & year as the title.
     * @return {String}
     */
    pageTitleDay () {
      return ymdLangs.indexOf(this.language.code) !== -1
        ? `${this.currYearName} ${this.currMonthName}`
        : `${this.currMonthName} ${this.currYearName}`
    }
  },
  methods: {
    /**
     * Set up a new date object to the first day of the current 'page'
     * @return {Date}
     */
    firstDayCellDate () {
      const pageDate = new Date(this.pageDate)

      return new Date(this.utils.setDate(pageDate, 1 - this.daysFromPrevMonth))
    },
    /**
     * Change the page month
     * @param {Number} incrementBy
     */
    changeMonth (incrementBy) {
      const date = this.pageDate
      this.utils.setMonth(date, this.utils.getMonth(date) + incrementBy)
      this.$emit('pageChange', date)
    },
    /**
     * Changes the page up or down
     * @param {Number} incrementBy
     */
    changePage ({ incrementBy }) {
      if (incrementBy === 1) {
        if (!this.isNextDisabled) {
          this.changeMonth(incrementBy)
        }
      } else if (incrementBy === -1) {
        if (!this.isPreviousDisabled) {
          this.changeMonth(incrementBy)
        }
      }
    },
    /**
     * Whether a day is selected
     * @param {Date} dObj to check if selected
     * @return {Boolean}
     */
    isSelectedDate (dObj) {
      return this.selectedDate && this.utils.compareDates(this.selectedDate, dObj)
    },
    /**
     * Whether a day is disabled
     * @param {Date} date to check if disabled
     * @return {Boolean}
     */
    isDisabledDate (date) {
      if (!this.disabledDates) return false

      return new DisabledDate(this.utils, this.disabledDates).isDateDisabled(
        date
      )
    },
    /**
     * Whether a day is highlighted (N.B. Disabled dates are not highlighted unless
     * `highlighted.includeDisabled` is true)
     * @param {Date} date to check if highlighted
     * @return {Boolean}
     */
    isHighlightedDate (date) {
      if (!this.highlighted) return false

      return new HighlightedDate(
        this.utils,
        this.disabledDates,
        this.highlighted
      ).isDateHighlighted(date)
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date} date
     * @return {Boolean}
     */
    isHighlightStart (date) {
      if (!this.highlighted) return false

      return new HighlightedDate(
        this.utils,
        this.disabledDates,
        this.highlighted
      ).isHighlightStart(date)
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date} date
     * @return {Boolean}
     */
    isHighlightEnd (date) {
      if (!this.highlighted) return false

      return new HighlightedDate(
        this.utils,
        this.disabledDates,
        this.highlighted
      ).isHighlightEnd(date)
    },
    /**
     * Defines the objects within the days array
     * @param  {Date} dObj
     * @return {Object}
     */
    makeDay (dObj) {
      const { utils } = this
      const dayOfWeek = utils.getDay(dObj)
      const isNextMonth = dObj >= this.firstOfNextMonth
      const isPreviousMonth = dObj < this.pageDate
      const isSaturday = dayOfWeek === 6
      const isSunday = dayOfWeek === 0
      const showDate = this.showEdgeDates || !(isPreviousMonth || isNextMonth)

      return {
        date: showDate ? utils.getDate(dObj) : '',
        timestamp: dObj.getTime(),
        isSelected: this.isSelectedDate(dObj),
        isDisabled: this.isDisabledDate(dObj),
        isHighlighted: this.isHighlightedDate(dObj),
        isHighlightStart: this.isHighlightStart(dObj),
        isHighlightEnd: this.isHighlightEnd(dObj),
        isToday: utils.compareDates(dObj, new Date()),
        isWeekend: isSaturday || isSunday,
        isSaturday,
        isSunday,
        isPreviousMonth,
        isNextMonth
      }
    }
  }
}
</script>
