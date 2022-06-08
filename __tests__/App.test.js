import $ from 'jquery'
import App from '../src/js/App'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import urls from '../src/js/urls'
import style from '../src/js/style'
import decorations from '../src/js/decorations'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'

jest.mock('nyc-lib/nyc/ol/FinderApp')

const message = `<h1>COVID-19 Diagnostic Testing</h1>
  <p>
  New COVID testing sites are open in New York City.  Safe, simple, and easy.  Get tested at any of our convenient locations today.
  </p>`

const optionsWsplash = {
  title: 'COVID-19 Diagnostic Testing Sites',
  facilityTabTitle: 'Testing Sites',
  splashOptions: {message},
  geoclientUrl: urls.GEOCLIENT_URL,
  facilityUrl: urls.FACILITY_CSV_URL,
  facilityStyle: style,
  facilitySearch: { displayField: 'search_label', nameField: 'search_name', placeholder: 'Search for a location near you...' },
  facilityFormat: new CsvPoint({
    x: 'longitude',
    y: 'latitude',
    dataProjection: 'EPSG:4326'
  }),
  filterChoiceOptions: [
    {
      title: 'Location type',
      choices: [
        {name: 'type_of_center', values: ['Walk up only'], label: 'Walk up only', checked: true},
        {name: 'type_of_center', values: ['Urgent Care Clinic'], label: 'Urgent Care Clinic', checked: true},
        {name: 'type_of_center', values: ['Pharmacy Clinic'], label: 'Pharmacy Clinic', checked: true},
        {name: 'type_of_center', values: ['Hospital'], label: 'Hospital', checked: true},
        {name: 'type_of_center', values: [''], label: 'Other', checked: true}
      ]
    },
    {
      title: 'Appointment Required',
      choices: [
        {name: 'appointment_required', values: ['Y'], label: 'Yes', checked: true},
        {name: 'appointment_required', values: ['', 'N'], label: 'No', checked: true}
      ]
    }
  ],
  decorations: [decorations.decorations],
  directionsUrl: urls.DIRECTIONS_URL
}

const optionsWOsplash = {
  title: 'COVID-19 Diagnostic Testing Sites',
  facilityTabTitle: 'Testing Sites',
  geoclientUrl: urls.GEOCLIENT_URL,
  facilityUrl: urls.FACILITY_CSV_URL,
  facilityStyle: style,
  facilitySearch: { displayField: 'search_label', nameField: 'search_name', placeholder: 'Search for a location near you...' },
  facilityFormat: new CsvPoint({
    x: 'longitude',
    y: 'latitude',
    dataProjection: 'EPSG:4326'
  }),
  filterChoiceOptions: [
    {
      title: 'Location type',
      choices: [
        {name: 'type_of_center', values: ['Walk up only'], label: 'Walk up only', checked: true},
        {name: 'type_of_center', values: ['Urgent Care Clinic'], label: 'Urgent Care Clinic', checked: true},
        {name: 'type_of_center', values: ['Pharmacy Clinic'], label: 'Pharmacy Clinic', checked: true},
        {name: 'type_of_center', values: ['Hospital'], label: 'Hospital', checked: true},
        {name: 'type_of_center', values: [''], label: 'Other', checked: true}
      ]
    },
    {
      title: 'Appointment Required',
      choices: [
        {name: 'appointment_required', values: ['Y'], label: 'Yes', checked: true},
        {name: 'appointment_required', values: ['', 'N'], label: 'No', checked: true}
      ]
    }
  ],
  decorations: [decorations.decorations],
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

  expect(App.getSplashOptions('')).toEqual({message})
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

describe('zoomToExtent', () => {
  test('zoomToExtent with nearest facility', () => {
    expect.assertions(8)
  
    const feature = new Feature({
      geometry: new Point([1, 2])
    })
  
    const app = new App()
    app.view = {
      fit: jest.fn(),
      animate: jest.fn()
    }
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
    expect(app.view.animate).toHaveBeenCalledTimes(0)
    expect(app.map.getSize).toHaveBeenCalledTimes(1)
    expect(app.view.fit).toHaveBeenCalledTimes(1)
    expect(app.view.fit.mock.calls[0][0]).toEqual([-99, -98, 110, 120])
    expect(app.view.fit.mock.calls[0][1]).toEqual({size: 'mock-size', duration: 500})
  })

  test('zoomToExtent at facility', () => {
    expect.assertions(8)
  
    const feature = new Feature({
      geometry: new Point([1, 2])
    })
  
    const app = new App()
    app.view = {
      fit: jest.fn(),
      animate: jest.fn()
    }
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
  
    app.zoomToExtent([1, 2])
  
    expect(app.source.nearest).toHaveBeenCalledTimes(1)
    expect(app.source.nearest.mock.calls[0][0]).toEqual([1, 2])
    expect(app.source.nearest.mock.calls[0][1]).toBe(1)
    expect(app.view.animate).toHaveBeenCalledTimes(1)
    expect(app.map.getSize).toHaveBeenCalledTimes(0)
    expect(app.view.fit).toHaveBeenCalledTimes(0)
    expect(app.view.animate.mock.calls[0][0].center).toEqual([1, 2])
    expect(app.view.animate.mock.calls[0][0].zoom).toBe(17)
  })
})

describe('ready', () => {
  beforeEach(() => {
    decorations.notOpenYet.push('mock-feature')
  })
  afterEach(() => {
    decorations.notOpenYet.length = 0
  })

  test('ready', () => {
    expect.assertions(5)

    const app = new App()
    app.source = {
      removeFeature: jest.fn(),
      getFeatures: jest.fn().mockImplementation(() => {
        return 'mock-features'
      })
    }

    app.ready()

    expect(app.source.removeFeature).toHaveBeenCalledTimes(1)
    expect(app.source.removeFeature.mock.calls[0][0]).toBe('mock-feature')
    expect(app.source.getFeatures).toHaveBeenCalledTimes(1)
    expect(FinderApp.prototype.ready).toHaveBeenCalledTimes(1)
    expect(FinderApp.prototype.ready.mock.calls[0][0]).toBe('mock-features')

  })
})
