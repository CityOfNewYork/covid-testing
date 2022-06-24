import nyc from 'nyc-lib/nyc'

const cacheBust = nyc.cacheBust(5)

export default {
  FACILITY_URL: `https://services6.arcgis.com/yG5s3afENB5iO9fj/arcgis/rest/services/COVIDTestingSites_PROD_VIEW/FeatureServer/0/query?f=geojson&cacheHint=true&outFields=*&outSR=3857&spatialRel=esriSpatialRelIntersects&where=1%3D1&${cacheBust}`,
  GEOCLIENT_URL: 'https://maps.nyc.gov/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example',
  DIRECTIONS_URL: 'https://maps.googleapis.com/maps/api/js?&sensor=false&libraries=visualization'
}
