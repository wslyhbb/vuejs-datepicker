<template>
  <div
    :id="datepickerId"
    ref="datepicker"
    class="vdp-datepicker"
    :class="[wrapperClass, isRtl ? 'rtl' : '']">
    <date-input
      :id="id"
      ref="dateInput"
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
      :is-open="isOpen"
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
      @clear-date="clearDate"
      @closeCalendar="close"
      @open="open"
      @select-typed-date="selectTypedDate"
      @set-focus="setFocus($event)"
      @tab="tabThroughNavigation"
      @typed-date="setTypedDate">
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
      ref="picker"
      :bootstrap-styling="bootstrapStyling"
      :calendar-class="calendarClass"
      :calendarStyle="calendarStyle"
      :day-cell-content="dayCellContent"
      :disabled-dates="disabledDates"
      :first-day-of-week="firstDayOfWeek"
      :highlighted="highlighted"
      :is-typeable="typeable"
      :is-up-disabled="isUpDisabled"
      :language="language"
      :monday-first="mondayFirst"
      :page-date="pageDate"
      :selected-date="selectedDate"
      :show-edge-dates="showEdgeDates"
      :show-full-month-name="fullMonthName"
      :slide-duration="slideDuration"
      :tabbable-cell-id="tabbableCellId"
      :two-letter-abbr="twoLetterAbbr"
      :use-utc="useUtc"
      :visible="isOpen"
      @page-change="handlePageChange"
      @select="handleSelect"
      @set-focus="setFocus($event)"
      @set-view="setView"
      @selected-disabled="selectDisabledDate">
      <template v-slot:beforeCalendarHeader>
        <slot name="beforeCalendarHeader"></slot>
      </template>
    </component>
  </div>
</template>

