import debug = require('debug')
import pathToRegexp = require('path-to-regexp')
import { Request, Response } from 'servie'

const log = debug('servie-vhost')

export interface RequestVhost {
  vhost: string[]
}

/**
 * Create vhost routing.
 */
export function vhost <T extends Request> (
  path: pathToRegexp.Path,
  fn: (req: T & RequestVhost, done: () => Promise<Response>) => Promise<Response> | Response,
  getHost: (req: T) => string | undefined = getHostFromHeader,
  options?: pathToRegexp.RegExpOptions
) {
  const keys: pathToRegexp.Key[] = []
  const re = pathToRegexp(path, keys, options)

  log(`${path} -> ${re}`)

  return function (req: T, next: () => Promise<Response>): Promise<Response> {
    const h = getHost(req)
    const m = h ? re.exec(hostnameof(h)) : undefined

    if (!m) return next()

    const vhost = m.slice(1)
    debug(`${path} matches ${req.Url.pathname} ${vhost}`)
    return Promise.resolve(fn(Object.assign(req, { vhost }), next))
  }
}

/**
 * Get host from `url`, useful for front-end projects.
 */
export function getHostFromUrl (req: Request) {
  return req.Url.host
}

/**
 * Get host from header, useful for server-side routing.
 */
export function getHostFromHeader (req: Request) {
  return req.headers.get('host')
}

/**
 * Get hostname from host string.
 *
 * Reference: https://github.com/expressjs/vhost/blob/master/index.js
 */
function hostnameof (host: string) {
  const offset = host.charAt(0) === '[' ? host.indexOf(']', 1) : 0
  const index = host.indexOf(':', offset)

  return index === -1 ? host : host.substr(0, index)
}
