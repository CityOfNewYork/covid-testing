import $ from 'jquery'

const NOW_TODAY = new Date()

const today_yyyy = NOW_TODAY.getFullYear().toString()
const today_mm = (NOW_TODAY.getMonth() + 1).toString().padStart(2, '0')
const today_dd = NOW_TODAY.getDate().toString().padStart(2, '0')

const TODAY = `${today_yyyy}-${today_mm}-${today_dd}`
const notOpenYet = []

const decorations = {
  extendFeature() {
    const start = this.get('START_DATE')
    if (start > TODAY) {
      notOpenYet.push(this)
    } else {
      this.set(
        'search_label',
        '<b><span class="srch-lbl-lg">' + this.get('NAME') + 
        '</span></b><br><span class="srch-lbl-sm">' + this.getFullAddress() + '</span>'
      )
      this.set('search_name', this.getName())
    }
  },
  getBorough() {
    return {
      '1': 'Manhattan',
      '2': 'Bronx',
      '3': 'Brooklyn',
      '4': 'Queens',
      '5': 'Staten Island'
    }[this.get('BOROUGH')]
  },
  getFullAddress() {
    return `${this.get('ADDRESS')}, ${this.getBorough()}, NY`
  },
  getName() {
    return this.get('NAME')
  },
  getAddress1() {
    return this.get('ADDRESS')
  },
  getAddress2() {
    return this.get('LOCATION_INFO')
  },
  getCityStateZip() {
    return `${this.getBorough()}, NY`
  },
  getPhone() {
    return this.get('PHONE')
  },
  getTip() {
    return this.get('search_label')
  },
  getWebsite() {
    return this.get('URL')
  },
  info(prop) {
    let info = this.get(prop)
    if (info) {
      info = info.replace(/(https?:\/\/[^\s]+)/g, `<a href="$1">$1</a>`)
      info = info.replace(/(\([0-9]{3}\) [0-9]{3}-[0-9]{4})+/g, '<a href="tel:$1">$1</a>')
      return info
    }
  },
  hoursHtml() {
    const opHours = $(`<div class="op-hours"></div>`)
    const tableHtml = $(`<table></table>`)
    tableHtml.append(`<tr><th>Day</th><th>Hours of Operation</th></tr>`)
      .append(`<tr><td>Monday</td><td>${this.get('OPERATIONS_MON')}`)
      .append(`<tr><td>Tuesday</td><td>${this.get('OPERATIONS_TUE')}`)
      .append(`<tr><td>Wednesday</td><td>${this.get('OPERATIONS_WED')}`)
      .append(`<tr><td>Thursday</td><td>${this.get('OPERATIONS_THUR')}`)
      .append(`<tr><td>Friday</td><td>${this.get('OPERATIONS_FRI')}`)
      .append(`<tr><td>Saturday</td><td>${this.get('OPERATIONS_SAT')}`)
      .append(`<tr><td>Sunday</td><td>${this.get('OPERATIONS_SUN')}`)
    opHours.append(tableHtml)
    return opHours
  },
  detailsHtml() {
    const apptOnly = this.get('APPOINTMENT_ONLY') === 'Y' ? 'Yes' : 'No'
    const appointmentInfo =  this.info('APPOINTMENT_INFO')
    const additionalInfo =  this.get('ADDITIONAL_INFO')
    const startDate = this.get('START_DATE')
    const hours = this.hoursHtml()

    const details = $('<div class="detail"></div>')
      .append(`<div><strong>Start Date: </strong> ${startDate}</div>`)
      .append(`<div><strong>Appointment Only: </strong> ${apptOnly}</div>`)
      .append(hours)

    if (appointmentInfo) {
      details.prepend(`<div><strong>Appointment information:<br></strong> ${appointmentInfo}</div>`)
    }
    if (additionalInfo) {
      details.prepend(`<div><strong>Additional information:<br></strong> ${additionalInfo}</div>`)
    }
    return details
  }
}

export default {notOpenYet, decorations}