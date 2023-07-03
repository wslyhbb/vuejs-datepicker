import { mount, shallowMount } from '@vue/test-utils'
import DateInput from '@/components/DateInput.vue'
import Datepicker from '@/components/Datepicker.vue'

describe('DateInput shallowMounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DateInput, {
      propsData: {
        format: 'dd MMM yyyy',
        typeable: true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('does not format the date when typed', async () => {
    const dateString = '2018-04-24'
    wrapper.vm.input.value = dateString
    expect(wrapper.vm.input.value).toEqual(dateString)
    wrapper.setData({
      typedDate: dateString
    })
    wrapper.setProps({
      selectedDate: new Date(dateString)
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.typedDate).toEqual(dateString)
    expect(wrapper.vm.formattedValue).toEqual(dateString)
  })

  it('emits the date when typed', () => {
    const input = wrapper.find('input')
    wrapper.vm.input.value = '24 Jul 2018'
    input.trigger('keyup')
    expect(wrapper.emitted().typedDate).toBeDefined()
    expect(wrapper.emitted().typedDate[0][0]).toBeInstanceOf(Date)
  })

  it('emits `select-typed-date` when enter is pressed', async () => {
    const input = wrapper.find('input')

    await input.trigger('keydown.enter')

    expect(wrapper.emitted('selectTypedDate')).toBeTruthy()
  })

  it('allows custom date format', async () => {
    const dateString = '24/06/2018'
    wrapper.setProps({
      selectedDate: new Date(),
      typeable: true,
      parseTypedDate: function (dateString) {
        const result = dateString.split('/')
        return new Date(result[2] + '-' + result[1] + '-' + result[0] + 'T00:00:00-03:00')
      }
    })
    await wrapper.vm.$nextTick()

    const input = wrapper.find('input')
    wrapper.vm.input.value = dateString
    expect(wrapper.vm.input.value).toEqual(dateString)
    input.trigger('keyup')
    expect(wrapper.emitted().typedDate[0][0].toISOString()).toEqual('2018-06-24T03:00:00.000Z')
    expect(wrapper.vm.formattedValue).toEqual(dateString)
  })

  it('clears a typed date if it does not parse', () => {
    const input = wrapper.find('input')
    wrapper.setData({ typedDate: 'not a date' })
    input.trigger('blur')
    expect(wrapper.emitted().clearDate).toBeDefined()
  })

  it('doesn\'t emit the date if typeable=false', () => {
    const wrapper = shallowMount(DateInput, {
      propsData: {
        format: 'dd MMM YYYY',

        typeable: false
      }
    })
    const input = wrapper.find('input')
    wrapper.vm.input.value = '2018-04-24'
    input.trigger('keydown')
    input.trigger('keyup')
    expect(wrapper.emitted().typedDate).not.toBeDefined()
  })
})

describe('Datepicker mounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      props: {
        typeable: true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('sets the date and closes the calendar', () => {
    const today = new Date(new Date().setHours(0, 0, 0, 0))

    wrapper.vm.open()
    wrapper.vm.selectTypedDate(today)

    expect(wrapper.vm.selectedDate).toEqual(today)
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('closes the calendar when escape is pressed', async () => {
    const input = wrapper.find('input')

    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBeTruthy()

    await input.trigger('keydown.esc')
    expect(wrapper.vm.isOpen).toBeFalsy()
  })

  it('opens the calendar when the space bar is pressed on the input field', async () => {
    const input = wrapper.find('input')

    await input.trigger('keydown.space')
    await input.trigger('keyup.space')

    expect(wrapper.vm.isOpen).toBeTruthy()
  })
})
