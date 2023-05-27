<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showMonthView" :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader"></slot>
    <picker-header
      :is-next-disabled="isNextYearDisabled(pageTimestamp)"
      :is-previous-disabled="isPreviousYearDisabled(pageTimestamp)"
      :is-rtl="isRtl"
      @pageChange="changePage($event)">
      <span class="month__year_btn" tabindex="0"
            :class="allowedToShowView('year') ? 'up' : ''"
            @click="showYearCalendar">{{ pageYearName }}</span>
    </picker-header>
    <span class="cell month" tabindex="0"
      v-for="month in months"
      :key="month.timestamp"
      :class="{'selected': month.isSelected, 'disabled': month.isDisabled}"
      @click.stop="selectMonth(month)"
      @keypress.enter="selectMonth(month)"
      @keypress.space="selectMonth(month)">{{ month.month }}</span>
  </div>
</template>

<script>
import PickerHeader from './PickerHeader.vue'
import { makeDateUtils, rtlLangs, langYearSuffix } from '../utils/DateUtils'

export default {
  name: 'PickerMonth',
  components: {
    PickerHeader
  },
  props: {
    showMonthView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    disabledDates: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    language: Object,
    allowedToShowView: Function,
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
    months () {
      const d = this.pageDate
      const months = []
      // set up a new date object to the beginning of the current 'page'
      const dObj = this.useUtc
        ? new Date(Date.UTC(d.getUTCFullYear(), 0, d.getUTCDate()))
        : new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes())
      for (let i = 0; i < 12; i++) {
        months.push({
          month: this.utils.getMonthName(dObj), // , i, this.language.months),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedMonth(dObj),
          isDisabled: this.isDisabledMonth(dObj)
        })
        this.utils.setMonth(dObj, this.utils.getMonth(dObj) + 1)
      }
      return months
    },
    /**
     * Get year name on current page.
     * @return {String}
     */
    pageYearName () {
      const yearSuffix = langYearSuffix[this.language] || ''
      return `${this.utils.getFullYear(this.pageDate)}${yearSuffix}`
    }
  },
  methods: {
    /**
     * Emits a selectMonth event
     * @param {Object} month
     */
    selectMonth (month) {
      if (month.isDisabled) {
        return false
      }
      this.$emit('selectMonth', month)
    },
    /**
     * Changes the year up or down
     * @param {Number} incrementBy
     */
    changeYear (incrementBy) {
      const date = this.pageDate
      this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy)
      this.$emit('changedYear', date)
    },
    /**
     * Checks if the previous year is disabled or not
     * @return {Boolean}
     */
    isPreviousYearDisabled () {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false
      }
      return this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(this.pageDate)
    },
    /**
     * Changes the page up or down
     * @param {Number} incrementBy
     */
    changePage ({ incrementBy }) {
      if (incrementBy === 1) {
        if (!this.isNextYearDisabled()) {
          this.changeYear(incrementBy)
        }
      } else if (incrementBy === -1) {
        if (!this.isPreviousYearDisabled()) {
          this.changeYear(incrementBy)
        }
      }
    },
    /**
     * Checks if the next year is disabled or not
     * @return {Boolean}
     */
    isNextYearDisabled () {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false
      }
      return this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(this.pageDate)
    },
    /**
     * Emits an event that shows the year calendar
     */
    showYearCalendar () {
      this.$emit('showYearCalendar')
    },
    /**
     * Whether the selected date is in this month
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedMonth (date) {
      return (this.selectedDate &&
        this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date) &&
        this.utils.getMonth(this.selectedDate) === this.utils.getMonth(date))
    },
    /**
     * Whether a month is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledMonth (date) {
      let disabledDates = false

      if (typeof this.disabledDates === 'undefined') {
        return false
      }

      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to) {
        if (
          (this.utils.getMonth(date) < this.utils.getMonth(this.disabledDates.to) && this.utils.getFullYear(date) <= this.utils.getFullYear(this.disabledDates.to)) ||
          this.utils.getFullYear(date) < this.utils.getFullYear(this.disabledDates.to)
        ) {
          disabledDates = true
        }
      }
      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from) {
        if (
          (this.utils.getMonth(date) > this.utils.getMonth(this.disabledDates.from) && this.utils.getFullYear(date) >= this.utils.getFullYear(this.disabledDates.from)) ||
          this.utils.getFullYear(date) > this.utils.getFullYear(this.disabledDates.from)
        ) {
          disabledDates = true
        }
      }

      if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
        disabledDates = true
      }
      return disabledDates
    }
  }
}
</script>
