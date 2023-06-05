import PickerDay from '@/components/PickerDay.vue'
import { mount } from '@vue/test-utils'
import { enGB } from 'date-fns/locale'

describe('PickerDay: changing months', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerDay, {
      propsData: {
        language: enGB,
        selectedDate: new Date(2018, 2, 24),
        pageDate: new Date(2018, 1, 1)
      }
    })
  })

  it('can set the next month', () => {
    wrapper.vm.changePage({ incrementBy: 1 })
    expect(wrapper.emitted().pageChange).toBeTruthy()
    expect(wrapper.emitted().pageChange[0][0].getMonth()).toEqual(2)
  })

  it('can set the previous month', () => {
    wrapper.vm.changePage({ incrementBy: -1 })
    expect(wrapper.emitted().pageChange).toBeTruthy()
    expect(wrapper.emitted().pageChange[0][0].getMonth()).toEqual(0)
  })
})
