import styleFn from '../src/js/style'
import Feature from 'ol/Feature'
import nycol from 'nyc-lib/nyc/ol'

test('style not ADACompliant z < 13', () => {
  expect.assertions(5)

  const feature = new Feature({
    ADACompliant: 'N'
  })

  const style = styleFn(feature, nycol.TILE_GRID.getResolutions()[10])

  expect(style.length).toBe(1)

  expect(style[0].getImage().getRadius()).toBe(7)
  expect(style[0].getImage().getFill().getColor()).toBe('rgba(246,140,30,.6)')
  expect(style[0].getImage().getStroke().getColor()).toBe('rgb(35,65,138)')
  expect(style[0].getImage().getStroke().getWidth()).toBe(2)
})

test('style not ADACompliant z >= 13', () => {
  expect.assertions(5)

  const feature = new Feature({
    ADACompliant: 'N'
  })

  const style = styleFn(feature, nycol.TILE_GRID.getResolutions()[13])

  expect(style.length).toBe(1)

  expect(style[0].getImage().getRadius()).toBe(10)
  expect(style[0].getImage().getFill().getColor()).toBe('rgba(246,140,30,.6)')
  expect(style[0].getImage().getStroke().getColor()).toBe('rgb(35,65,138)')
  expect(style[0].getImage().getStroke().getWidth()).toBe(2)
})

test('style is ADACompliant z >= 13', () => {
  expect.assertions(7)

  const feature = new Feature({
    ADACompliant: 'Y'
  })

  const style = styleFn(feature, nycol.TILE_GRID.getResolutions()[10])

  expect(style.length).toBe(2)

  expect(style[0].getImage().getRadius()).toBe(7)
  expect(style[0].getImage().getFill().getColor()).toBe('rgb(35,65,138)')
  expect(style[0].getImage().getStroke().getColor()).toBe('rgb(35,65,138)')
  expect(style[0].getImage().getStroke().getWidth()).toBe(2)

  expect(style[1].getImage().getSrc()).toBe('img/acc.png')
  expect(style[1].getImage().getScale()).toBe(11/30)
})

test('style is ADACompliant z < 13', () => {
  expect.assertions(7)

  const feature = new Feature({
    ADACompliant: 'Y'
  })

  const style = styleFn(feature, nycol.TILE_GRID.getResolutions()[13])

  expect(style.length).toBe(2)

  expect(style[0].getImage().getRadius()).toBe(10)
  expect(style[0].getImage().getFill().getColor()).toBe('rgb(35,65,138)')
  expect(style[0].getImage().getStroke().getColor()).toBe('rgb(35,65,138)')
  expect(style[0].getImage().getStroke().getWidth()).toBe(2)

  expect(style[1].getImage().getSrc()).toBe('img/acc.png')
  expect(style[1].getImage().getScale()).toBe(16/30)
})
