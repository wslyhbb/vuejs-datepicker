import { shallowMount, mount } from '@vue/test-utils'
import Datepicker from '@/components/Datepicker.vue'
import DateInput from '@/components/DateInput.vue'

describe('Datepicker unmounted', () => {
  it('has a mounted hook', () => {
    expect(typeof Datepicker.mounted).toEqual('function')
  })

  it('sets the correct default data', () => {
    expect(typeof Datepicker.data).toEqual('function')
    const defaultData = Datepicker.data()
    expect(defaultData.selectedDate).toEqual(null)
    expect(defaultData.view).toEqual('')
    expect(defaultData.calendarHeight).toEqual(0)
  })
})

describe('Datepicker shallowMounted', () => {
  let wrapper
  let date
  beforeEach(() => {
    date = new Date(2016, 1, 15)
    wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'YYYY-MM-dd',
        modelValue: date
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('correctly sets the value when created', () => {
    expect(wrapper.vm.modelValue).toEqual(date)
  })

  it('correctly sets the value from method', () => {
    const newDate = new Date(2016, 9, 15)
    expect(typeof wrapper.vm.setValue).toEqual('function')
    wrapper.vm.setValue(newDate)
    expect(wrapper.vm.selectedDate).toEqual(newDate)
    const now = new Date()
    wrapper.vm.setValue()
    expect(wrapper.vm.selectedDate).toEqual(null)
    const pageDate = new Date(wrapper.vm.pageDate)
    expect(pageDate.getFullYear()).toEqual(now.getFullYear())
    expect(pageDate.getMonth()).toEqual(now.getMonth())
    expect(pageDate.getDate()).toEqual(1)
  })

  it('sets the date', () => {
    const date = new Date(2016, 9, 9)
    const wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'YYYY-MM-dd'
      }
    })
    wrapper.vm.setDate(date.getTime())
    expect(wrapper.vm.selectedDate.getTime()).toEqual(date.getTime())
  })

  it('clears the date', () => {
    const date = new Date(2016, 9, 9)
    const wrapper = shallowMount(Datepicker)
    wrapper.vm.setDate(date.getTime())
    wrapper.vm.clearDate()
    expect(wrapper.vm.selectedDate).toEqual(null)
  })

  it('should set pageTimestamp to be now', () => {
    const data = Datepicker.data()
    const d = new Date(data.pageTimestamp)
    expect(d.getFullYear()).toEqual(new Date().getFullYear())
    expect(d.getMonth()).toEqual(new Date().getMonth())
    expect(d.getDate()).toEqual(1)
  })

  it('should open and close the calendar', () => {
    wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.setView('day')
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.setView('month')
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.setView('year')
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)
  })

  it('should emit selectedDisabled on a disabled timestamp', () => {
    const date = new Date(2016, 9, 1)
    wrapper.vm.selectDisabledDate({ timestamp: date.getTime() })
    expect(wrapper.emitted().selectedDisabled).toBeTruthy()
  })

  it('can select a day', () => {
    const date = new Date(2016, 9, 1)

    wrapper.vm.setView('day')
    wrapper.vm.handleSelect({ timestamp: date.getTime() })
    expect(wrapper.vm.pageTimestamp).toEqual(date.getTime())
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(9)
    expect(wrapper.emitted().selected).toBeTruthy()
  })

  it('can select a month', () => {
    const date = new Date(2016, 9, 9)

    wrapper.vm.setView('month')
    wrapper.vm.handleSelect({ timestamp: date.getTime() })
    expect(wrapper.emitted().changedMonth).toBeTruthy()
    expect(wrapper.emitted().changedMonth[0][0].timestamp).toEqual(date.getTime())
    expect(wrapper.vm.pageDate.getMonth()).toEqual(date.getMonth())
  })

  it('can select a year', () => {
    const date = new Date(2018, 9, 9)

    wrapper.vm.setView('year')
    wrapper.vm.handleSelect({ timestamp: date.getTime() })
    expect(wrapper.emitted().changedYear).toBeTruthy()
    expect(wrapper.emitted().changedYear[0][0].timestamp).toEqual(date.getTime())
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(date.getFullYear())
  })

  it('resets the default page date', () => {
    const wrapper = shallowMount(Datepicker)
    const today = new Date()
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
    expect(wrapper.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapper.vm.pageDate.getDate()).toEqual(1)
    wrapper.vm.resetDefaultPageDate()
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
    expect(wrapper.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapper.vm.pageDate.getDate()).toEqual(1)
  })

  it('does not set the default page date if a date is selected', () => {
    const wrapper = shallowMount(Datepicker)
    const today = new Date()
    const pastDate = new Date(2018, 3, 20)
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
    expect(wrapper.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapper.vm.pageDate.getDate()).toEqual(1)
    wrapper.vm.setDate(pastDate.getTime())
    wrapper.vm.resetDefaultPageDate()
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(pastDate.getFullYear())
    expect(wrapper.vm.pageDate.getMonth()).toEqual(pastDate.getMonth())
    expect(wrapper.vm.pageDate.getDate()).toEqual(1)
  })

  it('watches value', async () => {
    const wrapper = shallowMount(Datepicker, {
      propsData: {
        modelValue: '2018-01-01'
      }
    })
    const spy = jest.spyOn(wrapper.vm, 'setValue')
    wrapper.setProps({ modelValue: '2018-04-26' })
    await wrapper.vm.$nextTick()
    expect(spy).toBeCalled()
  })

  it('watches openDate', async () => {
    const wrapper = shallowMount(Datepicker, {
      propsData: {
        openDate: new Date(2018, 0, 1)
      }
    })
    const spy = jest.spyOn(wrapper.vm, 'setPageDate')
    wrapper.setProps({ openDate: new Date(2018, 3, 26) })
    await wrapper.vm.$nextTick()
    expect(spy).toBeCalled()
  })

  it('watches initialView when open', async () => {
    const wrapper = shallowMount(Datepicker, {
      propsData: {
        initialView: 'day'
      }
    })
    const spy = jest.spyOn(wrapper.vm, 'setInitialView')
    await wrapper.vm.open()
    await wrapper.setProps({ initialView: 'month' })
    expect(spy).toBeCalled()
  })

  it('knows the next view up / down', () => {
    wrapper.vm.setView('day')

    expect(wrapper.vm.nextView.down).toBeUndefined()
    expect(wrapper.vm.nextView.up).toBe('month')

    wrapper.vm.setView('month')

    expect(wrapper.vm.nextView.down).toBe('day')
    expect(wrapper.vm.nextView.up).toBe('year')

    wrapper.vm.setView('year')

    expect(wrapper.vm.nextView.down).toBe('month')
    expect(wrapper.vm.nextView.up).toBe('decade')
  })

  it('emits changedMonth/Year/Decade', () => {
    const pageDate = new Date(2016, 9, 1)

    wrapper.vm.setView('day')
    wrapper.vm.handlePageChange({ pageDate })

    expect(wrapper.emitted().changedMonth).toBeTruthy()

    wrapper.vm.setView('month')
    wrapper.vm.handlePageChange({ pageDate })
    expect(wrapper.emitted().changedYear).toBeTruthy()

    wrapper.vm.setView('year')
    wrapper.vm.handlePageChange({ pageDate })
    expect(wrapper.emitted().changedDecade).toBeTruthy()
  })
})

