import $ from 'jquery'
import decorations from '../src/js/decorations'
import Feature from 'ol/Feature'

let feature

beforeEach(() => {
  feature = new Feature({
    site_name: 'Name',
    address: 'Address',
    city: 'bedrock',
    state: 'anxiety',
    zip_code: '11111',
    type_of_center: 'Type',
    appointment_required: 'N',
    phone_number: 'XXX-XXX-XXXX',
    provider_url: 'http://url',
    monday: 'now - later',
    tuesday: 'now - later',
    wednesday: 'now - later',
    thursday: 'now - later',
    friday: 'now - later',
    saturday: 'now - later',
    sunday: 'now - later',
    open_date: 'start date',
    minimum_age: 2
  })
  decorations.notOpen.length = 0
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

    feature.set('open_date', '2020-05-01')
    feature.extendFeature()
    expect(decorations.notOpen.length).toBe(0)
    expect(feature.get('search_name')).toBe(feature.getName())
    expect(feature.get('search_label')).toBe(
      '<b><span class="srch-lbl-lg">' +  feature.getName() + 
      '</span></b><br><span class="srch-lbl-sm">' +  feature.getFullAddress() + '</span>'
    )
  })
  test('extendFeature not open yet', () => {
    expect.assertions(3)

    feature.set('open_date', '5000-01-01')
    feature.extendFeature()
    expect(decorations.notOpen.length).toBe(1)
    expect(decorations.notOpen[0]).toBe(feature)
    expect(feature.get('search_label')).toBeUndefined()
  })
})

test('getFullAddress', () => {
  expect.assertions(1)

  expect( feature.getFullAddress()).toBe('Address, bedrock, anxiety 11111')
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

  expect( feature.getCityStateZip()).toBe('bedrock, anxiety 11111')
})

test('getPhone', () => {
  expect.assertions(1)

  expect( feature.getPhone()).toBe( feature.get('phone_number'))
})

test('getTip', () => {
  expect.assertions(1)

  expect( feature.getTip()).toBe( feature.get('search_label'))
})

test('getWebsite', () => {
  expect.assertions(1)

  expect( feature.getWebsite()).toBe( feature.get('provider_url'))
})

test('hoursHtml', () => {
  expect.assertions(1)

  const div = $(`<div></div>`)
  div.html(feature.hoursHtml())

  expect(div.html()).toBe('<div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody><tr><td class="day">Monday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Tuesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Wednesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Thursday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Friday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Saturday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Sunday</td><td class="hrs notranslate">now - later</td></tr></tbody></table></div>')
})

test('hoursHtml - day w/o hours', () => {
  expect.assertions(1)

  feature.set('OPERATIONS_WED', '')

  const div = $(`<div class="op-hours"></div>`)
  div.html(feature.hoursHtml())

  expect(div.html()).toBe('<div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody><tr><td class="day">Monday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Tuesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Wednesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Thursday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Friday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Saturday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Sunday</td><td class="hrs notranslate">now - later</td></tr></tbody></table></div>')
})

test('details', () => {
  expect.assertions(2)

  const div = $('<div></div>') 

  div.html(feature.detailsHtml())
  expect(div.html()).toBe('<div class="detail"><div><strong>Appointment Required: </strong>No</div><div><strong>Physician order required: </strong>No</div><div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody><tr><td class="day">Monday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Tuesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Wednesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Thursday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Friday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Saturday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Sunday</td><td class="hrs notranslate">now - later</td></tr></tbody></table></div><i>Tests can be used on people 2 years and older.</i></div>')

  feature.set('appointment_required', 'Y')
  feature.set('minimum_age', null)


  div.html( feature.detailsHtml())
  expect(div.html()).toBe('<div class="detail"><div><strong>Appointment Required: </strong>Yes</div><div><strong>Physician order required: </strong>No</div><div class="op-hours"><table><thead><tr><th>Day</th><th>Hours of Operation</th></tr></thead><tbody><tr><td class="day">Monday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Tuesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Wednesday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Thursday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Friday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Saturday</td><td class="hrs notranslate">now - later</td></tr><tr><td class="day">Sunday</td><td class="hrs notranslate">now - later</td></tr></tbody></table></div></div>')
})
