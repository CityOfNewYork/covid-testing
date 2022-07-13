import urls from './urls'
import style from './style'
import decorations from './decorations'
import GeoJSON from 'ol/format/GeoJSON'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import Point from 'ol/geom/Point'
import {extend, getWidth} from 'ol/extent'
import MapMgr from 'nyc-lib/nyc/ol/MapMgr'
import MultiFeaturePopup from 'nyc-lib/nyc/ol/MultiFeaturePopup'
import FeatureTip from 'nyc-lib/nyc/ol/FeatureTip'

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

FinderApp.prototype.directionsTo = MapMgr.prototype.directionsTo

const filters = [
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
]

class App extends FinderApp {
  constructor(mvt) {
    super({
      title: 'COVID-19 Test Site Finder',
      facilityTabTitle: 'Testing Sites',
      splashOptions: App.getSplashOptions(document.location.search),
      geoclientUrl: urls.GEOCLIENT_URL,
      facilityUrl: urls.FACILITY_URL,
      facilityStyle: style,
      facilitySearch: { displayField: 'search_label', nameField: 'search_name', placeholder: 'Search for a location near you...' },
      facilityFormat: new GeoJSON(),
      filterChoiceOptions: filters,
      decorations
    })
    this.mvt = mvt
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
  monorail() {
    $('#monorail').hide().addClass('monorail').fadeIn()
    $('.fnd .dia-container.splash').fadeOut()
    this.map.base.setVisible(false)
    this.map.labels.base.setVisible(false)
    this.mvt.getLayers().getArray().forEach(layer => this.map.addLayer(layer))
    this.layer.setZIndex(1000)
    this.highlightLayer.setZIndex(2000)
    this.translate.showButton('#map')
    $('body').addClass('monorail')
    setTimeout(() => $('#monorail').fadeOut(), 2500)
  }
  ready(features) {
    $('.ew .btn').trigger('focus')
    super.ready(features)
    $('.ew a').on('click', this.monorail.bind(this))
  }
}


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

App.getSplashOptions = search => {
  if (search.indexOf('splash=false') === -1) {
    return {message}
  }
}

export default App
