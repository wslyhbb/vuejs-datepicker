import PickerMonth from '@/components/PickerMonth.vue'
import { mount } from '@vue/test-utils'

describe('PickerMonth', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerMonth, {
      propsData: {
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24)
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('knows the selected month', async () => {
    const newDate = new Date(2016, 9, 15)
    await wrapper.setProps({
      selectedDate: newDate
    })

    expect(wrapper.vm.isSelectedMonth(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedMonth(new Date(2017, 1, 1))).toEqual(false)
  })

  it('knows the selected month when useUtc = true', async () => {
    const newDate = new Date(2016, 9, 15)
    await wrapper.setProps({
      selectedDate: newDate,
      useUtc: true
    })
    expect(wrapper.vm.isSelectedMonth(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedMonth(new Date(2017, 1, 1))).toEqual(false)
  })

  it('can set the next year', () => {
    wrapper.vm.changePage({ incrementBy: 1 })
    expect(wrapper.emitted().pageChange[0][0].getFullYear()).toEqual(2019)
  })

  it('can set the previous year', () => {
    wrapper.vm.changePage({ incrementBy: -1 })
    expect(wrapper.emitted().pageChange[0][0].getFullYear()).toEqual(2017)
  })

  it('emits date on selection', () => {
    const time = new Date().getTime()
    wrapper.vm.select({ timestamp: time })
    expect(wrapper.emitted().select).toBeTruthy()
    expect(wrapper.emitted().select[0][0].timestamp).toEqual(time)
  })

  it('emits set-view event with `year` when clicked on the year', () => {
    const yearBtn = wrapper.find('.month__year_btn')
    yearBtn.trigger('click')
    expect(wrapper.emitted('setView')[0][0]).toBe('year')
  })
})
