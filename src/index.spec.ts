import { vhost, getHostFromUrl } from './index'
import { Request, createHeaders } from 'servie'
import { send } from 'servie-send'
import { finalhandler } from 'servie-finalhandler'

describe('servie-route', () => {
  it('should match a route', async () => {
    const app = vhost('example.com', req => send(req, 'hello world'))

    const req = new Request({
      method: 'get',
      url: '/test',
      headers: createHeaders({ Host: 'example.com' })
    })

    const res = await app(req, finalhandler(req))

    expect(res.statusCode).toBe(200)
    expect(await res.body.text()).toBe('hello world')
  })

  it('should not match when path does not equal', async () => {
    const app = vhost('example.com', req => send(req, 'hello world'))

    const req = new Request({ method: 'get', url: '/' })
    const res = await app(req, finalhandler(req))

    expect(res.statusCode).toEqual(404)
  })

  it('should work with parameters', async () => {
    const app = vhost(':id.example.com', (req) => send(req, req.vhost[0]))

    const req = new Request({
      method: 'get',
      url: '/',
      headers: createHeaders({ Host: '1.example.com' })
    })

    const res = await app(req, finalhandler(req))

    expect(await res.body.text()).toEqual('1')
  })

  it('should read host from url', async () => {
    const app = vhost('example.com', req => send(req, 'hello world'), getHostFromUrl)

    const req = new Request({
      method: 'get',
      url: 'http://example.com:8080/'
    })

    const res = await app(req, finalhandler(req))

    expect(await res.body.text()).toEqual('hello world')
  })
})
