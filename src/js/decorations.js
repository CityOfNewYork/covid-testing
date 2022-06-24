import $ from 'jquery'

const NOW_TODAY = new Date()

const today_yyyy = NOW_TODAY.getFullYear().toString()
const today_mm = (NOW_TODAY.getMonth() + 1).toString().padStart(2, '0')
const today_dd = NOW_TODAY.getDate().toString().padStart(2, '0')

const TODAY = `${today_yyyy}-${today_mm}-${today_dd}`
const notOpen = []

const HOURS_HTML = '<div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody></tbody></table></div>'

const decorations = {
  extendFeature() {
    const start = new Date(this.get('StartDate') * 1).toISOString().split('T')[0]
    const end = new Date(this.get('EndDate') * 1).toISOString().split('T')[0]
    const noFilter = location.href.split('?').indexOf('nofilter=true') > -1
    if (!noFilter && (start > TODAY || end < TODAY)) {
      console.info(2)
      notOpen.push(this)
    } else {
      this.set(
        'search_label',
        '<b><span class="srch-lbl-lg">' + this.getName() + 
        '</span></b><br><span class="srch-lbl-sm">' + this.getFullAddress() + '</span>'
      )
      this.set('search_name', this.getName())
    }
  },
  getBorough() {
    return this.get('Borough')
  },
  getZip() {
    return this.get('Zipcode')
  },
  getFullAddress() {
    return `${this.getAddress1()}, ${this.getCityStateZip()}`
  },
  getName() {
    return this.get('FacilityName')
  },
  getAddress1() {
    return this.get('Address')
  },
  getCityStateZip() {
    return `${this.getBorough()}, NY ${this.getZip()}`
  },
  getPhone() {
    return this.get('Phone')
  },
  getTip() {
    return this.get('search_label')
  },
  getWebsite() {
    return this.get('Website')
  },
  hours(day) {
    const hrs = this.get(`Hours${day}`)
    if (hrs) {
      return hrs.replace(/-/, ' - ').replace(/am/g, ' AM').replace(/pm/g, ' PM')
    }
    return 'Closed'
  },
  hoursHtml() {
    const opHours = $(HOURS_HTML)
    opHours.find('tbody')
      .append(`<tr><td class="day">Monday</td><td class="hrs notranslate">${this.hours('Monday')}`)
      .append(`<tr><td class="day">Tuesday</td><td class="hrs notranslate">${this.hours('Tuesday')}`)
      .append(`<tr><td class="day">Wednesday</td><td class="hrs notranslate">${this.hours('Wednesday')}`)
      .append(`<tr><td class="day">Thursday</td><td class="hrs notranslate">${this.hours('Thursday')}`)
      .append(`<tr><td class="day">Friday</td><td class="hrs notranslate">${this.hours('Friday')}`)
      .append(`<tr><td class="day">Saturday</td><td class="hrs notranslate">${this.hours('Saturday')}`)
      .append(`<tr><td class="day">Sunday</td><td class="hrs notranslate">${this.hours('Sunday')}`)
    return opHours
  },
  detailsHtml() {
    const walkin = this.get('WalkInsWelcome') === 'Y' ? 'Yes' : 'No'
    const apptAvailable = this.get('AppointmentsAvailable') === 'Y' ? 'Yes' : 'No'
    const minimumAge = this.get('MinimumAge')
    const hours = this.hoursHtml()

    const details = $('<div class="detail"></div>')
      .append(`<div><strong>Walk-ins Welcome: </strong>${walkin}</div>`)
      .append(`<div><strong>Appointment Available: </strong>${apptAvailable}</div>`)
    details.append(hours)
    if (minimumAge && !isNaN(minimumAge))
      details.append(`<i>Tests can be used on people ${minimumAge} years and older.</i>`)

    return details
  }
}

export default {notOpen, decorations}
