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
    Diagnostic testing is only recommended for those who are symptomatic or have a history of symptoms of COVID-19
    (e.g. fever, cough, and/or trouble breathing), particularly if the individual is 65 years of age or older,
    the individual has a compromised immune system, or the individual has an underlying health condition. Diagnostic
    testing locations can be found on this locator map. To participate in the City of New York’s free antibody testing survey,
    please call
  </p>
  <p><a class="btn rad-all" href="tel:1-888-279-0967">(888) 279-0967</a></p>
  <p>or visit</p>
  <p><a class="btn rad-all" href="https://on.nyc.gov/antibody">on.nyc.gov/antibody<a></p>
  <p>for more information.</p>`

const optionsWsplash = {
  title: 'COVID-19 Testing Sites',
  facilityTabTitle: 'Testing Sites',
  splashOptions: {message},
  geoclientUrl: urls.GEOCLIENT_URL,
  facilityUrl: urls.FACILITY_CSV_URL,
  facilityStyle: style,
  facilitySearch: { displayField: 'search_label', nameField: 'Full site name' },
  facilityFormat: new CsvPoint({
    x: 'X',
    y: 'Y',
    dataProjection: 'EPSG:2263'
  }),
  filterChoiceOptions: [{
    title: 'Location type',
    choices: [
      {name: 'FACILITY_TYPE', values: ['H+H community site'], label: 'H+H community site', checked: true},
      {name: 'FACILITY_TYPE', values: ['H+H Hospital'], label: 'H+H Hospital', checked: true},
      {name: 'FACILITY_TYPE', values: ['One Medical'], label: 'One Medical', checked: true} //,
      // {name: 'FACILITY_TYPE', values: ['Antibody survey'], label: 'Antibody survey', checked: true}
    ]
  },
  {
    title: 'Walk up',
    choices: [
      {name: 'WALK_IN', values: ['Y'], label: 'Yes', checked: true},
      {name: 'WALK_IN', values: ['', 'N'], label: 'No', checked: true}
    ]
  },
  {
    title: 'Drive through',
    choices: [
      {name: 'DRIVE_THRU', values: ['Y'], label: 'Yes', checked: true},
      {name: 'DRIVE_THRU', values: ['', 'N'], label: 'No', checked: true}
    ]
  },
  /*
  {
    title: 'Testing type',
    choices: [
      {name: 'TESTING_TYPE', values: ['Diagnostic'], label: 'Diagnostic', checked: true},
      {name: 'TESTING_TYPE', values: ['Antibody'], label: 'Antibody', checked: true}
    ]
  },
  */
  {
    title: 'NYCHA priority site',
    choices: [
      {name: 'NYCHA_PRIORITY', values: ['Y'], label: 'Yes', checked: true},
      {name: 'NYCHA_PRIORITY', values: ['', 'N'], label: 'No', checked: true}
    ]
  }],
  decorations: [decorations.decorations],
  directionsUrl: urls.DIRECTIONS_URL
}

const optionsWOsplash = {
  title: 'COVID-19 Testing Sites',
  facilityTabTitle: 'Testing Sites',
  geoclientUrl: urls.GEOCLIENT_URL,
  facilityUrl: urls.FACILITY_CSV_URL,
  facilityStyle: style,
  facilitySearch: { displayField: 'search_label', nameField: 'Full site name' },
  facilityFormat: new CsvPoint({
    x: 'X',
    y: 'Y',
    dataProjection: 'EPSG:2263'
  }),
  filterChoiceOptions: [{
    title: 'Location type',
    choices: [
      {name: 'FACILITY_TYPE', values: ['H+H community site'], label: 'H+H community site', checked: true},
      {name: 'FACILITY_TYPE', values: ['H+H Hospital'], label: 'H+H Hospital', checked: true},
      {name: 'FACILITY_TYPE', values: ['One Medical'], label: 'One Medical', checked: true} //,
      // {name: 'FACILITY_TYPE', values: ['Antibody survey'], label: 'Antibody survey', checked: true}
    ]
  },
  {
    title: 'Walk up',
    choices: [
      {name: 'WALK_IN', values: ['Y'], label: 'Yes', checked: true},
      {name: 'WALK_IN', values: ['', 'N'], label: 'No', checked: true}
    ]
  },
  {
    title: 'Drive through',
    choices: [
      {name: 'DRIVE_THRU', values: ['Y'], label: 'Yes', checked: true},
      {name: 'DRIVE_THRU', values: ['', 'N'], label: 'No', checked: true}
    ]
  },
  /*
  {
    title: 'Testing type',
    choices: [
      {name: 'TESTING_TYPE', values: ['Diagnostic'], label: 'Diagnostic', checked: true},
      {name: 'TESTING_TYPE', values: ['Antibody'], label: 'Antibody', checked: true}
    ]
  },
  */
  {
    title: 'NYCHA priority site',
    choices: [
      {name: 'NYCHA_PRIORITY', values: ['Y'], label: 'Yes', checked: true},
      {name: 'NYCHA_PRIORITY', values: ['', 'N'], label: 'No', checked: true}
    ]
  }],
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