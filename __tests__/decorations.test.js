import $ from 'jquery'
import decorations from '../src/js/decorations'
import Feature from 'ol/Feature'

const feature = new Feature({
  "Full site name": 'fullSiteName',
  "Address": 'Address',
  "Borough": 'Borough',
  "Type": 'Type',
  "Testing type": 'Testing Type',
  "NYCHA priority site?": 'Y',
  "Walk-in?": 'Y',
  "Prioritization criteria": 'Criteria'
})

beforeEach(() => {
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

test('html', () => {
  expect.assertions(6)
  const html = feature.html()

  expect(html.data('feature')).toBe(feature)
  expect(decorations[0].handleOver).toHaveBeenCalledTimes(0)
  html.trigger('mouseover')
  expect(decorations[0].handleOver).toHaveBeenCalledTimes(1)

  expect(decorations[0].handleOut).toHaveBeenCalledTimes(0)
  html.trigger('mouseout')
  expect(decorations[0].handleOut).toHaveBeenCalledTimes(1)

  expect($('<div></div>').html(html).html()).toBe('<div class="facility"><div class="detail"><div><strong>Walk in facility: </strong> Yes</div><div><strong>NYCHA priority site: </strong> Yes</div><div><strong>Prioritization criteria:<br></strong> Criteria</div></div></div>')
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
describe('details', () => {
  afterEach(() => {
    feature.set('Walk-in?', 'Y')
    feature.set('NYCHA priority site?', 'Y')
    feature.set('Prioritization criteria', 'Criteria')
  })
  test('details : walk-in', () => {
    expect.assertions(2)

    const div = $('<div></div>')

    feature.set('Walk-in?', 'Y')
    div.html(feature.details())
    expect(div.html()).toBe('<div class="detail"><div><strong>Walk in facility: </strong> Yes</div><div><strong>NYCHA priority site: </strong> Yes</div><div><strong>Prioritization criteria:<br></strong> Criteria</div></div>')
 

    feature.set('Walk-in?', 'N')
    div.html(feature.details())
    expect(div.html()).toBe('<div class="detail"><div><strong>Walk in facility: </strong> No</div><div><strong>NYCHA priority site: </strong> Yes</div><div><strong>Prioritization criteria:<br></strong> Criteria</div></div>')
  })

  test('details : nycha', () => {
    expect.assertions(2)

    const div = $('<div></div>')

    feature.set('NYCHA priority site?', 'Y')
    div.html(feature.details())
    expect(div.html()).toBe('<div class="detail"><div><strong>Walk in facility: </strong> Yes</div><div><strong>NYCHA priority site: </strong> Yes</div><div><strong>Prioritization criteria:<br></strong> Criteria</div></div>')

    feature.set('NYCHA priority site?', 'N')
    div.html(feature.details())
    expect(div.html()).toBe('<div class="detail"><div><strong>Walk in facility: </strong> Yes</div><div><strong>NYCHA priority site: </strong> No</div><div><strong>Prioritization criteria:<br></strong> Criteria</div></div>')

  })
  test('details : criteria', () => {
    expect.assertions(2)

    const div = $('<div></div>')

    feature.set('Prioritization criteria', 'Criteria')
    div.html(feature.details())
    expect(div.html()).toBe('<div class="detail"><div><strong>Walk in facility: </strong> Yes</div><div><strong>NYCHA priority site: </strong> Yes</div><div><strong>Prioritization criteria:<br></strong> Criteria</div></div>')

    feature.set('Prioritization criteria', '')
    div.html(feature.details())
    expect(div.html()).toBe('<div class="detail"><div><strong>Walk in facility: </strong> Yes</div><div><strong>NYCHA priority site: </strong> Yes</div></div>')

  })
})

