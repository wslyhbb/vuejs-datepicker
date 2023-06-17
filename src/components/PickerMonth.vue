<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']"
       v-show="visible" :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader"></slot>
    <picker-header
      ref="pickerHeader"
      :bootstrap-styling="bootstrapStyling"
      :is-next-disabled="isNextDisabled"
      :is-previous-disabled="isPreviousDisabled"
      :is-rtl="isRtl"
      :is-up-disabled="isUpDisabled"
      next-view-up="year"
      up-button-classes="month__year_btn"
      @focusInput="focusInput"
      @page-change="changePage($event)"
      @setFocus="$emit('setFocus', $event)"
      @setView="$emit('setView', $event)">
      {{ pageTitleMonth }}
    </picker-header>
    <picker-cells
      ref="cells"
      v-slot="{ cell }"
      :cells="months"
      :is-rtl="isRtl"
      :tabbable-cell-id="tabbableCellId"
      view="month"
      @arrow="handleArrow($event)"
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
  emits: {
    pageChange: (config) => {
      return typeof config === 'object'
    },
    setFocus: (refArray) => {
      return refArray.every((ref) => {
        return ['input', 'prev', 'up', 'next', 'tabbableCell'].includes(ref)
      })
    },
    setView: (view) => {
      return view === 'year'
    }
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
     * @param {[String]} focusRefs
     */
    changeYear ({ incrementBy, focusRefs }) {
      const pageDate = this.pageDate
      this.utils.setFullYear(pageDate, this.utils.getFullYear(pageDate) + incrementBy)
      this.$emit('pageChange', { focusRefs, pageDate })
    },
    /**
     * Changes the page up or down
     * @param {Number} incrementBy
     * @param {[String]} focusRefs
     */
    changePage ({ incrementBy, focusRefs }) {
      if (incrementBy === 1 && !this.isNextDisabled) {
        this.changeYear({ incrementBy, focusRefs })
      } else if (incrementBy === -1 && !this.isPreviousDisabled) {
        this.changeYear({ incrementBy, focusRefs })
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
