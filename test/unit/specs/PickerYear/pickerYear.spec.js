import { mount } from '@vue/test-utils'
import PickerYear from '@/components/PickerYear.vue'

describe('PickerYear', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerYear, {
      propsData: {
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24)
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('knows the selected year', async () => {
    const newDate = new Date(2016, 9, 15)

    await wrapper.setProps({
      selectedDate: newDate
    })

    expect(wrapper.vm.isSelectedYear(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedYear(new Date(2017, 1, 1))).toEqual(false)
  })

  it('knows the selected year when useUtc = true', async () => {
    const newDate = new Date(2016, 9, 15)

    await wrapper.setProps({
      selectedDate: newDate,
      useUtc: true
    })

    expect(wrapper.vm.isSelectedYear(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedYear(new Date(2017, 1, 1))).toEqual(false)
  })

  it('can set the next decade', () => {
    wrapper.vm.changePage({ incrementBy: 1 })
    expect(wrapper.emitted().pageChange).toBeTruthy()
  })

  it('can set the previous decade', () => {
    wrapper.vm.changePage({ incrementBy: -1 })
    expect(wrapper.emitted().pageChange).toBeTruthy()
  })

  it('formats the decade range', async () => {
    await wrapper.setProps({
      pageDate: new Date(2021, 1, 1)
    })

    expect(wrapper.vm.pageTitleYear).toEqual('2020 - 2029')

    await wrapper.setProps({
      pageDate: new Date(2001, 1, 1)
    })

    expect(wrapper.vm.pageTitleYear).toEqual('2000 - 2009')
  })

  it('emits an event when selected', () => {
    wrapper.vm.select({ isDisabled: false })
    expect(wrapper.emitted().select).toBeTruthy()
  })
})
