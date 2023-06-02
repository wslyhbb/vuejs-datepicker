<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showMonthView" :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader"></slot>
    <picker-header
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      @page-change="changePage($event)">
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
import pickerMixin from '@/mixins/pickerMixin.js'
import { langYearSuffix } from '../utils/DateUtils'
import DisabledDate from '@/utils/DisabledDate'

export default {
  name: 'PickerMonth',
  mixins: [pickerMixin],
  props: {
    showMonthView: Boolean
  },
  emits: {
    changedYear: (date) => {
      return typeof date === 'object'
    },
    selectMonth: (date) => {
      return typeof date === 'object'
    },
    showYearCalendar: null
  },
  computed: {
    /**
     * Is the next year disabled?
     * @return {Boolean}
     */
    isNextDisabled () {
      if (!this.disabledConfig.has.from) {
        return false
      }
      return this.disabledConfig.from.year <= this.pageYear
    },
    /**
     * Is the previous year disabled?
     * @return {Boolean}
     */
    isPreviousDisabled () {
      if (!this.disabledConfig.has.to) {
        return false
      }
      return this.disabledConfig.to.year >= this.pageYear
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
      return `${this.pageYear}${yearSuffix}`
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
     * Changes the page up or down
     * @param {Number} incrementBy
     */
    changePage ({ incrementBy }) {
      if (incrementBy === 1) {
        if (!this.isNextDisabled) {
          this.changeYear(incrementBy)
        }
      } else if (incrementBy === -1) {
        if (!this.isPreviousDisabled) {
          this.changeYear(incrementBy)
        }
      }
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
      if (!this.disabledDates) return false

      return new DisabledDate(this.utils, this.disabledDates).isMonthDisabled(
        date
      )
    }
  }
}
</script>
