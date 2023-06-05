import { mount } from '@vue/test-utils'
import PickerMonth from '@/components/PickerMonth.vue'

describe('PickerMonth', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerMonth, {
      propsData: {
        pageDate: new Date(2018, 3, 1),
        selectedDate: new Date(2018, 3, 19)
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('disables months from a given date', async () => {
    await wrapper.setProps({
      disabledDates: {
        from: new Date(2015, 9, 1)
      }
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2015, 9, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledMonth(new Date(2015, 10, 1))).toEqual(true)
  })

  it('disables months to a given date', async () => {
    await wrapper.setProps({
      disabledDates: {
        to: new Date(2017, 9, 1)
      }
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2017, 8, 1))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2017, 9, 1))).toEqual(false)
  })

  it('accepts an array of disabled dates', async () => {
    const dates = Array.from(new Array(31), (val, index) => {
      return new Date(2016, 9, index + 1)
    })

    await wrapper.setProps({
      disabledDates: {
        dates
      }
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2016, 8, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledMonth(new Date(2016, 9, 1))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2016, 10, 1))).toEqual(false)

    await wrapper.setProps({
      disabledDates: {
        dates: dates.pop()
      }
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2016, 9, 1))).toEqual(false)
  })

  it('accepts an array of disabled dates in a range', async () => {
    await wrapper.setProps({
      disabledDates: {
        ranges: [
          {
            from: new Date(2005, 6, 1),
            to: new Date(2016, 9, 1)
          },
          {
            from: new Date(2016, 10, 1),
            to: new Date(2030, 11, 1)
          }
        ]
      }
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2005, 5, 1))).toEqual(false)
    expect(wrapper.vm.isDisabledMonth(new Date(2006, 6, 1))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2030, 10, 1))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2030, 11, 1))).toEqual(false)
  })

  it('accepts a customPredictor to check if the month is disabled', async () => {
    await wrapper.setProps({
      disabledDates: {
        customPredictor (date) {
          return date.getMonth() % 4 === 0
        }
      }
    })

    expect(wrapper.vm.isDisabledMonth(new Date(2018, 4, 29))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2018, 9, 28))).toEqual(false)
    expect(wrapper.vm.isDisabledMonth(new Date(2018, 8, 24))).toEqual(true)
    expect(wrapper.vm.isDisabledMonth(new Date(2018, 2, 11))).toEqual(false)
  })

  it('sets `isNextDisabled` and `isPreviousDisabled` correctly', async () => {
    await wrapper.setProps({
      disabledDates: {
        from: new Date(2018, 5, 1),
        to: new Date(2018, 0, 1)
      }
    })

    expect(wrapper.vm.isNextDisabled).toBeTruthy()
    expect(wrapper.vm.isPreviousDisabled).toBeTruthy()
  })
})
