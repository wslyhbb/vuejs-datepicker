<template>
  <div id="app">
    <h1>Datepicker Examples</h1>
    <div class="example">
      <h3>Default datepicker...</h3>
      <datepicker placeholder="Select Date" />
      <code>
          &lt;datepicker placeholder="Select Date"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Custom first-day-of-week datepicker</h3>
      <datepicker placeholder="Select date" first-day-of-week="mon" />
      <code>
        &lt;datepicker placeholder="Select date"
        first-day-of-week="mon"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Typeable datepicker</h3>
      <datepicker placeholder="Type or select date" :typeable="true" />
      <code>
          &lt;datepicker placeholder="Type or select date" :typeable="true"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Typeable datepicker with custom formatter (dd.MM.yyyy)</h3>
      <datepicker placeholder="Type or select date" :typeable="true" format="dd.MM.yyyy" :parse-typed-date="parseTypedDate" />
      <code>
        &lt;datepicker placeholder="Type or select date" :typeable="true"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Show dates from other months datepicker</h3>
      <datepicker placeholder="Select date" :show-edge-dates="true" />
      <code>
        &lt;datepicker placeholder="Select date"
        :show-edge-dates="true"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>datepicker opens on focus</h3>
      <datepicker placeholder="Type or select date" :typeable="true" :show-calendar-on-focus="true"/>
      <code>
          &lt;datepicker placeholder="Type or select date" :show-calendar-on-focus="true"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Bootstrap styled datepicker</h3>
      <datepicker
        :bootstrapStyling="true"
        :calendarButton="true"
        :clearButton="true"
      >
      </datepicker>
      <code>
          &lt;datepicker placeholder="Select Date"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
        <h3>v-model datepicker</h3>
        <datepicker placeholder="Select Date" v-model="vModelExample"></datepicker>
        <code>
            &lt;datepicker placeholder="Select Date" v-model="vmodelexample"&gt;&lt;/datepicker&gt;
        </code>
        <hr/>
      <p>{{ vModelExample }}</p>
    </div>

    <div class="example">
      <h3>Format datepicker</h3>
      <datepicker :format="format"></datepicker>
      <code>
        &lt;datepicker :format="format"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Format</label>
          <select v-model="format">
            <option value="d MMM yyyy" selected>d MMM yyyy - e.g 12 Feb 2016</option>
            <option value="d MMMM yyyy">d MMMM yyyy - e.g 12 February 2016</option>
            <option value="yyyy-MM-dd">yyyy-MM-dd - e.g 2016-02-12</option>
            <option value="do MMM yyyy">do MMM yyyy - e.g 12th Feb 2016</option>
            <option value="eee do MMM yyyy">eee do MMM YYYY - e.g Sat 12th Feb 2016</option>
          </select>
        </div>
      </div>
    </div>

    <div class="example">
      <h3>With minimum and maximum date range</h3>
      <datepicker :disabledDates="disabledDates"></datepicker>
      <code>
        &lt;datepicker :disabledDates="disabledDates"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Disabled to:</label>
          <datepicker v-on:selected="disableTo"></datepicker>
        </div>
        <div class="form-group">
          <label>Disabled from:</label>
          <datepicker v-on:selected="disableFrom"></datepicker>
        </div>
        <div class="form-group">
          <label>Disabled Days of Month:</label>
          <input type="text" value="" v-on:change="setDisabledDays" placeholder="5,6,12,13">
        </div>
        <pre>disabledDates: {{ disabledDates }}</pre>

        <h5>Resulting Date picker</h5>
        <datepicker :disabledDates="disabledDates"></datepicker>
      </div>
    </div>

    <div class="example">
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Disabled Function:</label>
        </div>
        <pre>
          disabledDates: {
            customPredictor: function (date) {
              // disables every day of a month which is a multiple of 3
              if (date.getDate() % 3 === 0) {
                return true
              }
            }
          }
        </pre>
        <h5>Resulting Date picker</h5>
        <datepicker :disabledDates="disabledFn"></datepicker>
      </div>
    </div>

    <div class="example">
      <h3>Highlighting Dates Matching Given Function</h3>
      <datepicker :highlighted="highlighted"></datepicker>
      <code>
        &lt;datepicker :highlighted="highlighted"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <pre>
          highlighted: {
            customPredictor: function (date) {
              // highlights every day of a month which is a multiple of 4
              if (date.getDate() % 4 === 0) {
                return true
              }
            }
          }
        </pre>

        <h5>Resulting Date picker</h5>
        <datepicker :highlighted="highlightedFn"></datepicker>
      </div>
    </div>

    <div class="example">
      <h3>Highlighting Dates</h3>
      <code>
        &lt;datepicker :highlighted="highlighted"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Highlight from:</label>
          <datepicker v-on:selected="highlightFrom"></datepicker>
        </div>
        <div class="form-group">
          <label>Highlight to:</label>
          <datepicker v-on:selected="highlightTo"></datepicker>
        </div>
        <div class="form-group">
          <label>Highlight Days of Month:</label>
          <input type="text" value="" v-on:change="setHighlightedDays">
        </div>
        <pre>highlighted: {{ highlighted }}</pre>

        <h5>Resulting Date picker</h5>
        <datepicker :highlighted="highlighted"></datepicker>
      </div>
    </div>

    <div class="example">
      <h3>With default open date</h3>
      <datepicker :open-date="openDate"></datepicker>
      <code>
        &lt;datepicker :disabled="disabled"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <div class="form-group">
          <label>Open date:</label>
          <datepicker v-model="openDate"></datepicker>
        </div>
        <pre>open-date: {{ openDate }}</pre>
      </div>
    </div>

    <div class="example">
      <h3>Translations</h3>
      <h5>{{ language.code }} datepicker</h5>

      <datepicker :language="language" format="d MMMM yyyy"></datepicker>
      <code>
          &lt;datepicker :language="language"&gt;&lt;/datepicker&gt;
      </code>
      <div class="settings">
        <h5>Settings</h5>
        <select v-model="language">
          <option :value="language" v-for="(language, key) in languages" :key="key.code">{{ language.code }}</option>
        </select>
      </div>
    </div>

    <div class="example">
      <h3>Inline datepicker</h3>
      <datepicker :inline="true"></datepicker>
      <code>
          &lt;datepicker :inline="true"&gt;&lt;/datepicker&gt;
      </code>
    </div>
    <div class="example">
      <h3>RTL datepicker</h3>
      <datepicker :language="languages.he"></datepicker>
      <code>
          &lt;datepicker :language="languages.he"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Day view only</h3>
      <datepicker minimumView="day" maximumView="day"></datepicker>
      <code>
        &lt;datepicker minimumView="day" maximumView="day"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Day view only RTL</h3>
      <datepicker minimumView="day" maximumView="day" :language="languages.he"></datepicker>
      <code>
        &lt;datepicker minimumView="day" maximumView="day" :language="languages.he"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Month view only</h3>
      <datepicker minimumView="month" maximumView="month"></datepicker>
      <code>
        &lt;datepicker minimumView="month" maximumView="month"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Day and month view only</h3>
      <datepicker minimumView="day" maximumView="month" initialView="month"></datepicker>
      <code>
        &lt;datepicker minimumView="day" maximumView="month" initialView="month"&gt;&lt;/datepicker&gt;
      </code>
    </div>

    <div class="example">
      <h3>Year and month view only</h3>
      <datepicker minimumView="month" maximumView="year" initialView="year"></datepicker>
      <code>
        &lt;datepicker minimumView="month" maximumView="year" initialView="year"&gt;&lt;/datepicker&gt;
      </code>
    </div>

  </div>
