import { shallowMount } from '@vue/test-utils'
import PickerDay from '@/components/PickerDay.vue'
import { enGB } from 'date-fns/locale'

describe('PickerDay: Datepicker with monday as first day of week', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        mondayFirst: true,
        language: enGB,
        pageDate: new Date(2018, 1, 1)
      }
    })
  })

  it('should return Monday as a first day of week', () => {
    expect(wrapper.vm.daysOfWeek[0]).toEqual('Mon')
  })

  it('should return Sunday as a seventh day of week', () => {
    expect(wrapper.vm.daysOfWeek[6]).toEqual('Sun')
  })

  it('should have 6 days when month starts from Sunday', async () => {
    await wrapper.setProps({
      pageDate: new Date(2020, 10, 1)
    })

    for (let i = 0; i < 6; i++) {
      expect(wrapper.vm.days[i].isPreviousMonth).toBeTruthy()
      expect(wrapper.vm.days[i].isNextMonth).toBeFalsy()
    }
  })

  it('should have no days when month starts from Monday', async () => {
    await wrapper.setProps({
      pageDate: new Date(2020, 5, 1)
    })

    expect(wrapper.vm.days[0].isPreviousMonth).toBeFalsy()
    expect(wrapper.vm.days[0].isNextMonth).toBeFalsy()
  })
})
