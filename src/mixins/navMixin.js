export default {
  data () {
    return {
      focus: {
        delay: 0,
        refs: []
      },
      inlineTabbableCell: null,
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
     * Returns true, unless tabbing should be focus-trapped
     * @return {Boolean}
     */
    allowNormalTabbing (event) {
      if (!this.isOpen) {
        return true
      }

      return this.isTabbingAwayFromInlineDatepicker(event)
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
     * Returns the first focusable element of an inline datepicker
     * @returns {HTMLElement}
     */
    getFirstInlineFocusableElement () {
      const pickerElements = this.getFocusableElements(this.$refs.picker.$el)

      return pickerElements[0]
    },
    /**
     * Returns the last focusable element of an inline datepicker
     * @returns {HTMLElement}
     */
    getLastInlineFocusableElement () {
      const pickerElements = this.getFocusableElements(this.$refs.picker.$el)

      return pickerElements[pickerElements.length - 1]
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
     * Returns true if the user is tabbing away from an inline datepicker
     * @return {Boolean}
     */
    isTabbingAwayFromInlineDatepicker (event) {
      if (!this.inline) {
        return false
      }

      if (this.isTabbingAwayFromFirstNavElement(event)) {
        this.tabAwayFromFirstElement()

        return true
      }

      if (this.isTabbingAwayFromLastNavElement(event)) {
        this.tabAwayFromLastElement()

        return true
      }

      return false
    },
    /**
     * Used for inline calendars; returns true if the user tabs backwards from the first focusable element
     * @param  {object}  event Used to determine whether we are tabbing forwards or backwards
     * @return {Boolean}
     */
    isTabbingAwayFromFirstNavElement (event) {
      if (!event.shiftKey) {
        return false
      }

      const activeElement = this.getActiveElement()
      const firstNavElement = this.navElements[0]

      return activeElement === firstNavElement
    },
    /**
     * Used for inline calendars; returns true if the user tabs forwards from the last focusable element
     * @param  {object}  event Used to determine whether we are tabbing forwards or backwards
     * @return {Boolean}
     */
    isTabbingAwayFromLastNavElement (event) {
      if (event.shiftKey) {
        return false
      }

      const activeElement = this.getActiveElement()
      const lastNavElement = this.navElements[this.navElements.length - 1]

      return activeElement === lastNavElement
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
     * Stores the current tabbableCell of an inline datepicker
     * N.B. This is used when tabbing back (shift + tab) to an inline calendar from further down the page
     */
    setInlineTabbableCell () {
      if (!this.inline) {
        return
      }

      this.inlineTabbableCell = this.tabbableCell
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
     * Focuses the first focusable element of an inline datepicker, so that the previous element on the page will be tabbed to
     */
    tabAwayFromFirstElement () {
      const firstElement = this.getFirstInlineFocusableElement()

      firstElement.focus()

      // Reset the tabbableCell as we don't want it to be the `firstElement` if the latter is
      // an edge date from the previous month
      this.tabbableCell = this.inlineTabbableCell
    },
    /**
     * Focuses the last focusable element of an inline datepicker, so that the next element on the page will be tabbed to
     */
    tabAwayFromLastElement () {
      const lastElement = this.getLastInlineFocusableElement()

      lastElement.focus()

      // Reset the tabbableCell as we don't want it to be the `lastElement` if the latter is
      // an edge date from the next month
      this.tabbableCell = this.inlineTabbableCell
    },
    /**
     * Tab backwards through the focus-trapped elements
     */
    tabBackwards () {
      this.navElementsFocusedIndex -= 1

      if (this.navElementsFocusedIndex < 0) {
        this.navElementsFocusedIndex = this.navElements.length - 1
      }

      this.navElements[this.navElementsFocusedIndex].focus()
    },
    /**
     * Tab forwards through the focus-trapped elements
     */
    tabForwards () {
      this.navElementsFocusedIndex += 1

      if (this.navElementsFocusedIndex >= this.navElements.length) {
        this.navElementsFocusedIndex = 0
      }

      this.navElements[this.navElementsFocusedIndex].focus()
    },
    /**
     * Tab through the focus-trapped elements
     * @param event
     */
    tabThroughNavigation (event) {
      if (this.allowNormalTabbing(event)) {
        return
      }

      event.preventDefault()

      if (event.shiftKey) {
        this.tabBackwards()
      } else {
        this.tabForwards()
      }
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
