import PickerYear from '@/components/PickerYear.vue'
import { mount } from '@vue/test-utils'

describe('PickerYear', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerYear, {
      propsData: {
        pageDate: new Date(2018, 3, 1),
        selectedDate: new Date(2018, 3, 19),
        disabledDates: {
          to: new Date(2018, 2, 14),
          from: new Date(2018, 4, 15)
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('cannot select a disabled year', () => {
    wrapper.vm.select({ isDisabled: true })
    expect(wrapper.emitted().selectedDisabled).toBeTruthy()
  })

  it('can\'t change decade when previous or next decades are disabled', () => {
    wrapper.setProps({
      pageDate: new Date(2016, 9, 15),
      disabledDates: {
        to: new Date(2010, 8, 6),
        from: new Date(2017, 10, 24)
      }
    })
    expect(wrapper.vm.isPreviousDisabled).toEqual(true)
    expect(wrapper.vm.isNextDisabled).toEqual(true)
  })

  it('can change decade despite having a disabled decade', async () => {
    await wrapper.setProps({
      pageDate: new Date(2016, 9, 15),
      disabledDates: {
        to: new Date(2010, 11, 19),
        from: new Date(2021, 11, 19)
      }
    })

    expect(wrapper.vm.isPreviousDisabled).toEqual(true)
    expect(wrapper.vm.isNextDisabled).toEqual(false)
  })

  it('can accept a customPredictor to check if the year is disabled', async () => {
    await wrapper.setProps({
      disabledDates: {
        customPredictor (date) {
          if (date.getFullYear() % 3 === 0) {
            return true
          }
        }
      }
    })

    expect(wrapper.vm.isDisabledYear(new Date(2018, 4, 29))).toEqual(false)
    expect(wrapper.vm.isDisabledYear(new Date(2019, 9, 28))).toEqual(true)
    expect(wrapper.vm.isDisabledYear(new Date(2020, 8, 24))).toEqual(false)
    expect(wrapper.vm.isDisabledYear(new Date(2021, 2, 11))).toEqual(false)
    expect(wrapper.vm.isDisabledYear(new Date(2022, 2, 11))).toEqual(true)
  })

  it('does not disable the next decade button when disabled from date is in the first year of the next decade', async () => {
    await wrapper.setProps({
      pageDate: new Date(1998, 9, 15),
      disabledDates: {
        from: new Date(2000, 0, 1)
      }
    })

    expect(wrapper.vm.isNextDisabled).toEqual(false)
  })

  it('does disable the next decade button when disabled from date is the last day year of the current decade', () => {
    wrapper.setProps({
      disabledDates: {
        from: new Date(1999, 12, 31)
      }
    })
    expect(wrapper.vm.isNextDisabled).toEqual(true)
  })
})
