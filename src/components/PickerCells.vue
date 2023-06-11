<template>
  <div>
    <button
      v-for="cell in cells"
      :key="cell.timestamp"
      :class="cellClasses(cell)"
      @click="$emit('select', cell)"
      @keypress.enter="$emit('select', cell)"
      @keypress.space="$emit('select', cell)">
      <slot :cell="cell" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'PickerCells',
  props: {
    cells: {
      type: Array,
      required: true
    },
    showEdgeDates: {
      type: Boolean,
      default: true
    },
    view: {
      type: String,
      validator: (val) => ['day', 'month', 'year'].includes(val),
      required: true
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
    }
  }
}
</script>
