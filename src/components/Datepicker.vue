<template>
  <div
    class="vdp-datepicker"
    :class="[wrapperClass, isRtl ? 'rtl' : '']"
    @keydown.capture="keyEvent">
    <date-input
      :id="id"
      :autofocus="autofocus"
      :bootstrap-styling="bootstrapStyling"
      :calendar-button="calendarButton"
      :calendar-button-icon="calendarButtonIcon"
      :calendar-button-icon-content="calendarButtonIconContent"
      :clear-button="clearButton"
      :clear-button-icon="clearButtonIcon"
      :disabled="disabled"
      :format="format"
      :inline="inline"
      :input-class="inputClass"
      :language="language"
      :maxlength="maxlength"
      :name="name"
      :open-date="openDate"
      :parse-typed-date="parseTypedDate"
      :pattern="pattern"
      :placeholder="placeholder"
      :ref-name="refName"
      :required="required"
      :reset-typed-date="resetTypedDate"
      :selected-date="selectedDate"
      :show-calendar-on-focus="showCalendarOnFocus"
      :tabindex="tabindex"
      :typeable="typeable"
      :use-utc="useUtc"
      @showCalendar="showCalendar"
      @closeCalendar="close"
      @typedDate="setTypedDate"
      @clearDate="clearDate">
      <template #calendarBtn>
        <slot name="calendarBtn" />
      </template>
      <template #beforeDateInput>
        <slot name="beforeDateInput" />
      </template>
      <template #clearBtn>
        <slot name="clearBtn" />
      </template>
      <template #afterDateInput>
        <slot name="afterDateInput" />
      </template>
    </date-input>

    <!-- Day View -->
    <picker-day
      v-if="allowedToShowView('day')"
      :allowedToShowView="allowedToShowView"
      :calendarClass="calendarClass"
      :calendarStyle="calendarStyle"
      :dayCellContent="dayCellContent"
      :disabledDates="disabledDates"
      :firstDayOfWeek="firstDayOfWeek"
      :highlighted="highlighted"
      :language="language"
      :mondayFirst="mondayFirst"
      :pageDate="pageDate"
      :selectedDate="selectedDate"
      :showDayView="view === 'day'"
      :showEdgeDates="showEdgeDates"
      :showFullMonthName="fullMonthName"
      :twoLetterAbbr="twoLetterAbbr"
      :use-utc="useUtc"
      @changedMonth="handleChangedMonthFromDayPicker"
      @selectDate="selectDate"
      @setView="setView"
      @selectedDisabled="selectDisabledDate">
      <template v-slot:beforeCalendarHeader>
        <slot name="beforeCalendarHeader"></slot>
      </template>
    </picker-day>

    <!-- Month View -->
    <picker-month
      v-if="allowedToShowView('month')"
      :pageDate="pageDate"
      :selectedDate="selectedDate"
      :showMonthView="view === 'month'"
      :allowedToShowView="allowedToShowView"
      :disabledDates="disabledDates"
      :calendarClass="calendarClass"
      :calendarStyle="calendarStyle"
      :language="language"
      :use-utc="useUtc"
      @selectMonth="selectMonth"
      @setView="setView"
      @changedYear="setPageDate">
      <template v-slot:beforeCalendarHeader>
        <slot name="beforeCalendarHeader"></slot>
      </template>
    </picker-month>

    <!-- Year View -->
    <picker-year
      v-if="allowedToShowView('year')"
      :pageDate="pageDate"
      :selectedDate="selectedDate"
      :showYearView="view === 'year'"
      :allowedToShowView="allowedToShowView"
      :disabledDates="disabledDates"
      :calendarClass="calendarClass"
      :calendarStyle="calendarStyle"
      :language="language"
      :use-utc="useUtc"
      @selectYear="selectYear"
      @changedDecade="setPageDate">
      <template v-slot:beforeCalendarHeader>
        <slot name="beforeCalendarHeader"></slot>
      </template>
    </picker-year>
  </div>
</template>

<script>
import DateInput from './DateInput.vue'
import inputProps from '@/mixins/inputProps.js'
import PickerDay from './PickerDay.vue'
import PickerMonth from './PickerMonth.vue'
import PickerYear from './PickerYear.vue'
import utils, { makeDateUtils, rtlLangs } from '../utils/DateUtils'
import { enUS } from 'date-fns/locale'

