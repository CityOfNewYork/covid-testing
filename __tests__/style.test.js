import styleFn from '../src/js/style'

test('style', () => {
  expect.assertions(3)

  const style = styleFn()

  expect(style.getImage().getFill().getColor()).toBe('rgba(246,140,30,.6)')
  expect(style.getImage().getStroke().getColor()).toBe('rgb(35,65,138)')
  expect(style.getImage().getStroke().getWidth()).toBe(2)
})