import $ from 'jquery'
import decorations from '../src/js/decorations'
import Feature from 'ol/Feature'

let feature

beforeEach(() => {
  feature = new Feature({
    FacilityName: 'Name',
    Address: 'Address',
    Borough: 'Borough',
    Zipcode: '11111',
    FacilityType: 'Type',
    WalkInsWelcome: 'Y',
    ADACompliant: 'N',
    AppointmentsAvailable: 'Y',
    AdditionalInfo: '......',
    Phone: 'XXX-XXX-XXXX',
    Website: 'http://url',
    HoursMonday: 'now-later',
    HoursTuesday: 'now-later',
    HoursWednesday: 'now-later',
    HoursThursday: 'now-later',
    HoursFriday: 'now-later',
    HoursSaturday: 'now-later',
    HoursSunday: 'now-later',
    StartDate: new Date('2000-01-01').getTime(),
    EndDate: new Date('3000-01-01').getTime(),
    MinimumAge: 2
  })
  decorations[0].distanceHtml = jest.fn()
  decorations[0].nameHtml = jest.fn()
  decorations[0].addressHtml = jest.fn()
  decorations[0].mapButton = jest.fn()
  decorations[0].directionsButton = jest.fn()
  decorations[0].handleOver = jest.fn()
  decorations[0].handleOut = jest.fn()
  decorations[0].handleOver = jest.fn()
  Object.assign(feature, decorations[0])
})

test('extendFeature', () => {
  expect.assertions(2)

  feature.extendFeature()
  expect(feature.get('search_name')).toBe(feature.getName())
  expect(feature.get('search_label')).toBe(`<b><span class="srch-lbl-lg ">${feature.getName()}</span></b><br><span class="srch-lbl-sm">${feature.getFullAddress()}</span>`)
})

test('getFullAddress', () => {
  expect.assertions(1)

  expect( feature.getFullAddress()).toBe('Address, Borough, NY 11111')
})

test('getName', () => {
  expect.assertions(1)
  expect( feature.getName()).toBe('Name')
})

test('getAddress1', () => {
  expect.assertions(1)

  expect( feature.getAddress1()).toBe('Address')
})

test('getCityStateZip', () => {
  expect.assertions(1)

  expect( feature.getCityStateZip()).toBe('Borough, NY 11111')
})

test('getPhone', () => {
  expect.assertions(1)

  expect( feature.getPhone()).toBe( feature.get('Phone'))
})

test('getTip', () => {
  expect.assertions(1)

  expect( feature.getTip()).toBe( feature.get('search_label'))
})

test('getWebsite', () => {
  expect.assertions(1)

  expect( feature.getWebsite()).toBe( feature.get('Website'))
})

test('hours', () => {
  expect.assertions(2)

  feature.set('HoursMonday', '09:00am-05:00pm')

  expect(feature.hours('Monday')).toBe('09:00 AM - 05:00 PM')

  feature.set('HoursMonday', '')

  expect(feature.hours('Monday')).toBe('Closed')
})

test('hoursHtml', () => {
  expect.assertions(1)

  const div = $(`<div></div>`)
  div.html(feature.hoursHtml())

  expect(div.html()).toBe('<div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody><tr><td class="day">Monday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Tuesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Wednesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Thursday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Friday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Saturday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Sunday</td><td class="hrs notranslate">now - later</td></tr></tbody></table></div>')
})

test('hoursHtml - day w/o hours', () => {
  expect.assertions(1)

  feature.set('Wednesday', '')

  const div = $(`<div class="op-hours"></div>`)
  div.html(feature.hoursHtml())

  expect(div.html()).toBe('<div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody><tr><td class="day">Monday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Tuesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Wednesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Thursday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Friday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Saturday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Sunday</td><td class="hrs notranslate">now - later</td></tr></tbody></table></div>')
})


describe('details', () => {
  test('details WalkInsWelcome=Y ADACompliant=N AppointmentsAvailable=Y', () => {
    expect.assertions(1)
  
    const div = $('<div></div>') 
  
    div.html( feature.detailsHtml())
    expect(div.html()).toBe('<div class="detail"><div class="ada"><strong>ADA Compliant: </strong>No</div><div class="walk"><strong>Walk-ins Welcome: </strong>Yes</div><div class="apt"><strong>Appointment Available: </strong>Yes</div><div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody><tr><td class="day">Monday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Tuesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Wednesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Thursday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Friday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Saturday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Sunday</td><td class="hrs notranslate">now - later</td></tr></tbody></table></div><ul><li><strong>NO COST, regardless of insurance or immigration status<strong></strong></strong></li><li><em>Tests can be used on people 2 years and older.</em></li><li>......</li></ul></div>')
  })

  test('details WalkInsWelcome=N ADACompliant=Y AppointmentsAvailable=N', () => {
    expect.assertions(1)
  
    feature.set('WalkInsWelcome', 'N')
    feature.set('ADACompliant', 'Y')
    feature.set('AppointmentsAvailable', 'N')

    const div = $('<div></div>') 
  
    div.html(feature.detailsHtml())
    expect(div.html()).toBe('<div class="detail"><div class="ada"><strong>ADA Compliant: </strong>Yes</div><div class="walk"><strong>Walk-ins Welcome: </strong>No</div><div class="apt"><strong>Appointment Available: </strong>No</div><div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody><tr><td class="day">Monday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Tuesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Wednesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Thursday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Friday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Saturday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Sunday</td><td class="hrs notranslate">now - later</td></tr></tbody></table></div><ul><li><strong>NO COST, regardless of insurance or immigration status<strong></strong></strong></li><li><em>Tests can be used on people 2 years and older.</em></li><li>......</li></ul></div>')
  })

  test('details WalkInsWelcome=N ADACompliant=Y AppointmentsAvailable=N MinimumAge=0 no AdditionalInfo', () => {
    expect.assertions(1)
  
    feature.set('AdditionalInfo', '')
    feature.set('MinimumAge', '0')

    const div = $('<div></div>') 
  
    div.html(feature.detailsHtml())
    expect(div.html()).toBe('<div class="detail"><div class="ada"><strong>ADA Compliant: </strong>No</div><div class="walk"><strong>Walk-ins Welcome: </strong>Yes</div><div class="apt"><strong>Appointment Available: </strong>Yes</div><div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody><tr><td class="day">Monday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Tuesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Wednesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Thursday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Friday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Saturday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Sunday</td><td class="hrs notranslate">now - later</td></tr></tbody></table></div><ul><li><strong>NO COST, regardless of insurance or immigration status<strong></strong></strong></li><li><em>Tests can be used on people of any age.</em></li></ul></div>')
  })
})

test('ADACompliant css', () => {
  expect.assertions(2)

  expect(feature.cssClass()).toBe('')
  
  feature.set('ADACompliant', 'Y')
  expect(feature.cssClass()).toBe('acc')
})
