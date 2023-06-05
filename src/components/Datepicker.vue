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

    <component
      :is="picker"
      :calendarClass="calendarClass"
      :calendarStyle="calendarStyle"
      :dayCellContent="dayCellContent"
      :disabledDates="disabledDates"
      :firstDayOfWeek="firstDayOfWeek"
      :highlighted="highlighted"
      :is-up-disabled="isUpDisabled"
      :language="language"
      :mondayFirst="mondayFirst"
      :pageDate="pageDate"
      :selectedDate="selectedDate"
      :showEdgeDates="showEdgeDates"
      :showFullMonthName="fullMonthName"
      :twoLetterAbbr="twoLetterAbbr"
      :use-utc="useUtc"
      :visible="isOpen"
      @pageChange="handlePageChange"
      @select="handleSelect"
      @setView="setView"
      @selectedDisabled="selectDisabledDate">
      <template v-slot:beforeCalendarHeader>
        <slot name="beforeCalendarHeader"></slot>
      </template>
    </component>
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
      if (this.isOpen) {
        this.setInitialView()
      }
    }
  },
  computed: {
    computedInitialView () {
      if (!this.initialView) {
        return this.minimumView
      }

      return this.initialView
    },
    calendarStyle () {
      return {
        position: this.isInline ? 'static' : undefined
      }
    },
    isInline () {
      return !!this.inline
    },
    isOpen () {
      return this.view !== ''
    },
    isRtl () {
      return rtlLangs.indexOf(this.language) !== -1
    },
    isUpDisabled () {
      return !this.allowedToShowView(this.nextView.up)
    },
    nextView () {
      const views = ['day', 'month', 'year']
      const isCurrentView = (view) => view === this.view
      const viewIndex = views.findIndex(isCurrentView)
      const nextViewDown = (index) => {
        return index <= 0 ? undefined : views[index - 1]
      }
      const nextViewUp = (index) => {
        if (index < 0) {
          return undefined
        }

        if (index === views.length - 1) {
          return 'decade'
        }

        return views[index + 1]
      }

      return {
        up: nextViewUp(viewIndex),
        down: nextViewDown(viewIndex)
      }
    },
    pageDate () {
      return new Date(this.pageTimestamp)
    },
    picker () {
      const view = this.view || this.computedInitialView
      return `Picker${this.ucFirst(view)}`
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
     * Set the date
     * @param {Object} date
     */
    handleSelect (date) {
      if (this.allowedToShowView(this.nextView.down)) {
        this.showNextViewDown(date)
        return
      }

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
     * Set the new pageDate and emit a `changed-<view>` event
     */
    handlePageChange (pageDate) {
      this.setPageDate(pageDate)
      this.$emit(`changed${this.ucFirst(this.nextView.up)}`, pageDate)
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
    },
    /**
     * Set the view to the next view down e.g. from `month` to `day`
     * @param {Object} cell The currently focused cell
     */
    showNextViewDown (cell) {
      this.setPageDate(new Date(cell.timestamp))
      this.$emit(`changed${this.ucFirst(this.view)}`, cell)
      this.setView(this.nextView.down)
    },
    /**
     * Capitalizes the first letter
     * @param {String} str The string to capitalize
     * @returns {String}
     */
    ucFirst (str) {
      return str[0].toUpperCase() + str.substring(1)
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
