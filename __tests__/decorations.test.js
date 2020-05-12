import $ from 'jquery'
import decorations from '../src/js/decorations'
import Feature from 'ol/Feature'

let feature

beforeEach(() => {
  feature = new Feature({
    NAME: 'fullSiteName',
    ADDRESS: 'Address',
    BOROUGH: 'Borough',
    FACILITY_TYPE: 'Type',
    TESTING_TYPE: 'Testing Type',
    NYCHA_PRIORITY: 'Y',
    WALK_IN: 'Y',
    PRIORITIZATION_CRITERIA: 'Criteria',
    LOCATION_INFO: 'Location info',
    APPOINTMENT_INFO: 'Location info',
    DAYS_OF_OPERATION: 'this - that',
    HOURS_OF_OPERATION: 'now - later'
  })
  decorations[0].cssClass = jest.fn()
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
  feature.extendFeature()
  expect(feature.get('search_label')).toBe(
    '<b><span class="srch-lbl-lg">' + feature.getName() + 
    '</span></b><br><span class="srch-lbl-sm">' + feature.getFullAddress() + '</span>'
  )
})

test('getFullAddress', () => {
  expect.assertions(1)

  expect(feature.getFullAddress()).toBe('Address, Borough, NY')
})

test('getName', () => {
  expect.assertions(1)

  expect(feature.getName()).toBe('fullSiteName')
})

test('getAddress1', () => {
  expect.assertions(1)

  expect(feature.getAddress1()).toBe('Address')
})

test('getCityStateZip', () => {
  expect.assertions(1)

  expect(feature.getCityStateZip()).toBe('Borough, NY')
})

test('getTip', () => {
  expect.assertions(1)

  expect(feature.getTip()).toBe(feature.get('search_label'))
})

test('details', () => {
  expect.assertions(2)

  const div = $('<div></div>') 

  div.html(feature.detailsHtml())
  expect(div.html()).toBe('<div class="detail"><div><strong>Open: </strong> this - that, now - later</div><div><strong>Walk in facility: </strong> Yes</div><div><strong>NYCHA priority site: </strong> Yes</div><div><strong>Testing type: </strong> Testing Type</div><div><strong>Location information: </strong> Location info</div><div><strong>Appointment information:<br></strong> Location info</div><div><strong>Prioritization criteria:<br></strong> Criteria</div></div>')

  feature.set('LOCATION_INFO', '')
  feature.set('APPOINTMENT_INFO', '')
  feature.set('PRIORITIZATION_CRITERIA', '')
  feature.set('WALK_IN', 'N')
  feature.set('NYCHA_PRIORITY', 'N')
  div.html(feature.detailsHtml())
  expect(div.html()).toBe('<div class="detail"><div><strong>Open: </strong> this - that, now - later</div><div><strong>Walk in facility: </strong> No</div><div><strong>NYCHA priority site: </strong> No</div><div><strong>Testing type: </strong> Testing Type</div></div>')
})
