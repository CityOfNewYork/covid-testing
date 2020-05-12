import $ from 'jquery'

export default [{
  extendFeature() {
    this.set(
      'search_label',
      '<b><span class="srch-lbl-lg">' + this.getName() + 
      '</span></b><br><span class="srch-lbl-sm">' + this.getFullAddress() + '</span>'
    )
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
      info = info.replace(/(\([0-9]{3}\) [0-9]{3}-[0-9]{4})+/g, '<a href="$1">$1</a>')
      return info
    }
  },
  detailsHtml() {
    const walkIn = this.get('WALK_IN') === 'Y' ? 'Yes' : 'No'
    const nycha = this.get('NYCHA_PRIORITY') === 'Y' ? 'Yes' : 'No'
    const locationInfo =  this.info('LOCATION_INFO')
    const appointmentInfo =  this.info('APPOINTMENT_INFO')
    const criterior =  this.info('PRIORITIZATION_CRITERIA')
    const details = $('<div class="detail"></div>')
      .append(`<div><strong>Open: </strong> ${this.get('DAYS_OF_OPERATION')}, ${this.get('HOURS_OF_OPERATION')}</div>`)
      .append(`<div><strong>Walk in facility: </strong> ${walkIn}</div>`)
      .append(`<div><strong>NYCHA priority site: </strong> ${nycha}</div>`)
      .append(`<div><strong>Testing type: </strong> ${this.get('TESTING_TYPE')}</div>`)
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
}]