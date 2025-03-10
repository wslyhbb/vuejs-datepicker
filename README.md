[![@wslyhbb/vuejs-datepicker](https://badgen.net/bundlephobia/min/@wslyhbb/vuejs-datepicker)](https://bundlephobia.com/result?p=@wslyhbb/vuejs-datepicker)
[![@wslyhbb/vuejs-datepicker](https://badgen.net/npm/v/@wslyhbb/vuejs-datepicker)](https://www.npmjs.com/package/@wslyhbb/vuejs-datepicker)
[![@wslyhbb/vuejs-datepicker](https://badgen.net/badge/vue.js/3.1.x)](https://v3.vuejs.org/)
[![@wslyhbb/vuejs-datepicker](https://badgen.net/npm/dt/@wslyhbb/vuejs-datepicker)](https://www.npmjs.com/package/@wslyhbb/vuejs-datepicker)
[![@wslyhbb/vuejs-datepicker](https://badgen.net/npm/dw/@wslyhbb/vuejs-datepicker)](https://www.npmjs.com/package/@wslyhbb/vuejs-datepicker)

# Datepicker 2

A datepicker Vue component.

- [Demo](#demo)
- [Install](#install)
- [Upgrade to 2.x+](#upgrade)
- [Usage](#usage)
- [Date Formatting](#date-formatting)
- [Props](#available-props)
- [Events](#events)
- [Disabled dates](#disabled-dates)
- [Highlighted dates](#highlighted-dates)
- [Translations](#translations)

## fork
this is a fork of https://github.com/charliekassel/vuejs-datepicker,
which includes following breaking changes:
* Upgrade all libraries
* uses vue-eslint-parser for eslint.
* Fixed SSR support for NuxtJS (**breaking change v2**) see also [regarding CSS / styles](#regarding-css)
* Merged #611: show calendar on focus prop
* Merged #626: fixes missing close and open events
* Based on #536: Allow custom types, I changed the method to getTypedDate which should return a fully parsed Date object. 
* Added a beforeDateInput slot.
* uses date-fns for translations  (**breaking change v2+**) see [date-fns / translations](#date-fns-and-translations)
* dropped internal formatting rules and also used date-fns (**breaking change 2.x+**) see [date-fns / formatting](#date-fns-and-formatting)

## Demo

To view a demo online:
##### Vue 2
https://codesandbox.io/s/vue-datepicker-demo-hjktwc
##### Vue 3
https://stackblitz.com/edit/vitejs-vite-hgm3ct

To view demo examples locally clone the repo and run `npm install && npm run serve`

## Install

| Vue version | npm Package                   |
| ----------- | ----------------------------- |
| Vue 2       | `@wslyhbb/vuejs-datepicker@3` |
| Vue 3       | `@wslyhbb/vuejs-datepicker@4` |

``` bash
# Vue 2
npm install @wslyhbb/vuejs-datepicker@3

yarn add @wslyhbb/vuejs-datepicker@3
```

``` bash
# Vue 3
npm install @wslyhbb/vuejs-datepicker

yarn add @wslyhbb/vuejs-datepicker
```

``` javascript
import Datepicker from '@wslyhbb/vuejs-datepicker';

export default {
  // ...
  components: {
    Datepicker
  }
  // ...
}
```

## Upgrade
To upgrade to version 2+ check:
* add explicit css inclues, see [regarding CSS / styles](#regarding-css)
* change translation to date-fns, see [date-fns / translations](#date-fns-and-translations)
* change date formats to date-fns, see [date-fns / formatting](#date-fns-and-formatting)

### date-fns and translations

I have changed the translations from internal to use the date-fns, 
therefore you need to change imports
for the "locale" imports e.g.:
```import {en, es} from 'vuejs-datepicker/dist/locale'```
change to:
```import { enUS } from 'date-fns/locale'```

Please see [Translations](#translations) section how to set up your language.

### date-fns and formatting

change custom date formatting to date-fns date formatting: https://date-fns.org/docs/format
Examples:

| Old                           | New (date-fns)  | Displays          |
|-------------------------------|-----------------|------------------ |
| dsu MMM yyyy                  | do MMM yyyy     | 12th Feb 2016     |
| D dsu MMM yyyy                | eee do MMM yyyy | Sat 12th Feb 2016 |

### regarding CSS
As this bundle is also useable for SSR rendering, you have to take care of css yourself. 
(see also https://github.com/vuejs/rollup-plugin-vue/issues/266)
I strongly recommend to create a custom component, that wraps the vuejs-datepicker. Then
it is easy to add custom css and have a consistent style for the datepicker.

#### Method 1: try to include the css directly.
Ensure you have postcss-import up and running. (https://github.com/postcss/postcss-import)
E.g.via:
```
<style lang="scss">
/* purgecss start ignore */
@use "@wslyhbb/vuejs-datepicker/dist/vuejs-datepicker.css"
/* purgecss end ignore */
</style>
```

If you do not use purgeCSS, you can safely remove the comment lines 

#### Method 2: via global nuxt config:
add inside nuxt.config:

```
css: [
 {
  src: '@wslyhbb/vuejs-datepicker/dist/vuejs-datepicker.css',
  lang: 'css'
 },
```

#### Method 3: Copy the relevant css selectors to your custom component.
```
<style lang="scss">
	.vdp-datepicker {
		overflow: visible;
		display: inline-block;
		....
	}
	...
</style>
```

## Usage

``` html
<datepicker></datepicker>
```

*value* prop if passed should be a Date object

``` html
<script>
var state = {
  date: new Date(2016, 9,  16)
}
</script>
<datepicker :value="state.date"></datepicker>
```
support name attribute for normal html form submission
``` html
<datepicker :value="state.date" name="uniquename"></datepicker>
```
Using `v-model`
``` html
<datepicker v-model="state.date" name="uniquename"></datepicker>
```
Emits events
``` html
<datepicker @selected="doSomethingInParentComponentFunction" @opened="datepickerOpenedFunction" @closed="datepickerClosedFunction">
```
Inline always open version
``` html
<datepicker :inline="true"></datepicker>
```
## Available props

| Prop                          | Type            | Default     | Description                                                    |
|-------------------------------|-----------------|-------------|----------------------------------------------------------------|
| autofocus                     | String          |             | Sets html `autofocus` attribute on input                       |
| value                         | Date\|String    |             | Date value of the datepicker                                   |
| name                          | String          |             | Input name property                                            |
| id                            | String          |             | Input id                                                       |
| format                        | String\|Function| dd MMM yyyy | Date formatting string or function                             |
| full-month-name               | Boolean         | false       | To show the full month name                                    |
| language                      | Object          | enUS        | Translation for days and months                                |
| maxlength                     | String          |             | Sets html `maxlength` attribute on input                       |
| disabled                      | Boolean         | false       | If true, disable Datepicker on screen                          |
| disabled-dates                | Object          |             | See below for configuration                                    |
| placeholder                   | String          |             | Input placeholder text                                         |
| inline                        | Boolean         |             | To show the datepicker always open                             |
| calendar-class                | String\|Object  |             | CSS class applied to the calendar el                           |
| input-class                   | String\|Object  |             | CSS class applied to the input el                              |
| wrapper-class                 | String\|Object  |             | CSS class applied to the outer div                             |
| monday-first                  | Boolean         | false       | (Deprecated for first-day-of-week) To start the week           |
| first-day-of-week             | String          | sun         | Sets the first day of the week.                                |
| two-letter-abbr               |                 | false       | Show day abbreviations in two letters                          |
| clear-button                  | Boolean         | false       | Show an icon for clearing the date                             |
| clear-button-icon             | String          |             | (Deprecated for slot) Use icon for button (ex: fa fa-times)    |
| calendar-button               | Boolean         | false       | Show an icon that that can be clicked                          |
| calendar-button-icon          | String          |             | (Deprecated for slot) Use icon for button (ex: fa fa-calendar) |
| calendar-button-icon-content  | String          |             | (Deprecated for slot) Use for material-icons (ex: event)       |
| day-cell-content              | Function        |             | Use to render custom content in day cell                       |
| bootstrap-styling             | Boolean         | false       | Output bootstrap v4 styling classes.                           |
| initial-view                  | String          | minimumView | If set, open on that view                                      |
| required                      | Boolean         | false       | Sets html required attribute on input                          |
| show-edge-dates               | Boolean         | false       | If `false`, dates from previous/next months won't show         |
| tabindex                      | String\|Number  |             | Tabindex for the input                                         |
| typeable                      | Boolean         | false       | If true, allow the user to type the date                       |
| use-utc                       | Boolean         | false       | use UTC for time calculations                                  |
| open-date                     | Date\|String    |             | If set, open on that date                                      |
| pattern                       | String          |             | Sets html `pattern` attribute on input                         |
| minimum-view                  | String          | 'day'       | If set, lower-level views won't show                           |
| maximum-view                  | String          | 'year'      | If set, higher-level views won't show                          |
| parse-typed-date	          	| Function: Date  |             | Use to parse custom date for typed input                       |
| highlighted                   | Object          |             | Dates to be highlighted                                        |

## Events

These events are emitted on actions in the datepicker

| Event             | Output     | Description                          |
|-------------------|------------|--------------------------------------|
| opened            |            | The picker is opened                 |
| closed            |            | The picker is closed                 |
| selected          | Date\|null | A date has been selected             |
| selectedDisabled  | Object     | A disabled date has been selected    |
| input             | Date\|null | Input value has been modified        |
| cleared           |            | Selected date has been cleared       |
| changedMonth      | Object     | Month page has been changed          |
| changedYear       | Object     | Year page has been changed           |
| changedDecade     | Object     | Decade page has been changed         |


## Date formatting

#### String formatter

Uses date-fns for date formatting.
See https://date-fns.org/docs/format
Examples:

| Example         | Displays          |
|-----------------|------------------ |
| d MMM yyyy      | 12 Feb 2016       |
| d MMMM yyyy     | 12 February 2016  |
| yyyy-MM-dd      | 2016-02-12        |
| do MMM yyyy     | 12th Feb 2016     |
| eee do MMM yyyy | Sat 12th Feb 2016 |

| Token | Desc                   | Example               | Version <2.0 |
|-------|------------------------|-----------------------|--------------|
| d     | day                    | 1                     | d            |
| dd    | 0 prefixed day         | 01                    | dd           |
| ccc   | abbr day               | Mon                   | D            |
| do    | date of Month          | 1st 2nd ... 30th 31st | (su)         |
| M     | month number (1 based) | 1 (for Jan)           | M            |
| MM    | 0 prefixed month       | 01                    | MM           |
| MMM   | abbreviated month name | Jan                   | MMM          |
| MMMM  | month name             | January               | MMMM         | 
| yy    | two digit year         | 16                    | yy           |
| yyyy  | four digit year        | 2016                  | yyyy         |

#### Function formatter

Delegates date formatting to provided function.
Function will be called with date and it has to return formated date as a string.
This allow us to use date-fns, globalize or any other library to format date.

``` html
<script>
  methods: {
    customFormatter(date) {
      return format(date, 'MMMM Do yyyy, h:mm:ss a');
    }
  }
</script>
<datepicker :format="customFormatter"></datepicker>
```

## Disabled Dates
Dates can be disabled in a number of ways.

``` html
<script>
var state = {
  disabledDates: {
    to: new Date(2016, 0, 5), // Disable all dates up to specific date
    from: new Date(2016, 0, 26), // Disable all dates after specific date
    days: [6, 0], // Disable Saturday's and Sunday's
    daysOfMonth: [29, 30, 31], // Disable 29th, 30th and 31st of each month
    dates: [ // Disable an array of dates
      new Date(2016, 9, 16),
      new Date(2016, 9, 17),
      new Date(2016, 9, 18)
    ],
    ranges: [{ // Disable dates in given ranges (exclusive).
      from: new Date(2016, 11, 25),
      to: new Date(2016, 11, 30)
    }, {
      from: new Date(2017, 1, 12),
      to: new Date(2017, 2, 25)
    }],
    // a custom function that returns true if the date is disabled
    // this can be used for wiring your own logic to disable a date if none
    // of the above conditions serve your purpose
    // this function should accept a date and return true if it is disabled
    customPredictor: function(date) {
      // disables the date if it is a multiple of 5
      if(date.getDate() % 5 == 0){
        return true
      }
    }
  }
}
</script>
<datepicker :disabledDates="state.disabledDates"></datepicker>
```

## Highlighted Dates
Dates can be highlighted (e.g. for marking an appointment) in a number of ways. Important:
By default disabled dates are ignored, to highlight disabled dates set the `includeDisabled`
property to `true`. Note: Both `to` and `from` properties are required to define a range of
dates to highlight.

``` html
<script>
var state = {
  highlighted: {
    to: new Date(2016, 0, 5), // Highlight all dates up to specific date
    from: new Date(2016, 0, 26), // Highlight all dates after specific date
    days: [6, 0], // Highlight Saturday's and Sunday's
    daysOfMonth: [15, 20, 31], // Highlight 15th, 20th and 31st of each month
    dates: [ // Highlight an array of dates
      new Date(2016, 9, 16),
      new Date(2016, 9, 17),
      new Date(2016, 9, 18)
    ],
    // a custom function that returns true of the date is highlighted
    // this can be used for wiring you own logic to highlight a date if none
    // of the above conditions serve your purpose
    // this function should accept a date and return true if is highlighted
    customPredictor: function(date) {
      // highlights the date if it is a multiple of 4
      if(date.getDate() % 4 == 0){
        return true
      }
    },
    includeDisabled: true // Highlight disabled dates
  }
}
</script>
<datepicker :highlighted="state.highlighted"></datepicker>
```
## Slots

Slots will help you customize content.  .

#### beforeCalendarHeader

Sometimes you need to show custom content before the calendar header. For such cases you can use the named slot `beforeCalendarHeader`.

An example would be to use bootstrap's `input-group-prepend` and `input-group-append`
to show some custom text:
``` html
<datepicker :bootstrap-styling="true">
  <template v-slot:beforeCalendarHeader">
    <div class="calender-header">
      Choose a Date
    </div>
  </template>
</datepicker>
```

#### calendarBtn

To implement calendar button.

#### beforeDateInput

To implement some custom styling on DateInput, you might need to add elemnt before the DateInput. Similar to afterDateInput, just it is before in the html DOM.

#### clearBtn

To implement clear button.

#### afterDateInput

To implement some custom styling (for instance to add an animated placeholder) on DateInput, you might need to add elements as DateInput siblings. Slot named
`afterDateInput` allows you to do that:

``` html
<datepicker>
  <template v-slot:afterDateInput">
    <span class="animated-placeholder">
      Choose a Date
    </span>
  </template>
</datepicker>
```


## Translations

### How to apply language

See also https://date-fns.org/docs/I18n
Especially if you use webpack!

1. You need to load the language file for the locale, e.g. 
Node:
```javascript
import { de } from 'date-fns/locale';
```

2. specify the language in the datepicker component:
```html
<datepicker :language="de"></datepicker>
```
  
Available languages are all that date-fs supports.
See demo file or https://github.com/date-fns/date-fns/tree/main/src/locale for a list of available languages and the correct language code for it.

