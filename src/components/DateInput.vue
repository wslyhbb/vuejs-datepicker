<template>
  <div :class="{'input-group': bootstrapStyling}">
    <!-- Calendar Button -->
    <button v-if="calendarButton" ref="calendarButton" class="vdp-datepicker__calendar-button"
      :class="{'btn input-group-prepend': bootstrapStyling}"
      :disabled="disabled" @click="toggle('calendarButton')">
      <span :class="{'input-group-text': bootstrapStyling}">
        <slot name="calendarBtn">
          <i :class="calendarButtonIcon">
            {{ calendarButtonIconContent }}
            <span v-if="!calendarButtonIcon">&hellip;</span>
          </i>
        </slot>
      </span>
    </button>
    <slot name="beforeDateInput" />
    <!-- Input -->
    <input
      :id="id"
      :ref="refName"
      autocomplete="off"
      :autofocus="autofocus"
      :class="computedInputClass"
      :clear-button="clearButton"
      :disabled="disabled"
      :maxlength="maxlength"
      :name="name"
      :open-date="openDate"
      :pattern="pattern"
      :placeholder="placeholder"
      :readonly="!typeable"
      :required="required"
      :tabindex="tabindex"
      :type="inline ? 'hidden' : 'text'"
      :value="formattedValue"
      @blur="inputBlurred"
      @click="showCalendar"
      @focus="showFocusCalendar"
      @keydown.delete="handleDelete"
      @keydown.down.prevent="handleKeydownDown"
      @keydown.enter.prevent="handleKeydownEnter"
      @keydown.esc.prevent="handleKeydownEscape"
      @keydown.space="handleKeydownSpace($event)"
      @keyup="keyUp"
      @keyup.space="handleKeyupSpace($event)">
    <!-- Clear Button -->
    <button v-if="clearButton && selectedDate" class="vdp-datepicker__clear-button"
          :class="{'btn input-group-append': bootstrapStyling}"
          :disabled="disabled" @click="clearDate">
      <span :class="{'input-group-text': bootstrapStyling}">
        <slot name="clearBtn">
          <i :class="clearButtonIcon">
            <span v-if="!clearButtonIcon">&times;</span>
          </i>
        </slot>
      </span>
    </button>
    <slot name="afterDateInput" />
  </div>
</template>

<script>
import { makeDateUtils } from '../utils/DateUtils'
import inputProps from '@/mixins/inputProps.js'

