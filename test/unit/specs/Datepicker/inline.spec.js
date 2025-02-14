import Datepicker from '@/components/Datepicker.vue'
import { shallowMount } from '@vue/test-utils'

describe('Datepicker.vue inline', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        inline: true
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('shows calendar as already open', () => {
    expect(wrapper.vm.isOpen).toEqual(true)
    expect(wrapper.vm.isInline).toEqual(true)
  })

  it('should not close the calendar when date is selected', () => {
    const date = new Date()
    wrapper.vm.handleSelect({ timestamp: date.getTime() })
    expect(wrapper.vm.isOpen).toEqual(true)
    document.body.click()
    expect(wrapper.vm.isOpen).toEqual(true)
  })
})
