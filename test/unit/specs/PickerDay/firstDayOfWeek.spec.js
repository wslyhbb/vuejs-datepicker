import { shallowMount } from '@vue/test-utils'
import PickerDay from '@/components/PickerDay'
import { enGB } from 'date-fns/locale'

describe('PickerDay: Set first day of week', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        firstDayOfWeek: 'mon',
        language: enGB,
        pageDate: new Date(2018, 1, 1)
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should return Monday as a first day of week', () => {
    expect(wrapper.vm.daysOfWeek[0]).toEqual('Mon')
  })

  it('should return Sunday as a seventh day of week', () => {
    expect(wrapper.vm.daysOfWeek[6]).toEqual('Sun')
  })

  it('should have 6 days from previous month when month starts on a Sunday', async () => {
    await wrapper.setProps({
      pageDate: new Date(2020, 10, 1)
    })

    for (let i = 0; i < 6; i++) {
      expect(wrapper.vm.days[i].isPreviousMonth).toBeTruthy()
      expect(wrapper.vm.days[i].isNextMonth).toBeFalsy()
    }
  })

  it('should have no days from previous month when month starts on a Monday', async () => {
    await wrapper.setProps({
      pageDate: new Date(2020, 5, 1)
    })

    expect(wrapper.vm.days[0].isPreviousMonth).toBeFalsy()
    expect(wrapper.vm.days[0].isNextMonth).toBeFalsy()
  })
})

describe('PickerDay: Datepicker with Saturday as first day of week', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        firstDayOfWeek: 'sat',
        language: enGB,
        pageDate: new Date(2018, 1, 1)
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should have 6 days from previous month when month starts on a Friday', async () => {
    await wrapper.setProps({
      pageDate: new Date(2021, 0, 1)
    })

    for (let i = 0; i < 6; i++) {
      expect(wrapper.vm.days[i].isPreviousMonth).toBeTruthy()
      expect(wrapper.vm.days[i].isNextMonth).toBeFalsy()
    }
  })

  it('should have no days from previous month when month starts on a Saturday', async () => {
    await wrapper.setProps({
      pageDate: new Date(2020, 7, 1)
    })

    expect(wrapper.vm.days[0].isPreviousMonth).toBeFalsy()
    expect(wrapper.vm.days[0].isNextMonth).toBeFalsy()
  })
})
