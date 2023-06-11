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
      <span>{{ pageTitleYear }}</span>
    </picker-header>
    <picker-cells
      ref="cells"
      v-slot="{ cell }"
      :cells="years"
      view="year"
      @select="select($event)">
      {{ cell.year }}
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
  name: 'PickerYear',
  components: { PickerHeader, PickerCells },
  mixins: [pickerMixin],
  props: {
    highlighted: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    /**
     * Is the next decade disabled?
     * @return {Boolean}
     */
    isNextDisabled () {
      if (!this.disabledConfig.has.from) {
        return false
      }
      return this.disabledConfig.from.year <= this.pageDecadeEnd
    },
    /**
     * Is the previous decade disabled?
     * @return {Boolean}
     */
    isPreviousDisabled () {
      if (!this.disabledConfig.has.to) {
        return false
      }
      return this.disabledConfig.to.year >= this.pageDecadeStart
    },
    /**
     * The year at which the current yearRange starts
     * @return {Number}
     */
    pageDecadeStart () {
      return Math.floor(this.pageYear / 10) * 10
    },
    /**
     * The year at which the current yearRange ends
     * @return {Number}
     */
    pageDecadeEnd () {
      return this.pageDecadeStart + 10 - 1
    },
    years () {
      const d = this.pageDate
      const years = []
      // set up a new date object to the beginning of the current 'page'7
      const dObj = this.useUtc
        ? new Date(Date.UTC(Math.floor(d.getUTCFullYear() / 10) * 10, d.getUTCMonth(), d.getUTCDate()))
        : new Date(Math.floor(d.getFullYear() / 10) * 10, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
      for (let i = 0; i < 10; i++) {
        years.push({
          year: this.utils.getFullYear(dObj),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedYear(dObj),
          isDisabled: this.isDisabledYear(dObj)
        })
        this.utils.setFullYear(dObj, this.utils.getFullYear(dObj) + 1)
      }
      return years
    },
    /**
     * Display the current page's decade (or year range) as the title.
     * @return {String}
     */
    pageTitleYear () {
      const yearSuffix = langYearSuffix[this.language] || ''
      return `${this.pageDecadeStart} - ${this.pageDecadeEnd}${yearSuffix}`
    }
  },
  methods: {
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
          this.changeYear(incrementBy * 10)
        }
      } else if (incrementBy === -1) {
        if (!this.isPreviousDisabled) {
          this.changeYear(incrementBy * 10)
        }
      }
    },
    /**
     * Whether the selected date is in this year
     * @param {Date} date
     * @return {Boolean}
     */
    isSelectedYear (date) {
      return this.selectedDate && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date)
    },
    /**
     * Whether a year is disabled
     * @param {Date} date
     * @return {Boolean}
     */
    isDisabledYear (date) {
      if (!this.disabledDates) return false

      return new DisabledDate(this.utils, this.disabledDates).isYearDisabled(
        date
      )
    }
  }
}
</script>
