<template>
  <header>
    <button
      class="prev"
      :class="{ 'btn': bootstrapStyling }"
      :disabled="isLeftNavDisabled"
      @click="isRtl ? goToNextPage() : goToPreviousPage()">&lt;</button>
    <slot />
    <button
      class="next"
      :class="{ 'btn': bootstrapStyling }"
      :disabled="isRightNavDisabled"
      @click="isRtl ? goToPreviousPage() : goToNextPage()">&gt;</button>
  </header>
</template>

<script>
export default {
  props: {
    bootstrapStyling: {
      type: Boolean,
      default: false
    },
    isNextDisabled: {
      type: Boolean,
      required: true
    },
    isPreviousDisabled: {
      type: Boolean,
      required: true
    },
    isRtl: {
      type: Boolean,
      required: true
    }
  },
  emits: {
    pageChange: (page) => {
      return typeof page === 'object'
    }
  },
  computed: {
    /**
     * Is the left hand navigation button disabled?
     * @return {Boolean}
     */
    isLeftNavDisabled () {
      return this.isRtl
        ? this.isNextDisabled
        : this.isPreviousDisabled
    },
    /**
     * Is the right hand navigation button disabled?
     * @return {Boolean}
     */
    isRightNavDisabled () {
      return this.isRtl
        ? this.isPreviousDisabled
        : this.isNextDisabled
    }
  },
  methods: {
    goToNextPage () {
      this.$emit('pageChange', { incrementBy: 1 })
    },
    goToPreviousPage () {
      this.$emit('pageChange', { incrementBy: -1 })
    }
  }
}
</script>
