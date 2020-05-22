import Style from 'ol/style/Style'
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'

export default () => {
  return new Style({
    image: new Circle({
      radius: 7,
      fill: new Fill({color: 'rgba(246,140,30,.6)'}),
      stroke: new Stroke({width: 2, color: 'rgb(35,65,138)'})
    })
  })
}