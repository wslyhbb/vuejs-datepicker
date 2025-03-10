<template>
  <div class="picker-cells">
    <button
      v-for="(cell, id) in cells"
      :key="cell.timestamp"
      :class="cellClasses(cell)"
      :data-id="id"
      :disabled="cell.isDisabled"
      type="button"
      @click="$emit('select', cell)"
      @keypress.enter="$emit('select', cell)"
      @keypress.space="$emit('select', cell)"
      @keydown.up.prevent="handleArrow(id, -columns)"
      @keydown.down.prevent="handleArrow(id, columns)"
      @keydown.left.prevent="handleArrow(id, isRtl ? 1 : -1)"
      @keydown.right.prevent="handleArrow(id, isRtl ? -1 : 1)">
      <slot :cell="cell" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'PickerCells',
  props: {
    bootstrapStyling: {
      type: Boolean,
      default: false
    },
    cells: {
      type: Array,
      required: true
    },
    isRtl: {
      type: Boolean,
      default: false
    },
    showEdgeDates: {
      type: Boolean,
      default: true
    },
    tabbableCellId: {
      type: Number,
      default: null
    },
    view: {
      type: String,
      validator: (val) => ['day', 'month', 'year'].includes(val),
      required: true
    }
  },
  emits: {
    arrow (config) {
      return typeof config === 'object'
    },
    select (cell) {
      return typeof cell === 'object'
    }
  },
  computed: {
    /**
     * The number of columns in the picker
     * @return {Number}
     */
    columns () {
      return this.view === 'day' ? 7 : 3
    }
  },
  methods: {
    /**
     * Set the classes for a specific cell
     * @return {Array}
     */
    cellClasses (cell) {
      return [
        'cell',
        this.view,
        {
          blank: cell.date === '',
          btn: this.bootstrapStyling,
          disabled: cell.isDisabled,
          'highlight-start': cell.isHighlightStart,
          'highlight-end': cell.isHighlightEnd,
          highlighted: cell.isHighlighted,
          muted: cell.isPreviousMonth || cell.isNextMonth,
          sat: cell.isSaturday,
          sun: cell.isSunday,
          selected: this.showEdgeDates
            ? cell.isSelected
            : cell.isSelected && !cell.isPreviousMonth && !cell.isNextMonth,
          today: this.showEdgeDates
            ? cell.isToday
            : cell.isToday && !cell.isPreviousMonth && !cell.isNextMonth,
          weekend: cell.isWeekend
        }
      ]
    },
    /**
     * Emits an `arrow` event
     */
    handleArrow (cellId, delta) {
      this.$emit('arrow', { cellId, delta })
    }
  }
}
</script>