export default {
  name: 'DateInput',
  mixins: [inputProps],
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    language: {
      type: Object
    },
    openDate: Date,
    parseTypedDate: Function,
    resetTypedDate: [Date],
    selectedDate: {
      type: Date,
      default: null
    }
  },
  emits: {
    clearDate: null,
    closeCalendar: null,
    open: null,
    selectTypedDate: (date) => {
      return date === null || date instanceof Date
    },
    setFocus: (refArray) => {
      return refArray.every((ref) => {
        return [
          'calendarButton',
          'input',
          'prev',
          'up',
          'next',
          'tabbableCell'
        ].includes(ref)
      })
    },
    typedDate: (date) => {
      return date === null || date instanceof Date
    }
  },
  data () {
    return {
      input: null,
      typedDate: false,
      utils: makeDateUtils(this.useUtc, this.language)
    }
  },
  computed: {
    formattedValue () {
      if (!this.selectedDate) {
        return null
      }
      if (this.typedDate) {
        return this.typedDate
      }
      return typeof this.format === 'function'
        ? this.format(this.selectedDate)
        : this.utils.formatDate(this.selectedDate, this.format)
    },
    computedInputClass () {
      if (this.bootstrapStyling) {
        if (typeof this.inputClass === 'string') {
          return [this.inputClass, 'form-control'].join(' ')
        }
        return { 'form-control': true, ...this.inputClass }
      }
      return this.inputClass
    }
  },
  watch: {
    language (newLanguage) {
      this.utils = makeDateUtils(this.useUtc, newLanguage)
    },
    useUtc (newUtc) {
      this.utils = makeDateUtils(newUtc, this.language)
    },
    resetTypedDate () {
      this.typedDate = false
    }
  },
  mounted () {
    this.input = this.$el.querySelector('input')
  },
  methods: {
    /**
     * Toggles the calendar (unless `show-calendar-on-focus` is true)
     */
    showCalendar () {
      // prevent to emit the event twice if we are listening focus
      if (!this.showCalendarOnFocus) {
        this.toggle()
      }
    },
    /**
     * Opens the calendar when `show-calendar-on-focus` is true
     */
    showFocusCalendar () {
      if (this.showCalendarOnFocus && !this.isOpen) {
        this.$emit('open')
      }
    },
    /**
     * Opens the calendar, or sets the focus to the next focusable element down
     */
    handleKeydownDown () {
      if (!this.isOpen) {
        this.$emit('open')
      }

      if (!this.typeable) {
        return
      }

      this.$emit('setFocus', ['prev', 'up', 'next', 'tabbableCell'])
    },
    /**
     * Selects a typed date and closes the calendar
     */
    handleKeydownEnter () {
      if (!this.typeable) {
        return
      }

      if (!this.input.value) {
        this.$emit('selectTypedDate', null)
        return
      }

      const parsedDate = this.getTypedDate(this.input.value)

      if (!isNaN(parsedDate)) {
        this.typedDate = this.input.value
        this.$emit('selectTypedDate', parsedDate)
      }
    },
    /**
     * Closes the calendar
     */
    handleKeydownEscape () {
      this.$emit('closeCalendar')
    },
    /**
     * Prevents scrolling when not typeable
     */
    handleKeydownSpace (event) {
      if (!this.typeable) {
        event.preventDefault()
      }
    },
    /**
     * Attempt to parse a typed date
     * @param {Event} event
     */
    keyUp (event) {
      if (
        !this.typeable ||
        [
          'Control',
          'Escape',
          'Shift',
          'Tab',
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight'
        ].includes(event.key)
      ) {
        return
      }

      if (!this.input.value) {
        this.$emit('typedDate', null)
        return
      }

      if (this.typeable) {
        const parsedDate = this.getTypedDate(this.input.value)

        if (!isNaN(parsedDate)) {
          this.typedDate = this.input.value
          this.$emit('typedDate', parsedDate)
        }
      }
    },
    /**
     * Toggles the calendar unless a typed date has been entered
     */
    handleKeyupSpace (event) {
      if (this.typeable) {
        if (this.input.value === '') {
          this.toggle()
        }
        return
      }

      event.preventDefault()
      this.toggle()
    },
    /**
     * nullify the typed date to defer to regular formatting
     * called once the input is blurred
     */
    inputBlurred () {
      if (this.typeable && isNaN(this.getTypedDate(this.input.value))) {
        this.clearDate()
        this.input.value = null
        this.typedDate = null
      }
    },
    /**
     * Clears the calendar when the `delete` or `backspace` key is pressed
     */
    handleDelete () {
      if (!this.typeable && this.selectedDate) {
        this.clearDate()
      }
    },
    /**
     * emit a clearDate event
     */
    clearDate () {
      this.$emit('clearDate')
    },
    /**
     * parse Date with regular or custom function
     */
    getTypedDate (input) {
      const date = typeof this.parseTypedDate === 'function'
        ? this.parseTypedDate(input)
        : this.utils.parseDate(input, typeof this.format === 'string' ? this.format : undefined)

      return date
    },
    /**
     * Opens or closes the calendar
     */
    toggle (calendarButton) {
      if (this.isOpen) {
        this.$emit('setFocus', [calendarButton || 'input'])
      }

      this.$emit(this.isOpen ? 'closeCalendar' : 'open')
    }
  }
}
</script>
