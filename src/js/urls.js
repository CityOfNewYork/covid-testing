import nyc from 'nyc-lib/nyc'

const cacheBust = nyc.cacheBust(15)
const now = new Date()
const today_yyyy = now.getFullYear().toString()
const today_mm = (now.getMonth() + 1).toString().padStart(2, '0')
const today_dd = now.getDate().toString().padStart(2, '0')
const today = `${today_yyyy}-${today_mm}-${today_dd}`

export default {
  FACILITY_URL: `https://services6.arcgis.com/yG5s3afENB5iO9fj/arcgis/rest/services/COVIDTestingSites_TEST_VIEW/FeatureServer/0/query?f=geojson&cacheHint=true&outSR=3857&outFields=FacilityName,FacilityType,ADACompliant,Address,Borough,ZipCode,Phone,Website,WalkInsWelcome,MinimumAge,AppointmentsAvailable,AdditionalInfo&where=StartDate%20%3C=%20%27${today}%27%20AND%20EndDate%20%3E=%20%27${today}%27&${cacheBust}`,
  GEOCLIENT_URL: 'https://maps.nyc.gov/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example'
}