</template>

<script>
import Datepicker from '../src/components/Datepicker.vue'
import { parse } from 'date-fns'
import { enUS, ru, he } from 'date-fns/locale'

const state = {
  date1: new Date()
}

export default {
  name: 'DemoComponent',
  components: {
    Datepicker
  },
  data () {
    return {
      styleInput: null,
      format: 'dd.MM.yyyy',
      disabledDates: {},
      openDate: null,
      disabledFn: {
        customPredictor (date) {
          if (date.getDate() % 3 === 0) {
            return true
          }
        }
      },
      highlightedFn: {
        customPredictor (date) {
          if (date.getDate() % 4 === 0) {
            return true
          }
        }
      },
      highlighted: {},
      eventMsg: null,
      state: state,
      vModelExample: null,
      languages: { enUS, ru, he },
      language: enUS
    }
  },
  computed: {
    getInputStyle () {
      return this.styleInput
    }
  },
  methods: {
    highlightTo (val) {
      if (typeof this.highlighted.to === 'undefined') {
        this.highlighted = {
          to: null,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: this.highlighted.from
        }
      }
      this.highlighted.to = val
    },
    highlightFrom (val) {
      if (typeof this.highlighted.from === 'undefined') {
        this.highlighted = {
          to: this.highlighted.to,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: null
        }
      }
      this.highlighted.from = val
    },
    setHighlightedDays (elem) {
      if (elem.target.value === 'undefined') {
        return
      }
      const highlightedDays = elem.target.value
        .split(',')
        .map((day) => parseInt(day, 10))
      this.highlighted = {
        from: this.highlighted.from,
        to: this.highlighted.to,
        daysOfMonth: highlightedDays
      }
    },
    setDisabledDays (elem) {
      if (elem.target.value === 'undefined') {
        return
      }
      const disabledDays = elem.target.value
        .split(',')
        .map((day) => parseInt(day, 10))
      this.disabledDates = {
        from: this.disabledDates.from,
        to: this.disabledDates.to,
        daysOfMonth: disabledDays
      }
    },
    disableTo (val) {
      if (typeof this.disabledDates.to === 'undefined') {
        this.disabledDates = {
          to: null,
          daysOfMonth: this.disabledDates.daysOfMonth,
          from: this.disabledDates.from
        }
      }
      this.disabledDates.to = val
    },
    disableFrom (val) {
      if (typeof this.disabledDates.from === 'undefined') {
        this.disabledDates = {
          to: this.disabledDates.to,
          daysOfMonth: this.disabledDates.daysOfMonth,
          from: null
        }
      }
      this.disabledDates.from = val
    },
    parseTypedDate (input) {
      console.log('input', input)
      let date = parse(input, 'dd.MM.yyyy', new Date())
      console.log('date-fns/parse', date)

      return date
    }
  }
}
</script>

<style>

@import url('https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css');

body {
    font-family: 'Helvetica Neue Light', Helvetica, sans-serif;
    padding: 1em 2em 2em;
}
input, select {
    padding: .75em .5em;
    font-size: 100%;
    border: 1px solid #ccc;
    width: 100%
}

select {
    height: 2.5em;
}

.example {
    background: #f2f2f2;
    border: 1px solid #ddd;
    padding: 0em 1em 1em;
    margin-bottom: 2em;
}

code,
pre {
    margin: 1em 0;
    padding: 1em;
    border: 1px solid #bbb;
    display: block;
    background: #ddd;
    border-radius: 3px;
}

.settings {
    margin: 2em 0;
    border-top: 1px solid #bbb;
    background: #eee;
}

h5 {
    font-size: 100%;
    padding: 0;
}

.form-group {
    margin-bottom: 1em;
}

.form-group label {
    font-size: 80%;
    display: block;
}
</style>
