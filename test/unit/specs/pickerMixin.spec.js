import { shallowMount } from '@vue/test-utils'
import pickerMixin from '@/mixins/pickerMixin.js'

const Component = {
  render () {},
  mixins: [pickerMixin]
}

const options = {
  mixins: [pickerMixin],
  props: {
    selectedDate: new Date(2018, 2, 24)
  }
}

describe('pickerMixin shallowMounted', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Component, options)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('mounts', () => {
    expect(wrapper.vm).toBeTruthy()
  })
})
