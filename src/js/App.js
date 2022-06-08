import urls from './urls'
import style from './style'
import decorations from './decorations'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import Point from 'ol/geom/Point'
import {extend, getWidth} from 'ol/extent'

const screenReaderNote = `<h1 style="color:red">Important</h1>
<p style="color:red">
  The following instructions are meant for people with disabilities who use assistive technology.<br>
</p>
<p style="text-align:center">
  <a class="btn rad-all btn-ok" href="javascript:$('.screen-reader-info .btn.rad-all.btn-ok').click()" style="display: inline-block;">
    Return to the map
  </a>
</p>`

FinderApp.SCREEN_READER_INFO = screenReaderNote + FinderApp.SCREEN_READER_INFO

const filters = [
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
]

class App extends FinderApp {
  constructor() {
    super({
      title: 'COVID-19 Diagnostic Testing Sites',
      facilityTabTitle: 'Testing Sites',
      splashOptions: App.getSplashOptions(document.location.search),
      geoclientUrl: urls.GEOCLIENT_URL,
      facilityUrl: urls.FACILITY_CSV_URL,
      facilityStyle: style,
      facilitySearch: { displayField: 'search_label', nameField: 'search_name', placeholder: 'Search for a location near you...' },
      facilityFormat: new CsvPoint({
        x: 'longitude',
        y: 'latitude',
        dataProjection: 'EPSG:4326'
      }),
      filterChoiceOptions: filters,
      decorations: [decorations.decorations],
      directionsUrl: urls.DIRECTIONS_URL
    })
  }
  located (location) {
    super.located(location)
    this.zoomToExtent(this.location.coordinate)
  }
  zoomToExtent(coord) {
    let extent = new Point(coord).getExtent()
    const features = this.source.nearest(coord, 1)
    extent = extend(extent, features[0].getGeometry().getExtent())
    extent = [extent[0] - 100, extent[1] - 100, extent[2] + 100, extent[3] + 100]
    if (getWidth(extent) === 200) {
      this.view.animate({center: coord, zoom: 17})
    } else {
      this.view.fit(extent, {size: this.map.getSize(), duration: 500})
    }
  }
  ready(features) {
    decorations.notOpenYet.forEach(feature => {
      this.source.removeFeature(feature)
    })
    super.ready(this.source.getFeatures())
  }
}


const message = `<h1>COVID-19 Diagnostic Testing</h1>
  <p>
  New COVID testing sites are open in New York City.  Safe, simple, and easy.  Get tested at any of our convenient locations today.
  </p>`

App.getSplashOptions = search => {
  if (search.indexOf('splash=false') === -1) {
    return {message}
  }
}

export default App
