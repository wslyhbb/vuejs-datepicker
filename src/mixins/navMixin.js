export default {
  data () {
    return {
      focus: {
        delay: 0,
        refs: []
      },
      navElements: [],
      navElementsFocusedIndex: 0,
      resetTabbableCell: false,
      tabbableCell: null
    }
  },
  computed: {
    fallbackElementsToFocus () {
      const elements = ['tabbableCell', 'prev', 'next']

      if (this.typeable) {
        elements.unshift('input')
      }

      return elements
    },
    tabbableCellId () {
      return (
        this.tabbableCell && Number(this.tabbableCell.getAttribute('data-id'))
      )
    }
  },
  methods: {
    /**
     * Converts a date to first in month for `month` view or first in year for `year` view
     * @param   {Date} date The date to convert
     * @returns {Date}
     */
    getCellDate (date) {
      switch (this.view) {
        case 'month':
          return new Date(this.utils.setDate(date, 1))
        case 'year':
          return new Date(
            this.utils.setMonth(new Date(this.utils.setDate(date, 1)), 0)
          )
        default:
          return date
      }
    },
    /**
     * Focuses the first non-disabled element found in the `focus.refs` array and sets `navElementsFocusedIndex`
     */
    applyFocus () {
      const focusRefs = [...this.focus.refs, ...this.fallbackElementsToFocus]

      for (let i = 0; i < focusRefs.length; i++) {
        const element = this.getElementByRef(focusRefs[i])

        if (element && element.getAttribute('disabled') === null) {
          element.focus()
          this.setNavElementsFocusedIndex()
          break
        }
      }
    },
    /**
     * Returns the currently focused cell element, if there is one...
     */
    getActiveCell () {
      const activeElement = this.getActiveElement()
      const isActiveElementACell = this.hasClass(activeElement, 'cell')
      const isOnSameView = this.hasClass(activeElement, this.view)

      if (isActiveElementACell && isOnSameView && !this.resetTabbableCell) {
        return activeElement
      }

      return null
    },
    /**
     * Returns the currently focused element, using shadowRoot for web-components...
     */
    getActiveElement () {
      return document.activeElement.shadowRoot
        ? document.activeElement.shadowRoot.activeElement
        : document.activeElement
    },
    /**
     * Returns the `cellId` for a given a date
     * @param {Date} date The date for which we need the cellId
     * @returns {Number|null}
     */
    getCellId (date) {
      if (!date || !this.$refs.picker.$refs.cells) {
        return null
      }

      const cellDate = this.getCellDate(date)
      const { cells } = this.$refs.picker.$refs.cells

      for (let i = 0; i < cells.length; i++) {
        if (cells[i].timestamp === cellDate.valueOf()) {
          return i
        }
      }

      return null
    },
    /**
     * Finds an element by its `ref` attribute
     * @param {string} ref        The `ref` name of the wanted element
     * @returns {HTMLElement|Vue} A Vue element
     */
    getElementByRef (ref) {
      if (ref === 'tabbableCell') {
        return this.tabbableCell
      }
      if (ref === 'input') {
        return this.$refs.dateInput && this.$refs.dateInput.$refs[this.refName]
      }
      if (ref === 'calendarButton') {
        return this.$refs.dateInput && this.$refs.dateInput.$refs.calendarButton
      }
      return (
        this.$refs.picker &&
        this.$refs.picker.$refs.pickerHeader &&
        this.$refs.picker.$refs.pickerHeader.$refs[ref]
      )
    },
    /**
     * Returns an array of all HTML elements which should be focus-trapped in the specified slot
     * @returns {Array}   An array of HTML elements
     */
    getElementsFromSlot (slotName) {
      if (!this.hasSlot(slotName)) {
        return []
      }

      if (slotName === 'beforeCalendarHeader') {
        return this.getFocusableElements(this.$refs.view.children[0])
      }

      const isBeforeHeader = slotName.indexOf('beforeCalendarHeader') > -1
      const picker = this.$refs.picker.$el
      const index = isBeforeHeader ? 0 : picker.children.length - 1

      return this.getFocusableElements(picker.children[index])
    },
    /**
     * Returns an array of all HTMLButtonElements which should be focus-trapped in the header
     * @returns {Array}   An array of HTMLButtonElements
     */
    getElementsFromHeader () {
      if (!this.$refs.picker.$refs.pickerHeader) {
        return []
      }
      const header = this.$refs.picker.$refs.pickerHeader.$el
      const navNodeList = header.querySelectorAll('button:enabled')

      return [...Array.prototype.slice.call(navNodeList)]
    },
    /**
     * Returns an array of focusable elements in a given HTML fragment
     * @param   {Element} fragment The HTML fragment to search
     * @returns {Array}
     */
    getFocusableElements (fragment) {
      if (!fragment) {
        return []
      }

      const navNodeList = fragment.querySelectorAll(
        'button:enabled:not([tabindex="-1"]), [href]:not([tabindex="-1"]), input:not([tabindex="-1"]):not([type=hidden]), select:enabled:not([tabindex="-1"]), textarea:enabled:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
      )

      return [...Array.prototype.slice.call(navNodeList)]
    },
    /**
     * Returns the input element (when typeable)
     * @returns {Element}
     */
    getInputField () {
      if (!this.typeable || this.inline) {
        return null
      }

      return this.$refs.dateInput.$refs[this.refName]
    },
    /**
     * Used for a typeable datepicker: returns the cell element that corresponds to latestValidTypedDate...
     */
    getTypedCell () {
      if (!this.typeable) {
        return null
      }

      const cellId = this.getCellId(this.latestValidTypedDate)

      return cellId ? this.$refs.picker.$refs.cells.$el.children[cellId] : null
    },
    /**
     * Returns true if the calendar has been passed the given slot
     * @param  {String} slotName The name of the slot
     * @return {Boolean}
     */
    hasSlot (slotName) {
      return !!this.$slots[slotName]
    },
    /**
     * Sets the correct focus on next tick
     */
    reviewFocus () {
      this.tabbableCell = null
      this.resetTabbableCell = true

      this.$nextTick(() => {
        this.setNavElements()

        setTimeout(() => {
          this.applyFocus()
        }, this.focus.delay)

        this.resetTabbableCell = false
      })
    },
    /**
     * Set the focus
     * @param {Array} refs An array of `refs` to focus (in order of preference)
     */
    setFocus (refs) {
      this.focus.refs = refs
      this.applyFocus()
    },
    /**
     * Determines which elements in datepicker should be focus-trapped
     */
    setNavElements () {
      if (!this.view) return

      this.updateTabbableCell()

      const view = this.ucFirst(this.view)

      this.navElements = [
        this.getInputField(),
        this.getElementsFromSlot('beforeCalendarHeader'),
        this.getElementsFromSlot(`beforeCalendarHeader${view}`),
        this.getElementsFromHeader(),
        this.tabbableCell
      ]
        .filter((item) => !!item)
        .reduce((acc, val) => acc.concat(val), [])
    },
    /**
     * Keeps track of the currently focused index in the navElements array
     */
    setNavElementsFocusedIndex () {
      const activeElement = this.getActiveElement()

      for (let i = 0; i < this.navElements.length; i++) {
        if (activeElement === this.navElements[i]) {
          this.navElementsFocusedIndex = i
          return
        }
      }

      this.navElementsFocusedIndex = 0
    },
    /**
     * Sets the focus-trapped cell in the picker
     */
    setTabbableCell () {
      if (!this.$refs.picker || !this.$refs.picker.$refs.cells) {
        return
      }

      const pickerCells = this.$refs.picker.$refs.cells.$el

      this.tabbableCell =
        this.getActiveCell() ||
        this.getTypedCell() ||
        pickerCells.querySelector('button.selected:not(.muted):enabled') ||
        pickerCells.querySelector('button.today:not(.muted):enabled') ||
        pickerCells.querySelector('button.cell:not(.muted):enabled')
    },
    /**
     * Update which cell in the picker should be focus-trapped
     */
    updateTabbableCell () {
      const activeElement = this.getActiveElement()
      const isActiveElementACell = this.hasClass(activeElement, 'cell')
      const needToUpdate = !this.tabbableCell || isActiveElementACell

      if (needToUpdate) {
        this.setTabbableCell()
      }
    }
  }
}
