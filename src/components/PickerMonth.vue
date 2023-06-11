<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']"
       v-show="visible" :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader"></slot>
    <picker-header
      :bootstrap-styling="bootstrapStyling"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      @pageChange="changePage($event)">
      <button class="month__year_btn"
            :class="{ 'up': !isUpDisabled }"
            @click="$emit('setView', 'year')">
        {{ pageTitleMonth }}
      </button>
    </picker-header>
    <picker-cells
      ref="cells"
      v-slot="{ cell }"
      :cells="months"
      view="month"
      @select="select($event)">
      {{ cell.month }}
    </picker-cells>
  </div>
</template>

<script>
import PickerHeader from './PickerHeader.vue'
import PickerCells from './PickerCells.vue'
import pickerMixin from '@/mixins/pickerMixin.js'
import { langYearSuffix } from '../utils/DateUtils'
import DisabledDate from '@/utils/DisabledDate'

export default {
  name: 'PickerMonth',
  components: { PickerHeader, PickerCells },
  mixins: [pickerMixin],
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
     * Display the current page's year as the title.
     * @return {String}
     */
    pageTitleMonth () {
      const yearSuffix = langYearSuffix[this.language] || ''
      return `${this.pageYear}${yearSuffix}`
    }
  },
  methods: {
    /**
     * Changes the year up or down
     * @param {Number} incrementBy
     */
    changeYear (incrementBy) {
      const date = this.pageDate
      this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy)
      this.$emit('pageChange', date)
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
     * Whether the selected date is in this month
     * @param {Date} date
     * @return {Boolean}
     */
    isSelectedMonth (date) {
      return (this.selectedDate &&
        this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date) &&
        this.utils.getMonth(this.selectedDate) === this.utils.getMonth(date))
    },
    /**
     * Whether a month is disabled
     * @param {Date} date
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