describe('Datepicker.vue set by string', () => {
  let wrapper
  it('can parse a string date', () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy MM dd',
        modelValue: '2016 02 20'
      }
    })
    const date = new Date('2016-02-20')
    // date-fns parses dates in local time but new Date is parsed in UTC
    // need to make them same timezone before comparing
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    expect(wrapper.vm.selectedDate.getFullYear()).toEqual(date.getFullYear())
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(date.getMonth())
    expect(wrapper.vm.selectedDate.getDate()).toEqual(date.getDate())
  })

  it('should nullify malformed value', () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        modelValue: 'today'
      }
    })
    expect(wrapper.vm.selectedDate).toBeNull()
  })
})

describe('Datepicker.vue set by timestamp', () => {
  let wrapper
  it('can parse unix timestamp', () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        format: 'yyyy-MM-dd',
        modelValue: new Date(Date.UTC(2018, 0, 29)).getTime()
      }
    })
    expect(wrapper.vm.selectedDate.getUTCFullYear()).toEqual(2018)
    expect(wrapper.vm.selectedDate.getUTCMonth()).toEqual(0)
    expect(wrapper.vm.selectedDate.getUTCDate()).toEqual(29)
  })
})

describe('Datepicker.vue using UTC', () => {
  let wrapper
  it('correctly sets the value using UTC', async () => {
    const timezoneOffset = ((new Date()).getTimezoneOffset() / 60)

    // this is ambiguous because localzone differs by one day than UTC
    const ambiguousHour = 24 - timezoneOffset
    const ambiguousDate = new Date(Date.UTC(2018, 3, 15, ambiguousHour))
    const ambiguousYear = ambiguousDate.getUTCFullYear()
    const ambiguousMonth = (`0${ambiguousDate.getUTCMonth() + 1}`).slice(-2)
    const ambiguousDay = (`0${ambiguousDate.getUTCDate()}`).slice(-2)
    const UTCString = `${ambiguousYear} ${ambiguousMonth} ${ambiguousDay}`

    // It's important to use the `mount` helper here
    wrapper = mount(Datepicker, {
      propsData: {
        format: 'yyyy MM dd',
        modelValue: ambiguousDate,
        useUtc: true // This should fail if `useUtc=false`
      }
    })
    // It's important to assert the input rendered output
    await wrapper.vm.$nextTick()
    return expect(wrapper.findComponent(DateInput).vm.formattedValue).toEqual(UTCString)
  })
})

describe('Datepicker with initial-view', () => {
  let wrapper
  it('should open in Day view', () => {
    wrapper = shallowMount(Datepicker)
    wrapper.vm.open()
    expect(wrapper.vm.computedInitialView).toEqual('day')
    expect(wrapper.vm.view).toEqual('day')
  })

  it('should open in Month view', () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        initialView: 'month'
      }
    })
    wrapper.vm.open()
    expect(wrapper.vm.computedInitialView).toEqual('month')
    expect(wrapper.vm.view).toEqual('month')
  })

  it('should open in Year view', () => {
    wrapper = shallowMount(Datepicker, {
      propsData: {
        initialView: 'year'
      }
    })
    wrapper.vm.open()
    expect(wrapper.vm.computedInitialView).toEqual('year')
    expect(wrapper.vm.view).toEqual('year')
  })
})
