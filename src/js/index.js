import App from './App'
import urls from './urls'
import olms from 'ol-mapbox-style'
import $ from 'jquery'

olms(
  $('<div class="tab tab-0 active" aria-labelledby="tab-btn-0" role="tabpanel" aria-hidden="false" tabindex="1000"></div>').get(0),
  urls.MVT_URL,
).then(map => {
  new App(map)
})
