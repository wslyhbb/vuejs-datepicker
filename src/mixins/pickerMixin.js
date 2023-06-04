import { makeDateUtils, rtlLangs } from '@/utils/DateUtils'
import DisabledDate from '@/utils/DisabledDate'

export default {
  props: {
    allowedToShowView: {
      type: Function,
      default () {}
    },
    calendarClass: [String, Object, Array],
    calendarStyle: {
      type: Object
    },
    disabledDates: {
      type: Object
    },
    language: {
      type: Object
    },
    pageDate: {
      type: Date,
      default: null
    },
    selectedDate: {
      type: Date,
      default: null
    },
    useUtc: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const constructedDateUtils = makeDateUtils(this.useUtc, this.language)
    return {
      utils: constructedDateUtils
    }
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
    /**
     * A look-up object created from 'disabledDates' prop
     * @return {Object}
     */
    disabledConfig () {
      if (!this.disabledDates) {
        return {
          has: {
            from: false,
            to: false
          }
        }
      }

      return new DisabledDate(this.utils, this.disabledDates).config
    },
    isRtl () {
      return rtlLangs.indexOf(this.language) !== -1
    },
    /**
     * Returns the current page's full year as an integer.
     * @return {Number}
     */
    pageYear () {
      return this.utils.getFullYear(this.pageDate)
    }
  }
}
