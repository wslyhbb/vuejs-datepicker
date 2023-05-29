import { shallowMount } from '@vue/test-utils'
import PickerHeader from '@/components/PickerHeader.vue'

describe('PickerHeader', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PickerHeader, {
      props: {
        isNextDisabled: false,
        isPreviousDisabled: false,
        isRtl: false
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('decrements the page on clicking the `previous` button', async () => {
    const prevButton = wrapper.find('span.prev')
    await prevButton.trigger('click')

    expect(wrapper.emitted('pageChange')[0][0]).toEqual({
      incrementBy: -1
    })
  })

  it('increments the page on clicking the `next` button', async () => {
    const nextButton = wrapper.find('span.next')
    await nextButton.trigger('click')

    expect(wrapper.emitted('pageChange')[0][0]).toEqual({
      incrementBy: 1
    })
  })
})
