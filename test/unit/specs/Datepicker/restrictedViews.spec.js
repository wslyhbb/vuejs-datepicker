import { mount } from '@vue/test-utils'
import Datepicker from '@/components/Datepicker.vue'

describe('Datepicker with restricted views', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Datepicker)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should default initialView to minimumView', async () => {
    await wrapper.setProps({
      minimumView: 'month'
    })

    expect(wrapper.vm.computedInitialView).toEqual('month')
  })

  it('should save and close when selecting on minimum-view "month"', async () => {
    await wrapper.setProps({
      minimumView: 'month'
    })
    const date = new Date(2016, 9, 12)

    await wrapper.vm.setView('month')
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.handleSelect({ timestamp: date.getTime() })
    expect(date.getFullYear()).toEqual(wrapper.vm.selectedDate.getFullYear())
    expect(date.getMonth()).toEqual(wrapper.vm.selectedDate.getMonth())
    expect(wrapper.vm.isOpen).toEqual(false)
  })

  it('should save and close when selecting on minimum-view "year"', async () => {
    await wrapper.setProps({
      minimumView: 'year'
    })
    const date = new Date(2016, 9, 12)

    await wrapper.vm.setView('year')
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.handleSelect({ timestamp: date.getTime() })
    expect(wrapper.vm.isOpen).toEqual(false)
    expect(date.getFullYear()).toEqual(wrapper.vm.selectedDate.getFullYear())
  })

  it('should only allow views in min-max range', async () => {
    await wrapper.setProps({
      minimumView: 'day',
      maximumView: 'month'
    })

    await wrapper.vm.showCalendar()

    expect(wrapper.vm.allowedToShowView('year')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('day')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
    expect(wrapper.vm.view).toEqual('day')

    const upButton = wrapper.find('.day__month_btn')
    await upButton.trigger('click')
    expect(wrapper.vm.view).toEqual('month')

    await wrapper.setProps({
      minimumView: 'month',
      maximumView: 'month'
    })

    expect(wrapper.vm.allowedToShowView('day')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('year')).toEqual(false)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
    expect(wrapper.vm.view).toEqual('month')

    await wrapper.setProps({
      minimumView: 'day',
      maximumView: 'year'
    })

    expect(wrapper.vm.allowedToShowView('day')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('year')).toEqual(true)
    expect(wrapper.vm.allowedToShowView('month')).toEqual(true)
  })

  it('should throw an error on disallowed initial views', async () => {
    await wrapper.setProps({
      minimumView: 'day',
      maximumView: 'month',
      initialView: 'year'
    })

    expect(function () {
      wrapper.vm.setInitialView()
    }).toThrow()
  })

  it('should not render unused views', async () => {
    await wrapper.setProps({
      minimumView: 'day',
      maximumView: 'day'
    })
    wrapper.vm.showCalendar()
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar').length).toEqual(1)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.month').length).toEqual(0)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.year').length).toEqual(0)
    expect(wrapper.vm.view).not.toEqual('month')

    await wrapper.setProps({
      minimumView: 'month',
      maximumView: 'year'
    })
    await wrapper.vm.close()
    wrapper.vm.showCalendar()
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar').length).toEqual(1)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.day').length).toEqual(0)
    expect(wrapper.vm.$el.querySelectorAll('.vdp-datepicker__calendar .cell.year').length).toEqual(0)
  })
})
