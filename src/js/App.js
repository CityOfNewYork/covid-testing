import urls from './urls'
import style from './style'
import decorations from './decorations'
import Geoclient from 'nyc-lib/nyc/Geoclient'
import CsvAddr from 'nyc-lib/nyc/ol/format/CsvAddr'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import Point from 'ol/geom/Point'
import {extend} from 'ol/extent'

const screenReaderNote = `<h1 style="color:red">Important</h1>
<p style="color:red">
  The following instructions are meant for people with disabilities who use assistive technology.
  For all other inquiries please contact <a style="color:red" href="tel:311">311</a>.<br>
</p>
<p style="text-align:center">
  <a class="btn rad-all btn-ok" href="javascript:$('.screen-reader-info .btn.rad-all.btn-ok').click()" style="display: inline-block;">
    Return to the map
  </a>
</p>`

FinderApp.SCREEN_READER_INFO = screenReaderNote + FinderApp.SCREEN_READER_INFO

const filters = [{
  title: 'Location type',
  choices: [
    {name: 'FACILITY_TYPE', values: ['H+H community site'], label: 'H+H community site', checked: true},
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
}]

class App extends FinderApp {
  constructor() {
    super({
      title: 'COVID-19 Testing Sites',
      facilityTabTitle: 'Testing Sites',
      splashOptions: App.getSplashOptions(document.location.search),
      geoclientUrl: urls.GEOCLIENT_URL,
      facilityUrl: urls.FACILITY_CSV_URL,
      facilityStyle: style,
      facilitySearch: { displayField: 'search_label', nameField: 'Full site name' },
      facilityFormat: new CsvAddr({
        geocoder: new Geoclient({url: urls.GEOCLIENT_URL}),
        locationTemplate: '${ADDRESS}, ${BOROUGH}'
      }),
      filterChoiceOptions: filters,
      decorations,
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
    this.view.fit(extent, {size: this.map.getSize(), duration: 500})
  }
}

App.getSplashOptions = search => {
  if (search.indexOf('splash=false') === -1) {
    return {message: 'COVID Testing Facilities - Find the closest location.'}
  }
}

export default App
