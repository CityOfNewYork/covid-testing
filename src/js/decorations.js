import $ from 'jquery'

const HOURS_HTML = '<div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody></tbody></table></div>'

const decorations = {
  extendFeature() {
    this.set(
      'search_label',
      `<b><span class="srch-lbl-lg ${this.cssClass()}">${this.getName()}</span></b><br><span class="srch-lbl-sm">${this.getFullAddress()}</span>`
    )
    this.set('search_name', this.getName())
  },
  cssClass() {
    return this.get('ADACompliant') === 'Y' ? 'acc' : ''
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
    const minimumAge = this.get('MinimumAge') * 1
    const addedInfo = this.get('AdditionalInfo')
    const ada = this.get('ADACompliant') === 'Y' ? 'Yes' : 'No'
    const hours = this.hoursHtml()

    const details = $('<div class="detail"></div>')
      .append(`<div class="ada"><strong>ADA Compliant: </strong>${ada}</div>`)
      .append(`<div class="walk"><strong>Walk-ins Welcome: </strong>${walkin}</div>`)
      .append(`<div class="apt"><strong>Appointment Available: </strong>${apptAvailable}</div>`)
      .append(hours)
    
    const ul = $('<ul><li><strong>NO COST, regardless of insurance or immigration status<strong></li></ul>')
      .append(minimumAge === 0 ? '<li><em>Tests can be used on people of any age.</em></li>'
        : `<li><em>Tests can be used on people ${minimumAge} years and older.</em></li>`)
    if (addedInfo)
      ul.append(`<li>${addedInfo}</li>`)

    return details.append(ul)
  }
}

export default [decorations]
