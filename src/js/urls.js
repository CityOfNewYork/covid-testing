import nyc from 'nyc-lib/nyc'

const cacheBust = nyc.cacheBust(15)

export default {
  FACILITY_URL: `https://services6.arcgis.com/yG5s3afENB5iO9fj/arcgis/rest/services/COVIDTestingSites_PROD_VIEW/FeatureServer/0/query?f=geojson&cacheHint=true&outSR=3857&outFields=FacilityName,FacilityType,ADACompliant,Address,Borough,ZipCode,Phone,Website,WalkInsWelcome,MinimumAge,AppointmentsAvailable,AdditionalInfo&where=1=1&${cacheBust}`,
  GEOCLIENT_URL: 'https://maps.nyc.gov/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example',
  MVT_URL: 'https://api.maptiler.com/maps/topo/style.json?key=MAPTILER_KEY'
}
