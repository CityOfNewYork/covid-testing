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
        '<b><span class="srch-lbl-lg">' + this.getName() + 
        '</span></b><br><span class="srch-lbl-sm">' + this.getFullAddress() + '</span>'
      )
    }
  },
  getFullAddress() {
    return `${this.get('ADDRESS')}, ${this.get('BOROUGH')}, NY`
  },
  getName() {
    return this.get('NAME')
  },
  getAddress1() {
    return this.get('ADDRESS')
  },
  getCityStateZip() {
    return `${this.get('BOROUGH')}, NY`
  },
  getTip() {
    return this.get('search_label')
  },
  info(prop) {
    let info = this.get(prop)
    if (info) {
      info = info.replace(/(https?:\/\/[^\s]+)/g, `<a href="$1">$1</a>`)
      info = info.replace(/(\([0-9]{3}\) [0-9]{3}-[0-9]{4})+/g, '<a href="tel:$1">$1</a>')
      return info
    }
  },
  detailsHtml() {
    const walkIn = this.get('WALK_IN') === 'Y' ? 'Yes' : 'No'
    const driveTru = this.get('DRIVE_THRU') === 'Y' ? 'Yes' : 'No'
    const nycha = this.get('NYCHA_PRIORITY') === 'Y' ? 'Yes' : 'No'
    const locationInfo =  this.info('LOCATION_INFO')
    const appointmentInfo =  this.info('APPOINTMENT_INFO')
    const criterior =  this.info('PRIORITIZATION_CRITERIA')
    const testType = this.get('TESTING_TYPE')
    const details = $('<div class="detail"></div>')
      .append(`<div><strong>Open: </strong> ${this.get('DAYS_OF_OPERATION')}, ${this.get('HOURS_OF_OPERATION')}</div>`)
      .append(`<div><strong>Walk up facility: </strong> ${walkIn}</div>`)
      .append(`<div><strong>Drive through facility: </strong> ${driveTru}</div>`)
      .append(`<div><strong>NYCHA priority site: </strong> ${nycha}</div>`)
      .append(testType ? `<div><strong>Testing type: </strong> ${testType}</div>`: '')
    if (locationInfo) {
      details.append(`<div><strong>Location information: </strong> ${locationInfo}</div>`)
    }
    if (appointmentInfo) {
      details.append(`<div><strong>Appointment information:<br></strong> ${appointmentInfo}</div>`)
    }
    if (criterior) {
      details.append(`<div><strong>Prioritization criteria:<br></strong> ${criterior}</div>`)
    }
    return details
  }
}

export default {notOpenYet, decorations}