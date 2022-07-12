import $ from 'jquery'
import App from '../src/js/App'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import GeoJSON from 'ol/format/GeoJSON'
import urls from '../src/js/urls'
import style from '../src/js/style'
import decorations from '../src/js/decorations'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'

jest.mock('nyc-lib/nyc/ol/FinderApp')

const message = `<h1>COVID-19 Test Site Finder</h1>
  <p>
  New COVID testing sites are open in New York City.  Safe, simple, and easy.  Get tested at any of our convenient locations today.
  <a href="https://www.nychealthandhospitals.org/covid-19-testing-sites/" noopener target="info">More information...</a>
  <div class="ew">
  <a class="btn rad-all" role="button" href="#">
  Eeeewwwww! This Looks Legacy &#9785;
  </a>
  </div>  
  </p>`

const optionsWsplash = {
  title: 'COVID-19 Test Site Finder',
  facilityTabTitle: 'Testing Sites',
  splashOptions: {message},
  geoclientUrl: urls.GEOCLIENT_URL,
  facilityUrl: urls.FACILITY_URL,
  facilityStyle: style,
  facilitySearch: { displayField: 'search_label', nameField: 'search_name', placeholder: 'Search for a location near you...' },
  facilityFormat: new GeoJSON(),
  filterChoiceOptions: [
    {
      title: 'ADA Compliant',
      choices: [
        {name: 'ADACompliant', values: ['Y'], label: 'Yes', checked: true},
        {name: 'ADACompliant', values: ['', 'N'], label: 'No', checked: true}
      ]
    },
    {
      title: 'Location type',
      choices: [
        {name: 'FacilityType', values: ['Mobile Test Site'], label: 'Mobile Test Site', checked: true},
        {name: 'FacilityType', values: ['Clinic'], label: 'Clinic', checked: true},
        {name: 'FacilityType', values: ['Rapid Test Pickup Site'], label: 'Rapid Test Pickup Site', checked: true},
        {name: 'FacilityType', values: ['Hospital'], label: 'Hospital', checked: true},
        {name: 'FacilityType', values: ['Test-to-Treat'], label: 'Test-to-Treat', checked: true}
      ]
    },
    {
      title: 'Minimum Age',
      radio: true,
      choices: [
        {name: 'MinimumAge', values: ['0', '2', '4'], label: 'No minimum', checked: true},
        {name: 'MinimumAge', values: ['2', '4'], label: '2 years and older'},
        {name: 'MinimumAge', values: ['4'], label: '4 years and older'}
      ]
    }
  ],
  decorations
}

const optionsWOsplash = {
  title: 'COVID-19 Test Site Finder',
  facilityTabTitle: 'Testing Sites',
  geoclientUrl: urls.GEOCLIENT_URL,
  facilityUrl: urls.FACILITY_URL,
  facilityStyle: style,
  facilitySearch: { displayField: 'search_label', nameField: 'search_name', placeholder: 'Search for a location near you...' },
  facilityFormat: new GeoJSON(),
  filterChoiceOptions: [
    {
      title: 'ADA Compliant',
      choices: [
        {name: 'ADACompliant', values: ['Y'], label: 'Yes', checked: true},
        {name: 'ADACompliant', values: ['', 'N'], label: 'No', checked: true}
      ]
    },
    {
      title: 'Location type',
      choices: [
        {name: 'FacilityType', values: ['Mobile Test Site'], label: 'Mobile Test Site', checked: true},
        {name: 'FacilityType', values: ['Clinic'], label: 'Clinic', checked: true},
        {name: 'FacilityType', values: ['Rapid Test Pickup Site'], label: 'Rapid Test Pickup Site', checked: true},
        {name: 'FacilityType', values: ['Hospital'], label: 'Hospital', checked: true},
        {name: 'FacilityType', values: ['Test-to-Treat'], label: 'Test-to-Treat', checked: true}
      ]
    },
    {
      title: 'Minimum Age',
      radio: true,
      choices: [
        {name: 'MinimumAge', values: ['0', '2', '4'], label: 'No minimum', checked: true},
        {name: 'MinimumAge', values: ['2', '4'], label: '2 years and older'},
        {name: 'MinimumAge', values: ['4'], label: '4 years and older'}
      ]
    }
  ],
  decorations
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

