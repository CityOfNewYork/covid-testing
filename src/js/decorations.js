import $ from 'jquery'

const NOW_TODAY = new Date()

const today_yyyy = NOW_TODAY.getFullYear().toString()
const today_mm = (NOW_TODAY.getMonth() + 1).toString().padStart(2, '0')
const today_dd = NOW_TODAY.getDate().toString().padStart(2, '0')

const TODAY = `${today_yyyy}-${today_mm}-${today_dd}`
const notOpenYet = []

const HOURS_HTML = '<div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody></tbody></table></div>'


//flag,unique_id,id,site_name,state,county,
// address,city,zip_code,phone_number,testing_status,appointment_required,
// physician_order_required,screening_required,restrictions_apply,restriction_details,
// type_of_center,rapid_testing,non_rapid_testing,guidelines,provider_url,antibody_testing,
// monday,tuesday,wednesday,thursday,friday,saturday,sunday,latitude,longitude,cost_of_test,open_date,
// close_date,minimum_age


const decorations = {
  extendFeature() {
    const start = this.get('open_date')
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
  getCity() {
    return this.get('city')
  },
  getState() {
    return this.get('state')
  },
  getZip() {
    return this.get('zip_code')
  },
  getFullAddress() {
    return `${this.getAddress1()}, ${this.getCityStateZip()}`
  },
  getName() {
    return this.get('site_name')
  },
  getAddress1() {
    return this.get('address')
  },
  getCityStateZip() {
    return `${this.getCity()}, ${this.getState()} ${this.getZip()}`
  },
  getPhone() {
    return this.get('phone_number')
  },
  getTip() {
    return this.get('search_label')
  },
  getWebsite() {
    return this.get('provider_url')
  },
  hours(day) {
    return this.get(day) || 'Closed'
  },
  hoursHtml() {
    const opHours = $(HOURS_HTML)
    opHours.find('tbody')
      .append(`<tr><td class="day">Monday</td><td class="hrs notranslate">${this.hours('monday')}`)
      .append(`<tr><td class="day">Tuesday</td><td class="hrs notranslate">${this.hours('tuesday')}`)
      .append(`<tr><td class="day">Wednesday</td><td class="hrs notranslate">${this.hours('wednesday')}`)
      .append(`<tr><td class="day">Thursday</td><td class="hrs notranslate">${this.hours('thursday')}`)
      .append(`<tr><td class="day">Friday</td><td class="hrs notranslate">${this.hours('friday')}`)
      .append(`<tr><td class="day">Saturday</td><td class="hrs notranslate">${this.hours('saturday')}`)
      .append(`<tr><td class="day">Sunday</td><td class="hrs notranslate">${this.hours('sunday')}`)
    return opHours
  },
  detailsHtml() {
    const apptOnly = this.get('appointment_required') === 'Y' ? 'Yes' : 'No'
    const referralReq = this.get('physician_order_required') === 'Y' ? 'Yes' : 'No'
    const minimumAge = this.get('minimum_age')
    const hours = this.hoursHtml()

    const details = $('<div class="detail"></div>')
      .append(`<div><strong>Appointment Required: </strong>${apptOnly}</div>`)
      .append(`<div><strong>Physician order required: </strong>${referralReq}</div>`)
    details.append(hours)
    if (minimumAge && !isNaN(minimumAge))
      details.append(`<i>Tests can be used on people ${minimumAge} years and older.</i>`)

    return details
  }
}

export default {notOpenYet, decorations}
