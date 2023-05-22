export default {
  props: {
    autofocus: {
      type: Boolean,
      default: false
    },
    bootstrapStyling: {
      type: Boolean,
      default: false
    },
    clearButton: {
      type: Boolean,
      default: false
    },
    clearButtonIcon: {
      type: String,
      default: null
    },
    calendarButton: {
      type: Boolean,
      default: false
    },
    calendarButtonIcon: {
      type: String,
      default: null
    },
    calendarButtonIconContent: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    format: {
      type: [String, Function],
      default: 'dd MMM yyyy'
    },
    id: {
      type: String,
      default: null
    },
    inline: {
      type: Boolean,
      default: false
    },
    inputClass: {
      type: [String, Object, Array],
      default: null
    },
    maxlength: {
      type: [Number, String],
      default: null
    },
    name: {
      type: String,
      default: null
    },
    pattern: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    refName: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    showCalendarOnFocus: {
      type: Boolean,
      default: false
    },
    typeable: {
      type: Boolean,
      default: false
    },
    useUtc: {
      type: Boolean,
      default: false
    }
  }
}
