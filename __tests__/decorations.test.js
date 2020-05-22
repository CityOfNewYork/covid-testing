import $ from 'jquery'
import decorations from '../src/js/decorations'
import Feature from 'ol/Feature'

let feature

beforeEach(() => {
  feature = new Feature({
    NAME: 'Name',
    ADDRESS: 'Address',
    BOROUGH: '1',
    FACILITY_TYPE: 'Type',
    LOCATION_INFO: 'Location info',
    APPOINTMENT_INFO: 'Appointment info',
    ADDITIONAL_INFO: 'Additional info',
    APPOINTMENT_ONLY: 'N',
    PHONE: 'XXX-XXX-XXXX',
    URL: 'http://url',
    OPERATIONS_MON: 'now - later',
    OPERATIONS_TUE: 'now - later',
    OPERATIONS_WED: 'now - later',
    OPERATIONS_THUR: 'now - later',
    OPERATIONS_FRI: 'now - later',
    OPERATIONS_SAT: 'now - later',
    OPERATIONS_SUN: 'now - later',
    START_DATE: 'start date'
  })
  decorations.notOpenYet.length = 0
  decorations.decorations.cssClass = jest.fn()
  decorations.decorations.distanceHtml = jest.fn()
  decorations.decorations.nameHtml = jest.fn()
  decorations.decorations.addressHtml = jest.fn()
  decorations.decorations.mapButton = jest.fn()
  decorations.decorations.directionsButton = jest.fn()
  decorations.decorations.handleOver = jest.fn()
  decorations.decorations.handleOut = jest.fn()
  decorations.decorations.handleOver = jest.fn()
  Object.assign(feature, decorations.decorations)
})

describe('extendFeature', () => {
  test('extendFeature open', () => {
    expect.assertions(3)

    feature.set('START_DATE', '2020-05-01')
    feature.extendFeature()
    expect(decorations.notOpenYet.length).toBe(0)
    expect(feature.get('search_name')).toBe(feature.get('NAME'))
    expect(feature.get('search_label')).toBe(
      '<b><span class="srch-lbl-lg">' +  feature.get('NAME') + 
      '</span></b><br><span class="srch-lbl-sm">' +  feature.getFullAddress() + '</span>'
    )
  })
  test('extendFeature not open yet', () => {
    expect.assertions(3)

    feature.set('START_DATE', '5000-01-01')
    feature.extendFeature()
    expect(decorations.notOpenYet.length).toBe(1)
    expect(decorations.notOpenYet[0]).toBe(feature)
    expect(feature.get('search_label')).toBeUndefined()
  })
})

test('getBorough', () => {
  expect.assertions(5)

  expect(Object.assign(new Feature({BOROUGH: '1'}), decorations.decorations).getBorough()).toBe('Manhattan')
  expect(Object.assign(new Feature({BOROUGH: '2'}), decorations.decorations).getBorough()).toBe('Bronx')
  expect(Object.assign(new Feature({BOROUGH: '3'}), decorations.decorations).getBorough()).toBe('Brooklyn')
  expect(Object.assign(new Feature({BOROUGH: '4'}), decorations.decorations).getBorough()).toBe('Queens')
  expect(Object.assign(new Feature({BOROUGH: '5'}), decorations.decorations).getBorough()).toBe('Staten Island')

})

test('getFullAddress', () => {
  expect.assertions(1)

  expect( feature.getFullAddress()).toBe('Address, Manhattan, NY')
})

test('getName', () => {
  expect.assertions(1)

  expect( feature.getName()).toBe('Name')
})

test('getAddress1', () => {
  expect.assertions(1)

  expect( feature.getAddress1()).toBe('Address')
})
test('getAddress2', () => {
  expect.assertions(1)

  expect( feature.getAddress2()).toBe('Location info')
})

test('getCityStateZip', () => {
  expect.assertions(1)

  expect( feature.getCityStateZip()).toBe('Manhattan, NY')
})

