import $ from 'jquery'

const NOW_TODAY = new Date()

const today_yyyy = NOW_TODAY.getFullYear().toString()
const today_mm = (NOW_TODAY.getMonth() + 1).toString().padStart(2, '0')
const today_dd = NOW_TODAY.getDate().toString().padStart(2, '0')

const TODAY = `${today_yyyy}-${today_mm}-${today_dd}`
const notOpenYet = []

const HOURS_HTML = '<div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody></tbody></table></div>'

const decorations = {
  extendFeature() {
    const start = this.get('START_DATE')
    if (start > TODAY) {
      notOpenYet.push(this)
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
    return `${this.get('FACILITY_TYPE') === 'CityMD' ? 'CityMD/' : ''}${this.get('NAME')}`
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
      info = info.replace(/([0-9]{3}-[0-9]{3}-[0-9]{4})+/g, '<a href="tel:$1">$1</a>')
      return info
    }
  },
  hours(day) {
    return this.get(day) || 'Closed'
  },
  hoursHtml() {
    const opHours = $(HOURS_HTML)
    opHours.find('tbody')
      .append(`<tr><td class="day">Monday</td><td class="hrs">${this.hours('OPERATIONS_MON')}`)
      .append(`<tr><td class="day">Tuesday</td><td class="hrs">${this.hours('OPERATIONS_TUE')}`)
      .append(`<tr><td class="day">Wednesday</td><td class="hrs">${this.hours('OPERATIONS_WED')}`)
      .append(`<tr><td class="day">Thursday</td><td class="hrs">${this.hours('OPERATIONS_THUR')}`)
      .append(`<tr><td class="day">Friday</td><td class="hrs">${this.hours('OPERATIONS_FRI')}`)
      .append(`<tr><td class="day">Saturday</td><td class="hrs">${this.hours('OPERATIONS_SAT')}`)
      .append(`<tr><td class="day">Sunday</td><td class="hrs">${this.hours('OPERATIONS_SUN')}`)
    return opHours
  },
  detailsHtml() {
    const apptOnly = this.get('APPOINTMENT_ONLY') === 'Y' ? 'Yes' : 'No'
    const appointmentInfo =  this.info('APPOINTMENT_INFO')
    const additionalInfo =  this.get('ADDITIONAL_INFO')
    const hours = this.hoursHtml()

    const details = $('<div class="detail"></div>')
      .append(`<div><strong>Appointment Required: </strong> ${apptOnly}</div>`)

    if (appointmentInfo) {
      details.append(
        `<div><strong>Appointment information:</strong>${appointmentInfo.length < 20 ? ' ' : '<br>'}${appointmentInfo}</div>`
      )
    }
    if (additionalInfo) {
      details.append(
        `<div><strong>Additional information:</strong>${additionalInfo.length < 20 ? ' ' : '<br>'}${additionalInfo}</div>`
      )
    }
    details.append(hours)

    return details
  }
}

export default {notOpenYet, decorations}