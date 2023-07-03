import { shallowMount } from '@vue/test-utils'
import DateInput from '@/components/DateInput.vue'
import { enUS } from 'date-fns/locale'

describe('DateInput shallowMounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DateInput)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render correct contents', () => {
    expect(wrapper.findAll('input')).toHaveLength(1)
  })

  it('clears the date', async () => {
    const input = wrapper.find('input')

    expect(input.element.value).toEqual('')
  })

  it('emits `open` event on click', async () => {
    const input = wrapper.find('input')
    await input.trigger('click')

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('can be disabled', async () => {
    await wrapper.setProps({
      disabled: true
    })

    expect(wrapper.find('input').attributes().disabled).toBeDefined()
  })

  it('emits `close` when escape is pressed and calendar is open', async () => {
    await wrapper.setProps({
      isOpen: true
    })

    const input = wrapper.find('input')
    await input.trigger('keydown.esc')

    expect(wrapper.emitted('closeCalendar')).toBeTruthy()
  })
})

describe('DateInput shallowMounted with selectedDate', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DateInput, {
      propsData: {
        selectedDate: new Date(2018, 2, 24),
        format: 'dd MMM yyyy',
        language: enUS
      }
    })
  })

  it('nulls date', async () => {
    await wrapper.setProps({
      selectedDate: null
    })

    expect(wrapper.vm.formattedValue).toBeNull()
    expect(wrapper.find('input').element.value).toEqual('')
  })

  it('formats date', () => {
    expect(wrapper.vm.formattedValue).toEqual('24 Mar 2018')
    expect(wrapper.find('input').element.value).toEqual('24 Mar 2018')
  })

  it('delegates date formatting', async () => {
    await wrapper.setProps({
      selectedDate: new Date(2016, 1, 15),
      format: () => '2016/1/15'
    })

    expect(wrapper.vm.formattedValue).toEqual('2016/1/15')
    expect(wrapper.find('input').element.value).toEqual('2016/1/15')
  })

  it('accepts a function as a formatter', async () => {
    await wrapper.setProps({
      format: () => '!'
    })

    expect(wrapper.find('input').element.value).toEqual('!')
  })

  it('emits `clear-date` when delete is pressed', async () => {
    const input = wrapper.find('input')

    await input.trigger('keydown.delete')

    expect(wrapper.emitted('clearDate')).toBeTruthy()
  })

  it('emits `clear-date` when backspace is pressed', async () => {
    const input = wrapper.find('input')

    await input.trigger('keydown.backspace')

    expect(wrapper.emitted('clearDate')).toBeTruthy()
  })

  it('adds bootstrap classes', async () => {
    wrapper.setProps({
      bootstrapStyling: true
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('input').element.classList).toContain('form-control')
  })

  it('appends bootstrap classes', async () => {
    wrapper.setProps({
      inputClass: 'someClass',
      bootstrapStyling: true
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('input').element.classList).toContain('form-control')
    expect(wrapper.find('input').element.classList).toContain('someClass')
  })

  it('should open the calendar on focus', async () => {
    wrapper = shallowMount(DateInput, {
      attachTo: document.body,
      propsData: {
        selectedDate: new Date(2018, 2, 24),
        format: 'dd MMM yyyy',
        language: enUS,
        showCalendarOnFocus: true
      }
    })
    wrapper.find('input').trigger('focus')
    expect(wrapper.emitted().open).toBeTruthy()
    wrapper.unmount()
  })
})
