import App from '../src/js/App'

jest.mock('../src/js/App')

beforeEach(() => {
  App.mockClear()
})

test('index', () => {
  expect.assertions(1)

  require('../src/js/index')

  expect(App).toHaveBeenCalledTimes(1)

})