export default {
  name: 'DatePicker',
  components: {
    DateInput,
    PickerDay,
    PickerMonth,
    PickerYear
  },
  mixins: [inputProps],
  props: {
    calendarClass: {
      type: [String, Object, Array],
      default: ''
    },
    dayCellContent: {
      type: Function
    },
    disabledDates: {
      type: Object
    },
    firstDayOfWeek: {
      type: String
    },
    fullMonthName: {
      type: Boolean
    },
    highlighted: {
      type: Object
    },
    initialView: {
      type: String,
      default: ''
    },
    language: {
      type: Object,
      default () {
        return enUS
      }
    },
    maximumView: {
      type: String,
      default: 'year'
    },
    minimumView: {
      type: String,
      default: 'day'
    },
    mondayFirst: {
      type: Boolean
    },
    openDate: {
      validator: val => utils.validateDateInput(val)
    },
    parseTypedDate: {
      type: Function
    },
    showEdgeDates: {
      type: Boolean,
      default: false
    },
    twoLetterAbbr: {
      type: Boolean
    },
    value: {
      validator: val => utils.validateDateInput(val)
    },
    wrapperClass: {
      type: [String, Object, Array],
      default: ''
    }
  },
  emits: {
    changedMonth: (date) => {
      return typeof date === 'object'
    },
    changedYear: (date) => {
      return typeof date === 'object'
    },
    cleared: null,
    closed: null,
    input: (date) => {
      return date instanceof Date || date === null
    },
    opened: null,
    selected: (date) => {
      return date instanceof Date || date === null
    },
    selectedDisabled: (date) => {
      return typeof date === 'object'
    }
  },
  data () {
    const startDate = this.openDate ? new Date(this.openDate) : new Date()
    const constructedDateUtils = makeDateUtils(this.useUtc, this.language)
    const pageTimestamp = constructedDateUtils.setDate(startDate, 1)

    return {
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp,
      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,
      /*
       * Positioning
       */
      calendarHeight: 0,
      resetTypedDate: new Date(),
      utils: constructedDateUtils,
      view: ''
    }
  },
  watch: {
    language (newLanguage) {
      this.utils = makeDateUtils(this.useUtc, newLanguage)
    },
    useUtc (newUtc) {
      this.utils = makeDateUtils(newUtc, this.language)
    },
    value (value) {
      this.setValue(value)
    },
    openDate () {
      this.setPageDate()
    },
    initialView () {
      this.setInitialView()
    }
  },
  computed: {
    computedInitialView () {
      if (!this.initialView) {
        return this.minimumView
      }

      return this.initialView
    },
    pageDate () {
      return new Date(this.pageTimestamp)
    },

    calendarStyle () {
      return {
        position: this.isInline ? 'static' : undefined
      }
    },
    isOpen () {
      return this.view !== ''
    },
    isInline () {
      return !!this.inline
    },
    isRtl () {
      return rtlLangs.indexOf(this.language) !== -1
    }
  },
  methods: {
    /**
     * Called in the event that the user navigates to date pages and
     * closes the picker without selecting a date.
     */
    resetDefaultPageDate () {
      if (this.selectedDate === null) {
        this.setPageDate()
        return
      }
      this.setPageDate(this.selectedDate)
    },
    /**
     * Effectively a toggle to show/hide the calendar
     * @return {mixed}
     */
    showCalendar () {
      if (this.disabled || this.isInline) {
        return false
      }
      if (this.isOpen) {
        return this.close()
      }
      this.setInitialView()
      this.$emit('opened')
    },
    /**
     * Sets the initial picker page view: day, month or year
     */
    setInitialView () {
      const initialView = this.computedInitialView
      if (!this.allowedToShowView(initialView)) {
        throw new Error(
          `initialView '${this.initialView}' cannot be rendered based on minimum '${this.minimumView}' and maximum '${this.maximumView}'`
        )
      }

      this.setView(initialView)
    },
    /**
     * Are we allowed to show a specific picker view?
     * @param {String} view
     * @return {Boolean}
     */
    allowedToShowView (view) {
      const views = ['day', 'month', 'year']
      const minimumViewIndex = views.indexOf(this.minimumView)
      const maximumViewIndex = views.indexOf(this.maximumView)
      const viewIndex = views.indexOf(view)

      return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex
    },
    /**
     * Set the selected date
     * @param {Number} timestamp
     */
    setDate (timestamp) {
      const date = new Date(timestamp)
      this.selectedDate = date
      this.setPageDate(date)
      this.$emit('selected', date)
      this.$emit('input', date)
    },
    /**
     * Clear the selected date
     */
    clearDate () {
      this.selectedDate = null
      this.setPageDate()
      this.$emit('selected', null)
      this.$emit('input', null)
      this.$emit('cleared')
    },
    /**
     * @param {Object} date
     */
    selectDate (date) {
      this.setDate(date.timestamp)
      if (!this.isInline) {
        this.close()
      }
      this.resetTypedDate = new Date()
    },
    /**
     * @param {Object} date
     */
    selectDisabledDate (date) {
      this.$emit('selectedDisabled', date)
    },
    /**
     * @param {Object} month
     */
    selectMonth (month) {
      const date = new Date(month.timestamp)
      if (this.allowedToShowView('day')) {
        this.setPageDate(date)
        this.$emit('changedMonth', month)
        this.setView('day')
      } else {
        this.selectDate(month)
      }
    },
    /**
     * @param {Object} year
     */
    selectYear (year) {
      const date = new Date(year.timestamp)
      if (this.allowedToShowView('month')) {
        this.setPageDate(date)
        this.$emit('changedYear', year)
        this.setView('month')
      } else {
        this.selectDate(year)
      }
    },
    /**
     * Set the datepicker value
     * @param {Date|String|Number|null} date
     */
    setValue (date) {
      if (typeof date === 'string' || typeof date === 'number') {
        const parsed = this.utils.parseDate(date, this.format)
        date = isNaN(parsed.valueOf()) ? null : parsed
      }
      if (!date) {
        this.setPageDate()
        this.selectedDate = null
        return
      }
      this.selectedDate = date
      this.setPageDate(date)
    },
    /**
     * Set the picker view
     * @param {String} view
     */
    setView (view) {
      if (this.allowedToShowView(view)) {
        this.view = view
      }
    },
    /**
     * Sets the date that the calendar should open on
     */
    setPageDate (date) {
      if (!date) {
        if (this.openDate) {
          date = new Date(this.openDate)
        } else {
          date = new Date()
        }
      }
      this.pageTimestamp = this.utils.setDate(new Date(date), 1)
    },
    /**
     * Handles a month change from the day picker
     */
    handleChangedMonthFromDayPicker (date) {
      this.setPageDate(date)
      this.$emit('changedMonth', date)
    },
    /**
     * Set the date from a typedDate event
     */
    setTypedDate (date) {
      this.setDate(date.getTime())
    },
    /**
     * Close the calendar
     */
    close () {
      this.view = ''
      if (!this.isInline) {
        this.$emit('closed')
        document.removeEventListener('click', this.clickOutside, false)
      }
    },
    /**
     * Initiate the component
     */
    init () {
      if (this.value) {
        this.setValue(this.value)
      }
      if (this.isInline) {
        this.setInitialView()
      }
    },
    keyEvent ($event) {
      if (typeof this['keyEvent' + $event.key] === 'function') {
        $event.preventDefault()
        this['keyEvent' + $event.key]($event)
      }
    },
    keyEventArrowUp () {
      if (this.selectedDate !== null) {
        const moveBy = 1000 * 60 * 60 * 24 * 7
        if (this.selectedDate === null) {
          this.setDate(this.pageTimestamp)
        } else if (this.view === 'day') {
          this.setDate(this.selectedDate.getTime() - moveBy)
        } else if (this.view === 'month') {
          const newTime = new Date(this.selectedDate.getTime())
          newTime.setMonth(newTime.getMonth() - 3)
          this.setDate(newTime.getTime())
        } else if (this.view === 'year') {
          const newTime = new Date(this.selectedDate.getTime())
          newTime.setFullYear(newTime.getFullYear() - 3)
          this.setDate(newTime.getTime())
        }
      }
    },
    keyEventArrowDown () {
      if (this.selectedDate !== null) {
        const moveBy = 1000 * 60 * 60 * 24 * 7
        if (this.selectedDate === null) {
          this.setDate(this.pageTimestamp)
        } else if (this.view === 'day') {
          this.setDate(this.selectedDate.getTime() + moveBy)
        } else if (this.view === 'month') {
          const newTime = new Date(this.selectedDate.getTime())
          newTime.setMonth(newTime.getMonth() + 3)
          this.setDate(newTime.getTime())
        } else if (this.view === 'year') {
          const newTime = new Date(this.selectedDate.getTime())
          newTime.setFullYear(newTime.getFullYear() + 3)
          this.setDate(newTime.getTime())
        }
      }
    },
    keyEventArrowLeft () {
      if (this.selectedDate !== null) {
        let moveBy = 1000 * 60 * 60 * 24
        if (this.isRtl) {
          moveBy = -moveBy
        }
        if (this.selectedDate !== null) {
          if (this.view === 'day') {
            this.setDate(this.selectedDate.getTime() - moveBy)
          } else if (this.view === 'month') {
            const newTime = new Date(this.selectedDate.getTime())
            newTime.setMonth(newTime.getMonth() - 1)
            this.setDate(newTime.getTime())
          } else if (this.view === 'year') {
            const newTime = new Date(this.selectedDate.getTime())
            newTime.setFullYear(newTime.getFullYear() - 1)
            this.setDate(newTime.getTime())
          }
        }
      }
    },
    keyEventArrowRight () {
      if (this.selectedDate !== null) {
        let moveBy = 1000 * 60 * 60 * 24
        if (this.isRtl) {
          moveBy = -moveBy
        }
        if (this.selectedDate !== null) {
          if (this.view === 'day') {
            this.setDate(this.selectedDate.getTime() + moveBy)
          } else if (this.view === 'month') {
            const newTime = new Date(this.selectedDate.getTime())
            newTime.setMonth(newTime.getMonth() + 1)
            this.setDate(newTime.getTime())
          } else if (this.view === 'year') {
            const newTime = new Date(this.selectedDate.getTime())
            newTime.setFullYear(newTime.getFullYear() + 1)
            this.setDate(newTime.getTime())
          }
        }
      }
    }
  },
  mounted () {
    this.init()
  }
}

</script>
<style lang="scss">
@import '../styles/style.scss'
</style>
