
process.dev = process.env.NODE_ENV !== 'production'

import { join } from 'path'
import consola from 'consola'
import Fastify from 'fastify'
import FastifySensible from 'fastify-sensible'
import nuxtPlugin from './nuxt'
import loaderPlugin from './loader'

const devLogger = {
  level: 'error',
  prettyPrint: {
    levelFirst: true,
  },
}

export async function setup () {
  try {
    const fastify = Fastify({
      pluginTimeout: 60000 * 3,
      logger: process.dev && devLogger,
    })
    const rootInjections = await import('./routes')

    // General purpose plugins
    fastify.register(FastifySensible)
    fastify.register(nuxtPlugin)
    fastify.register(loaderPlugin, {
      baseDir: join(__dirname, 'routes'),
      injections: rootInjections,
      prefix: `/api`,
    })
    return fastify
  } catch (err) {
    consola.error(err)
    process.exit(1)
  }
}

export async function listen (fastify) {
  try {
    if (process.dev) {
      process.bindAddress = 'localhost'
    } else {
      process.bindAddress = process.env.HOST || '0.0.0.0'
    }
    process.bindPort = process.env.PORT || 3000
    await fastify.listen(process.bindPort, process.bindAddress)
    if (process.dev) {
      consola.info(`Listening at http://${process.bindAddress}:${process.bindPort}`)
    }
  } catch (err) {
    consola.error(err)
    process.exit(1)
  }
}
