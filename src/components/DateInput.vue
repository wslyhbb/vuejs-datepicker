<template>
  <div :class="{'input-group': bootstrapStyling}">
    <!-- Calendar Button -->
    <button v-if="calendarButton" class="vdp-datepicker__calendar-button"
      :class="{'btn input-group-prepend': bootstrapStyling}"
      :disabled="disabled" @click="showCalendar">
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
      @keyup="keyUp">
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
    closeCalendar: null,
    clearDate: null,
    showCalendar: null,
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
  methods: {
    showCalendar () {
      // prevent to emit the event twice if we are listening focus
      if (!this.showCalendarOnFocus) {
        this.$emit('showCalendar')
      }
    },

    showFocusCalendar () {
      if (this.showCalendarOnFocus) {
        this.$emit('showCalendar', true)
      }
    },
    /**
     * Attempt to parse a typed date
     * @param {Event} event
     */
    keyUp (event) {
      const code = (event.keyCode ? event.keyCode : event.which)

      // close calendar if escape or enter are pressed
      if ([
        27, // escape
        13 // enter
      ].includes(code)) {
        this.input.blur()
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
     * nullify the typed date to defer to regular formatting
     * called once the input is blurred
     */
    inputBlurred () {
      if (this.typeable && isNaN(this.getTypedDate(this.input.value))) {
        this.clearDate()
        this.input.value = null
        this.typedDate = null
      }

      this.$emit('closeCalendar', true)
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
    }
  },
  mounted () {
    this.input = this.$el.querySelector('input')
  }
}
</script>