test('getPhone', () => {
  expect.assertions(1)

  expect( feature.getPhone()).toBe( feature.get('PHONE'))
})

test('getTip', () => {
  expect.assertions(1)

  expect( feature.getTip()).toBe( feature.get('search_label'))
})

test('getWebsite', () => {
  expect.assertions(1)

  expect( feature.getWebsite()).toBe( feature.get('URL'))
})

test('hoursHtml', () => {
  expect.assertions(1)

  const div = $(`<div></div>`)
  div.html(feature.hoursHtml())

  expect(div.html()).toBe('<div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody><tr><td class="day">Monday</td><td class="hrs">now - later</td></tr><tr><td class="day">Tuesday</td><td class="hrs">now - later</td></tr><tr><td class="day">Wednesday</td><td class="hrs">now - later</td></tr><tr><td class="day">Thursday</td><td class="hrs">now - later</td></tr><tr><td class="day">Friday</td><td class="hrs">now - later</td></tr><tr><td class="day">Saturday</td><td class="hrs">now - later</td></tr><tr><td class="day">Sunday</td><td class="hrs">now - later</td></tr></tbody></table></div>')
})

test('hoursHtml - day w/o hours', () => {
  expect.assertions(1)

  feature.set('OPERATIONS_WED', '')

  const div = $(`<div class="op-hours"></div>`)
  div.html(feature.hoursHtml())

  expect(div.html()).toBe('<div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody><tr><td class="day">Monday</td><td class="hrs">now - later</td></tr><tr><td class="day">Tuesday</td><td class="hrs">now - later</td></tr><tr><td class="day">Wednesday</td><td class="hrs">Closed</td></tr><tr><td class="day">Thursday</td><td class="hrs">now - later</td></tr><tr><td class="day">Friday</td><td class="hrs">now - later</td></tr><tr><td class="day">Saturday</td><td class="hrs">now - later</td></tr><tr><td class="day">Sunday</td><td class="hrs">now - later</td></tr></tbody></table></div>')
})

test('details', () => {
  expect.assertions(2)

  const div = $('<div></div>') 

  div.html( feature.detailsHtml())
  expect(div.html()).toBe('<div class="detail"><div><strong>Additional information:<br></strong> Additional info</div><div><strong>Appointment information:<br></strong> Appointment info</div><div><strong>Start Date: </strong> start date</div><div><strong>Appointment Only: </strong> No</div><div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody><tr><td class="day">Monday</td><td class="hrs">now - later</td></tr><tr><td class="day">Tuesday</td><td class="hrs">now - later</td></tr><tr><td class="day">Wednesday</td><td class="hrs">now - later</td></tr><tr><td class="day">Thursday</td><td class="hrs">now - later</td></tr><tr><td class="day">Friday</td><td class="hrs">now - later</td></tr><tr><td class="day">Saturday</td><td class="hrs">now - later</td></tr><tr><td class="day">Sunday</td><td class="hrs">now - later</td></tr></tbody></table></div></div>')

  feature.set('LOCATION_INFO', '')
  feature.set('APPOINTMENT_INFO', '')
  feature.set('ADDITIONAL_INFO', '')
  feature.set('APPOINTMENT_ONLY', 'Y')


  div.html( feature.detailsHtml())
  expect(div.html()).toBe('<div class="detail"><div><strong>Start Date: </strong> start date</div><div><strong>Appointment Only: </strong> Yes</div><div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody><tr><td class="day">Monday</td><td class="hrs">now - later</td></tr><tr><td class="day">Tuesday</td><td class="hrs">now - later</td></tr><tr><td class="day">Wednesday</td><td class="hrs">now - later</td></tr><tr><td class="day">Thursday</td><td class="hrs">now - later</td></tr><tr><td class="day">Friday</td><td class="hrs">now - later</td></tr><tr><td class="day">Saturday</td><td class="hrs">now - later</td></tr><tr><td class="day">Sunday</td><td class="hrs">now - later</td></tr></tbody></table></div></div>')
})
