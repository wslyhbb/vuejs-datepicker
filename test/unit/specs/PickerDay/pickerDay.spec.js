import PickerDay from '@/components/PickerDay.vue'
import { mount } from '@vue/test-utils'
import { enGB, mn } from 'date-fns/locale'

describe('PickerDay: DOM', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PickerDay, {
      propsData: {
        allowedToShowView: () => true,

        language: enGB,
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24)
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('knows the selected date', async () => {
    const newDate = new Date(2016, 9, 15)
    await wrapper.setProps({
      selectedDate: newDate
    })

    expect(wrapper.vm.isSelectedDate(newDate)).toEqual(true)
    expect(wrapper.vm.isSelectedDate(new Date(2017, 1, 1))).toEqual(false)
  })

  it('can set the next month', () => {
    wrapper.vm.changePage({ incrementBy: 1 })
    expect(wrapper.emitted().changedMonth[0][0].getMonth()).toEqual(2)
  })

  it('can set the previous month', () => {
    wrapper.vm.changePage({ incrementBy: -1 })
    expect(wrapper.emitted().changedMonth[0][0].getMonth()).toEqual(0)
  })

  it('emits an event when selected', () => {
    wrapper.vm.selectDate({ isDisabled: false })
    expect(wrapper.emitted().selectDate).toBeTruthy()
  })

  it('knows the current page month', async () => {
    expect(wrapper.vm.pageMonth).toEqual(1)
    expect(wrapper.vm.currMonthName).toEqual('Feb')

    await wrapper.setProps({
      showFullMonthName: true
    })
    expect(wrapper.vm.currMonthName).toEqual('February')
  })

  it('displays page title correctly', async () => {
    expect(wrapper.vm.pageTitleDay).toEqual('Feb 2018')

    await wrapper.setProps({
      language: mn // Mongolian has dates in ymd format
    })

    expect(wrapper.vm.pageTitleDay).toEqual('2018 2-р сар')
  })

  it('emits set-view event with `month` when clicked on the month', async () => {
    const yearBtn = wrapper.find('.day__month_btn')
    yearBtn.trigger('click')
    expect(wrapper.emitted('setView')[0][0]).toBe('month')
  })

  it('does not display edge dates by default', () => {
    const cells = wrapper.findAll('span.cell.day')
    const firstCell = cells[0]
    const lastCell = cells[34]

    expect(firstCell.text()).toBe('')
    expect(lastCell.text()).toBe('')
  })

  it('displays edge dates when show-edge-dates = true', async () => {
    await wrapper.setProps({
      showEdgeDates: true
    })

    const cells = wrapper.findAll('span.cell.day')
    const firstCell = cells[0]
    const lastCell = cells[34]

    expect(firstCell.text()).toBe('28')
    expect(lastCell.text()).toBe('3')
  })

  it('selects an edge date from the previous month', async () => {
    await wrapper.setProps({
      showEdgeDates: true
    })

    const cells = wrapper.findAll('span.cell.day')
    const firstCell = cells[0]

    await firstCell.trigger('click')

    expect(wrapper.emitted().selectDate[0][0].date).toBe(28)
  })

  it('selects an edge date from the next month', async () => {
    await wrapper.setProps({
      showEdgeDates: true
    })

    const cells = wrapper.findAll('span.cell.day')
    const lastCell = cells[34]

    await lastCell.trigger('click')

    expect(wrapper.emitted().selectDate[0][0].date).toBe(3)
  })

  it("only highlights today's edge date if shown", async () => {
    const day = {
      date: 1,
      isToday: true,
      isPreviousMonth: false,
      isNextMonth: true
    }

    await wrapper.setProps({
      showEdgeDates: true
    })

    let cellClasses = wrapper.vm.$refs.cells.cellClasses(day)

    expect(cellClasses[2].today).toBeTruthy()

    await wrapper.setProps({
      showEdgeDates: false
    })

    cellClasses = wrapper.vm.$refs.cells.cellClasses(day)

    expect(cellClasses[2].today).toBeFalsy()
  })

  it('only highlights selected edge date if shown', async () => {
    const day = {
      date: 1,
      isSelected: true,
      isPreviousMonth: false,
      isNextMonth: true
    }

    await wrapper.setProps({
      showEdgeDates: true
    })

    let cellClasses = wrapper.vm.$refs.cells.cellClasses(day)

    expect(cellClasses[2].selected).toBeTruthy()

    await wrapper.setProps({
      showEdgeDates: false
    })

    cellClasses = wrapper.vm.$refs.cells.cellClasses(day)

    expect(cellClasses[2].selected).toBeFalsy()
  })
})
