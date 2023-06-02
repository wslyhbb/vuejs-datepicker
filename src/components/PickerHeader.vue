<template>
  <header>
    <span
      class="prev" tabindex="0"
      :class="{'disabled': isLeftNavDisabled}"
      @click="isRtl ? goToNextPage() : goToPreviousPage()">&lt;</span>
    <slot />
    <span
      class="next" tabindex="0"
      :class="{'disabled': isRightNavDisabled}"
      @click="isRtl ? goToPreviousPage() : goToNextPage()">&gt;</span>
  </header>
</template>

<script>
export default {
  props: {
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
