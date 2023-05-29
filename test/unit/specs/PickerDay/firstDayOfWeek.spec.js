import { shallowMount } from '@vue/test-utils'
import PickerDay from '@/components/PickerDay'

describe('PickerDay: Set first day of week', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        firstDayOfWeek: 'mon',
        allowedToShowView: () => true,
        pageDate: new Date(2018, 1, 1)
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should return Monday as a first day of week', () => {
    expect(wrapper.vm.daysOfWeek[0]).toEqual('Mon')
  })

  it('should return Sunday as a seventh day of week', () => {
    expect(wrapper.vm.daysOfWeek[6]).toEqual('Sun')
  })

  it('should have 6 blankDays when month starts on a Sunday', async () => {
    await wrapper.setProps({
      pageDate: new Date(2018, 3, 1)
    })
    expect(wrapper.vm.blankDays).toEqual(6)
  })

  it('should have no blankDays when month starts on a Monday', async () => {
    await wrapper.setProps({
      pageDate: new Date(2018, 9, 1)
    })
    expect(wrapper.vm.blankDays).toEqual(0)
  })
})

describe('PickerDay: Datepicker with Saturday as first day of week', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        firstDayOfWeek: 'sat',
        allowedToShowView: () => true,
        pageDate: new Date(2018, 1, 1)
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should have 6 blankDays when month starts on a Friday', async () => {
    await wrapper.setProps({
      pageDate: new Date(2021, 0, 1)
    })
    expect(wrapper.vm.blankDays).toEqual(6)
  })

  it('should have no blankDays when month starts on a Saturday', async () => {
    await wrapper.setProps({
      pageDate: new Date(2020, 7, 1)
    })
    expect(wrapper.vm.blankDays).toEqual(0)
  })
})
