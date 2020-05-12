import $ from 'jquery'
import App from '../src/js/App'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import CsvAddr from 'nyc-lib/nyc/ol/format/CsvAddr'
import Geoclient from 'nyc-lib/nyc/Geoclient'
import urls from '../src/js/urls'
import style from '../src/js/style'
import decorations from '../src/js/decorations'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'

jest.mock('nyc-lib/nyc/ol/FinderApp')

const optionsWsplash = {
  title: 'COVID Testing Facilities',
  facilityTabTitle: 'Testing Facilities',
  splashOptions: {message: 'COVID Testing Facilities - Find the closest location.'},
  geoclientUrl: urls.GEOCLIENT_URL,
  facilityUrl: urls.FACILITY_CSV_URL,
  facilityStyle: style,
  facilitySearch: { displayField: 'search_label', nameField: 'Full site name' },
  facilityFormat: new CsvAddr({
    geocoder: new Geoclient({url: urls.GEOCLIENT_URL}),
    locationTemplate: '${ADDRESS}, ${BOROUGH}'
  }),
  filterChoiceOptions: [{
    title: 'Location type',
    choices: [
      {name: 'FACILITY_TYPE', values: ['H+H community clinic'], label: 'H+H community clinic', checked: true},
      {name: 'FACILITY_TYPE', values: ['H+H Hospital'], label: 'H+H Hospital', checked: true},
      {name: 'FACILITY_TYPE', values: ['One Medical'], label: 'One Medical', checked: true},
      {name: 'FACILITY_TYPE', values: ['Antibody survey'], label: 'Antibody survey', checked: true}
    ]
  }, {
    title: 'Walk in',
    choices: [
      {name: 'WALK_IN', values: ['Y'], label: 'Yes', checked: true},
      {name: 'WALK_IN', values: ['', 'N'], label: 'No', checked: true}
    ]
  }, {
    title: 'Testing type',
    choices: [
      {name: 'TESTING_TYPE', values: ['Diagnostic'], label: 'Diagnostic', checked: true},
      {name: 'TESTING_TYPE', values: ['Antibody'], label: 'Antibody', checked: true}
    ]
  }, {
    title: 'NYCHA priority site',
    choices: [
      {name: 'NYCHA_PRIORITY', values: ['Y'], label: 'Yes', checked: true},
      {name: 'NYCHA_PRIORITY', values: ['', 'N'], label: 'No', checked: true}
    ]
  }],
  decorations,
  directionsUrl: urls.DIRECTIONS_URL
}

const optionsWOsplash = {
  title: 'COVID Testing Facilities',
  facilityTabTitle: 'Testing Facilities',
  geoclientUrl: urls.GEOCLIENT_URL,
  facilityUrl: urls.FACILITY_CSV_URL,
  facilityStyle: style,
  facilitySearch: { displayField: 'search_label', nameField: 'Full site name' },
  facilityFormat: new CsvAddr({
    geocoder: new Geoclient({url: urls.GEOCLIENT_URL}),
    locationTemplate: '${ADDRESS}, ${BOROUGH}'
  }),
  filterChoiceOptions: [{
    title: 'Location type',
    choices: [
      {name: 'FACILITY_TYPE', values: ['H+H community clinic'], label: 'H+H community clinic', checked: true},
      {name: 'FACILITY_TYPE', values: ['H+H Hospital'], label: 'H+H Hospital', checked: true},
      {name: 'FACILITY_TYPE', values: ['One Medical'], label: 'One Medical', checked: true},
      {name: 'FACILITY_TYPE', values: ['Antibody survey'], label: 'Antibody survey', checked: true}
    ]
  }, {
    title: 'Walk in',
    choices: [
      {name: 'WALK_IN', values: ['Y'], label: 'Yes', checked: true},
      {name: 'WALK_IN', values: ['', 'N'], label: 'No', checked: true}
    ]
  }, {
    title: 'Testing type',
    choices: [
      {name: 'TESTING_TYPE', values: ['Diagnostic'], label: 'Diagnostic', checked: true},
      {name: 'TESTING_TYPE', values: ['Antibody'], label: 'Antibody', checked: true}
    ]
  }, {
    title: 'NYCHA priority site',
    choices: [
      {name: 'NYCHA_PRIORITY', values: ['Y'], label: 'Yes', checked: true},
      {name: 'NYCHA_PRIORITY', values: ['', 'N'], label: 'No', checked: true}
    ]
  }],
  decorations,
  directionsUrl: urls.DIRECTIONS_URL
}

beforeEach(() => {
  FinderApp.mockClear()
})

describe('constructor', () => {
  const getSplashOptions = App.getSplashOptions
  afterEach(() => {
    App.getSplashOptions = getSplashOptions
  })

  test('constructor w splash', () => {
    expect.assertions(2)
  
    const app = new App()
  
    expect(FinderApp).toHaveBeenCalledTimes(1)
    expect(JSON.stringify(FinderApp.mock.calls[0][0])).toBe(JSON.stringify(optionsWsplash))
  })
  
  test('constructor w/o splash', () => {
    expect.assertions(2)

    App.getSplashOptions = () => {}

    const app = new App()
  
    expect(FinderApp).toHaveBeenCalledTimes(1)
    expect(JSON.stringify(FinderApp.mock.calls[0][0])).toBe(JSON.stringify(optionsWOsplash))
  })
})

test('getSplashOptions', () => {
  expect.assertions(2)

  expect(App.getSplashOptions('')).toEqual({message: 'COVID Testing Facilities - Find the closest location.'})
  expect(App.getSplashOptions('?splash=false')).toBeUndefined()
})

test('located', () => {
  expect.assertions(4)

  const mockLocation = {coordinate: 'mock-coord'}

  const app = new App()
  app.zoomToExtent = jest.fn()
  app.location = mockLocation

  app.located(mockLocation)

  expect(FinderApp.prototype.located).toHaveBeenCalledTimes(1)
  expect(FinderApp.prototype.located.mock.calls[0][0]).toBe(mockLocation)

  expect(app.zoomToExtent).toHaveBeenCalledTimes(1)
  expect(app.zoomToExtent.mock.calls[0][0]).toBe('mock-coord')
})

test('zoomToExtent', () => {
  expect.assertions(6)

  const feature = new Feature({
    geometry: new Point([1, 2])
  })

  const app = new App()
  app.view = {fit: jest.fn()}
  app.map = {
    getSize: jest.fn().mockImplementation(() => {
      return 'mock-size'
    })
  }
  app.source = {
    nearest: jest.fn().mockImplementation(() => {
      return [feature]
    })
  }

  app.zoomToExtent([10, 20])

  expect(app.source.nearest).toHaveBeenCalledTimes(1)
  expect(app.source.nearest.mock.calls[0][0]).toEqual([10, 20])
  expect(app.source.nearest.mock.calls[0][1]).toBe(1)
  expect(app.view.fit).toHaveBeenCalledTimes(1)
  expect(app.view.fit.mock.calls[0][0]).toEqual([-99, -98, 110, 120])
  expect(app.view.fit.mock.calls[0][1]).toEqual({size: 'mock-size', duration: 500})
})
