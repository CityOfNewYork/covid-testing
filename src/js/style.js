import Style from 'ol/style/Style'
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Icon from 'ol/style/Icon'
import nycol from 'nyc-lib/nyc/ol'

export default (feature, resolution) => {
  const z = nycol.TILE_GRID.getZForResolution(resolution)
  const acc = feature.get('ADACompliant') === 'Y'
  const fill = acc ? 'rgb(35,65,138)' : 'rgba(246,140,30,.6)';
  const style =  [new Style({
    image: new Circle({
      radius: z < 13 ? 7 : 10,
      fill: new Fill({color: fill}),
      stroke: new Stroke({width: 2, color: 'rgb(35,65,138)'})
    })
  })]
  if (acc) {
    style.push(
      new Style({
        image: new Icon({
          src: 'img/acc.png',
          scale: z < 13 ? 11/30 : 16/30
        })
      })
    )
  }
  return style
}