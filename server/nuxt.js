import consola from 'consola'
import fp from 'fastify-plugin'
import { Nuxt, Builder } from 'nuxt'
import nuxtConfig from '../client/nuxt.config.js'

async function nuxtPlugin (fastify) {
  try {
    const nuxt = new Nuxt({ dev: process.dev, ...nuxtConfig })
    await nuxt.ready()

    fastify.get('/*', (req, reply) => {
      nuxt.render(req.raw, reply.res)
    })

    if (process.dev) {
      process.buildNuxt = () => {
        return new Builder(nuxt).build()
          .catch((buildError) => {
            consola.fatal(buildError)
            process.exit(1)
          })
      }
    }
  } catch (err) {
    console.log(err)
  }
}

export default fp(nuxtPlugin)