<script>
import DateInput from './DateInput.vue'
import DisabledDate from '@/utils/DisabledDate'
import inputProps from '@/mixins/inputProps.js'
import navMixin from '@/mixins/navMixin.js'
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
  mixins: [inputProps, navMixin],
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
    modelValue: {
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
    changedDecade: (date) => {
      return typeof date === 'object'
    },
    cleared: null,
    closed: null,
    'update:modelValue': (date) => {
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
       * Positioning
       */
      calendarHeight: 0,
      isClickOutside: false,
      /*
       * The latest valid `typedDate` (used for typeable datepicker)
       * {Date}
       */
      latestValidTypedDate: null,
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
      slideDuration: 250,
      resetTypedDate: new Date(),
      utils: constructedDateUtils,
      view: ''
    }
  },
  watch: {
    disabledDates: {
      handler () {
        const selectedDate =
          this.selectedDate || this.parseValue(this.modelValue)

        if (!selectedDate) {
          return
        }

        if (this.isDateDisabled(selectedDate) && selectedDate) {
          this.setDate(null)
          return
        }

        if (this.dateHasChanged(selectedDate)) {
          this.setDate(selectedDate)
        }
      },
      deep: true
    },
    initialView () {
      if (this.isOpen) {
        this.setInitialView()
      }
    },
    language (newLanguage) {
      this.utils = makeDateUtils(this.useUtc, newLanguage)
    },
    latestValidTypedDate (date) {
      this.setPageDate(date)
    },
    useUtc (newUtc) {
      this.utils = makeDateUtils(newUtc, this.language)
    },
    modelValue (value) {
      this.setValue(value)
    },
    openDate () {
      this.setPageDate()
    },
    view (newView, oldView) {
      this.handleViewChange(newView, oldView)
    }
  },
  computed: {
    computedInitialView () {
      if (!this.initialView) {
        return this.minimumView
      }

      return this.initialView
    },
    computedOpenDate () {
      const parsedOpenDate = this.parseValue(this.openDate)
      const openDateOrToday = this.utils.getNewDateObject(parsedOpenDate)
      const openDate = this.selectedDate || openDateOrToday

      // If the `minimum-view` is `month` or `year`, convert `openDate` accordingly
      return this.minimumView === 'day'
        ? openDate
        : new Date(this.utils.setDate(openDate, 1))
    },
    calendarStyle () {
      return {
        position: this.isInline ? 'static' : undefined
      }
    },
    datepickerId () {
      return `vdp-${Math.random().toString(36).slice(-10)}`
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
  mounted () {
    this.init()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount () {
    document.removeEventListener('click', this.handleClickOutside)
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
    open () {
      if (this.disabled || this.isInline) {
        return false
      }
      this.setInitialView()
      this.reviewFocus()
      this.$emit('opened')
    },
    /**
     * Parse a datepicker value from string/number to date
     * @param   {Date|String|Number|undefined} date
     * @returns {Date|null}
     */
    parseValue (date) {
      if (typeof date === 'string' || typeof date === 'number') {
        const parsed = new Date(date)
        return this.utils.isValidDate(parsed) ? parsed : null
      }
      return this.utils.isValidDate(date) ? date : null
    },
    /**
     * Select the date from a 'selectTypedDate' event
     * @param {Date=} date
     */
    selectTypedDate (date) {
      this.setDate(date.getTime())
      this.reviewFocus()

      if (this.isOpen) {
        this.close()
      }
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
      this.$emit('update:modelValue', date)
    },
    /**
     * Clear the selected date
     */
    clearDate () {
      this.selectedDate = null
      this.setPageDate()
      this.$emit('selected', null)
      this.$emit('update:modelValue', null)
      this.focus.refs = ['input']
      this.close()
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

      this.$refs.dateInput.typedDate = ''
      this.setDate(date.timestamp)
      this.focus.delay = date.isNextMonth ? this.slideDuration : 0
      this.focus.refs = this.isInline ? ['tabbableCell'] : ['input']
      this.close()
      this.reviewFocus()
      this.resetTypedDate = new Date()
    },
    /**
     * @param {Object} date
     */
    selectDisabledDate (date) {
      this.$emit('selectedDisabled', date)
    },
    /**
     * Set the datepicker modelValue (and, if typeable, update `latestValidTypedDate`)
     * @param {Date|String|Number|null} date
     */
    setValue (date) {
      if (typeof date === 'string' || typeof date === 'number') {
        const parsed = this.utils.parseDate(date, this.format)
        date = isNaN(parsed.valueOf()) ? null : parsed
      }
      this.selectedDate = date || null
      this.setPageDate(date)

      if (this.typeable) {
        this.latestValidTypedDate = date || this.computedOpenDate
      }
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
     * Sets the array of `refs` that might be focused following a view change
     * @param {String} newView The view being changed to
     * @param {String} oldView The previous view
     */
    setViewChangeFocusRefs (newView, oldView) {
      if (oldView === '') {
        this.focus.refs = []
        return
      }

      const views = ['day', 'month', 'year']
      const isNewView = (view) => view === newView
      const isOldView = (view) => view === oldView
      const newViewIndex = views.findIndex(isNewView)
      const oldViewIndex = views.findIndex(isOldView)
      const isViewChangeUp = newViewIndex - oldViewIndex > 0

      this.focus.refs = isViewChangeUp
        ? ['up', 'tabbableCell']
        : ['tabbableCell', 'up']
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
     * Updates the page (if necessary) after a 'typedDate' event and sets `tabbableCell` & `latestValidTypedDate`
     * @param {Date=} date
     */
    setTypedDate (date) {
      const originalPageDate = new Date(this.pageDate)

      this.latestValidTypedDate = date || this.computedOpenDate
      this.setPageDate(date)

      if (this.isPageChange(originalPageDate)) {
        this.handlePageChange({
          focusRefs: [],
          pageDate: this.pageDate
        })
        return
      }

      this.setTabbableCell()
    },
    /**
     * Focus the relevant element when the view changes
     * @param {String} newView
     * @param {String} oldView
     */
    handleViewChange (newView, oldView) {
      const isClosing = newView === ''
      const isOpeningInline = oldView === '' && this.isInline

      if (isClosing || isOpeningInline) {
        return
      }

      this.setViewChangeFocusRefs(newView, oldView)
      this.reviewFocus()
    },
    /**
     * Close the calendar
     */
    close () {
      if (this.isInline) {
        return
      }

      this.view = ''

      if (this.isClickOutside) {
        this.isClickOutside = false
      } else {
        this.reviewFocus()
      }

      this.$emit('closed')
    },
    /**
     * Closes the calendar when no element within it has focus
     */
    handleClickOutside (event) {
      if (!this.isOpen || this.inline) {
        return
      }

      const datePicker = event.target.closest('.vdp-datepicker')
      if ((datePicker && datePicker.id !== this.datepickerId) ||
          (!datePicker &&
           !event.target.parentElement.closest('.vdp-datepicker__calendar'))) {
        this.isClickOutside = true
        this.close()
      }
    },
    /**
     * Set the new pageDate, focus the relevant element and emit a `changed-<view>` event
     */
    handlePageChange ({ focusRefs, pageDate }) {
      this.setPageDate(pageDate)
      this.focus.refs = focusRefs
      this.focus.delay = this.slideDuration || 250
      this.reviewFocus()
      this.$emit(`changed${this.ucFirst(this.nextView.up)}`, pageDate)
    },
    /**
     * Returns true if element has the given className
     * @param   {HTMLElement} element
     * @param   {String}      className
     * @returns {Boolean}
     */
    hasClass (element, className) {
      return element && element.className.split(' ').includes(className)
    },
    /**
     * Used for typeable datepicker: returns true if a typed date causes the page to change
     * @param   {Date}    originalPageDate
     * @returns {Boolean}
     */
    isPageChange (originalPageDate) {
      if (!this.isOpen) {
        return false
      }

      return originalPageDate.valueOf() !== this.pageDate.valueOf()
    },
    /**
     * Initiate the component
     */
    init () {
      if (this.typeable) {
        this.latestValidTypedDate = this.selectedDate || this.computedOpenDate
      }
      if (this.modelValue) {
        this.setValue(this.modelValue)
      }
      if (this.isInline) {
        this.setInitialView()
      }
    },
    /**
     * Returns true if a date is disabled
     * @param {Date} date
     * @returns {Boolean}
     */
    isDateDisabled (date) {
      if (!this.disabledDates) return false

      return new DisabledDate(this.utils, this.disabledDates).isDateDisabled(
        date
      )
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
  }
}

</script>
<style lang="scss">
@use '../styles/style.scss'
</style>
