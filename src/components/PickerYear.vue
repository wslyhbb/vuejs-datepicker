<template>
  <div :class="[calendarClass, 'vdp-datepicker__calendar']" v-show="showYearView" :style="calendarStyle" @mousedown.prevent>
    <slot name="beforeCalendarHeader"></slot>
    <picker-header
      :is-next-disabled="isNextDecadeDisabled(pageTimestamp)"
      :is-previous-disabled="isPreviousDecadeDisabled(pageTimestamp)"
      :is-rtl="isRtl"
      @page-change="changePage($event)">
      <span>{{ getPageDecade }}</span>
    </picker-header>
    <span
      class="cell year" tabindex="0"
      v-for="year in years"
      :key="year.timestamp"
      :class="{ 'selected': year.isSelected, 'disabled': year.isDisabled }"
      @click.stop="selectYear(year)"
      @keypress.enter="selectYear(year)"
      @keypress.space="selectYear(year)">{{ year.year }}</span>
  </div>
</template>

<script>
import PickerHeader from './PickerHeader.vue'
import { makeDateUtils, rtlLangs, langYearSuffix } from '../utils/DateUtils'

export default {
  name: 'PickerYear',
  components: {
    PickerHeader
  },
  props: {
    showYearView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    disabledDates: Object,
    highlighted: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    language: Object,
    allowedToShowView: Function,
    useUtc: Boolean
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
     * @return {String}
     */
    getPageDecade () {
      const decadeStart = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10
      const decadeEnd = decadeStart + 9
      const yearSuffix = langYearSuffix[this.language] || ''
      return `${decadeStart} - ${decadeEnd}${yearSuffix}`
    }
  },
  data () {
    const constructedDateUtils = makeDateUtils(this.useUtc, this.language)
    return {
      utils: constructedDateUtils
    }
  },
  methods: {
    selectYear (year) {
      if (year.isDisabled) {
        return false
      }
      this.$emit('selectYear', year)
    },
    changeYear (incrementBy) {
      const date = this.pageDate
      this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy)
      this.$emit('changedDecade', date)
    },
    isPreviousDecadeDisabled () {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false
      }
      const disabledYear = this.utils.getFullYear(this.disabledDates.to)
      const lastYearInPreviousPage = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10 - 1
      return disabledYear > lastYearInPreviousPage
    },
    /**
     * Changes the page up or down
     * @param {Number} incrementBy
     */
    changePage ({ incrementBy }) {
      if (incrementBy === 1) {
        if (!this.isNextDecadeDisabled()) {
          this.changeYear(incrementBy * 10)
        }
      } else if (incrementBy === -1) {
        if (!this.isPreviousDecadeDisabled()) {
          this.changeYear(incrementBy * 10)
        }
      }
    },
    isNextDecadeDisabled () {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false
      }
      const disabledYear = this.utils.getFullYear(this.disabledDates.from)
      const firstYearInNextPage = Math.ceil(this.utils.getFullYear(this.pageDate) / 10) * 10
      return disabledYear < firstYearInNextPage
    },

    /**
     * Whether the selected date is in this year
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedYear (date) {
      return this.selectedDate && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date)
    },
    /**
     * Whether a year is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledYear (date) {
      let disabledDates = false
      if (typeof this.disabledDates === 'undefined' || !this.disabledDates) {
        return false
      }

      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to) {
        if (this.utils.getFullYear(date) < this.utils.getFullYear(this.disabledDates.to)) {
          disabledDates = true
        }
      }
      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from) {
        if (this.utils.getFullYear(date) > this.utils.getFullYear(this.disabledDates.from)) {
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
// eslint-disable-next-line
;
</script>
