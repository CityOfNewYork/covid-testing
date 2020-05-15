import urls from './urls'
import style from './style'
import decorations from './decorations'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import Point from 'ol/geom/Point'
import {extend, getWidth} from 'ol/extent'

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
      facilitySearch: { displayField: 'search_label', nameField: 'search_name' },
      facilityFormat: new CsvPoint({
        x: 'X',
        y: 'Y',
        dataProjection: 'EPSG:2263'
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

App.getSplashOptions = search => {
  if (search.indexOf('splash=false') === -1) {
    return {message}
  }
}

export default App
