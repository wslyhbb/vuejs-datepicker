<template>
  <header>
    <button
      ref="prev"
      class="prev"
      :class="{ 'btn': bootstrapStyling, 'rtl': isRtl }"
      :disabled="isPreviousDisabled"
      type="button"
      @click="isRtl ? goToNextPage() : goToPreviousPage()"
      @keydown.down.prevent="focusTabbableCell"
      @keydown.up.prevent="focusInput"
      @keydown.left.prevent="arrowLeftPrev"
      @keydown.right.prevent="arrowRightPrev">&lt;</button>
    <button
      v-if="!isUpDisabled"
      ref="up"
      :class="[ upButtonClasses, 'up', { 'btn': bootstrapStyling }]"
      type="button"
      @click="selectUpButton"
      @keydown.down.prevent="focusTabbableCell"
      @keydown.up.prevent="focusInput"
      @keydown.left.prevent="focusLeftButton"
      @keydown.right.prevent="focusRightButton">
      <slot />
    </button>
    <span v-else
      ref="up">
      <slot />
    </span>
    <button
      ref="next"
      class="next"
      :class="{ 'btn': bootstrapStyling, 'rtl': isRtl }"
      :disabled="isNextDisabled"
      type="button"
      @click="isRtl ? goToPreviousPage() : goToNextPage()"
      @keydown.down.prevent="focusTabbableCell"
      @keydown.up.prevent="focusInput"
      @keydown.left.prevent="arrowLeftNext"
      @keydown.right.prevent="arrowRightNext">&gt;</button>
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
    },
    isUpDisabled: {
      type: Boolean,
      default: false
    },
    nextViewUp: {
      type: String,
      default: null
    },
    upButtonClasses: {
      type: String
    }
  },
  computed: {
    leftButton () {
      return [this.isRtl ? 'next' : 'prev']
    },
    rightButton () {
      return [this.isRtl ? 'prev' : 'next']
    }
  },
  methods: {
    /**
     * Changes the page, or sets focus to the adjacent button
     */
    arrowLeftPrev () {
      if (this.isRtl) {
        this.$emit('setFocus', ['up', 'next', 'tabbableCell'])
        return
      }
      this.goToPreviousPage()
    },
    /**
     * Changes the page, or sets focus to the adjacent button
     */
    arrowRightPrev () {
      if (this.isRtl) {
        this.goToPreviousPage()
        return
      }
      this.$emit('setFocus', ['up', 'next', 'tabbableCell'])
    },
    /**
     * Changes the page, or sets focus to the adjacent button
     */
    arrowLeftNext () {
      if (this.isRtl) {
        this.goToNextPage()
        return
      }
      this.$emit('setFocus', ['up', 'prev', 'tabbableCell'])
    },
    /**
     * Changes the page, or sets focus to the adjacent button
     */
    arrowRightNext () {
      if (this.isRtl) {
        this.$emit('setFocus', ['up', 'prev', 'tabbableCell'])
        return
      }
      this.goToNextPage()
    },
    focusInput () {
      this.$emit('focusInput')
    },
    focusTabbableCell () {
      this.$emit('setFocus', ['tabbableCell'])
    },
    focusLeftButton () {
      this.$emit('setFocus', this.leftButton)
    },
    focusRightButton () {
      this.$emit('setFocus', this.rightButton)
    },
    goToNextPage () {
      this.$emit('pageChange', { incrementBy: 1, focusRefs: ['next'] })
    },
    goToPreviousPage () {
      this.$emit('pageChange', { incrementBy: -1, focusRefs: ['prev'] })
    },
    selectUpButton () {
      if (!this.isUpDisabled) {
        this.$emit('setView', this.nextViewUp)
      }
    }
  }
}
</script>
