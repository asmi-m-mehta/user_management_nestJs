import { AuthMiddleware } from './AuthMiddleware'

describe('AuthMiddlewareMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthMiddleware()).toBeDefined()
  })
})
