# Servie Vhost

[![NPM version](https://img.shields.io/npm/v/servie-vhost.svg?style=flat)](https://npmjs.org/package/servie-vhost)
[![NPM downloads](https://img.shields.io/npm/dm/servie-vhost.svg?style=flat)](https://npmjs.org/package/servie-vhost)
[![Build status](https://img.shields.io/travis/serviejs/servie-vhost.svg?style=flat)](https://travis-ci.org/serviejs/servie-vhost)
[![Test coverage](https://img.shields.io/coveralls/serviejs/servie-vhost.svg?style=flat)](https://coveralls.io/r/serviejs/servie-vhost?branch=master)

> Simple virtual host middleware for Servie.

## Installation

```
npm install servie-vhost --save
```

## Usage

```ts
import { vhost, getHostFromUrl } from 'servie-vhost'
import { compose } from 'throwback'

const app = compose([
  vhost('admin.example.com', function (req) {
    return send(req, 'Welcome to admin!')
  }),
  vhost(':subdomain.example.com', function (req) {
    return send(req, `Welcome to ${req.vhost[0]} subdomain!`)
  })
])
```

For projects whose `host` is not in the header, they can switch between exported `getHostFromHeader` and `getHostFromUrl` functions, or define their own, as the third argument to `vhost(hostname, fn, getHost)`.

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

Apache 2.0
