import { resolve, join } from 'path'
import { writeFile } from 'fs-extra'
import setPath from 'lodash/set'
import FastifyESMLoader, { methodPathSymbol } from 'fastify-esm-loader'
import { 
  translateRequest,
  translateRequestWithPayload,
  generateServerAPIMethods,
  generateClientAPIMethods
} from './gen'

export default async function FastifyESMLoaderWrapper (fastify, options, done) {
  try {
    const api = {}
    const handlers = {}
    fastify.addHook('onRoute', (route) => {
      const name = route.handler[methodPathSymbol]
      if (name) {
        setPath(api, name || route.handler.name, [route.method.toString(), route.url])
        setPath(handlers, name, route.handler)
      }
    })
    await FastifyESMLoader(fastify, options, done)
    await fastify.ready()
    const clientMethods = generateClientAPIMethods(api)
    const apiClientPath = resolve(__dirname, join('..', 'client', 'api.js'))
    await writeFile(apiClientPath, clientMethods)
    const serverMethods = generateServerAPIMethods(api)
    const apiServerPath = resolve(__dirname, join('api.js'))
    await writeFile(apiServerPath, serverMethods)
    const getServerAPI = await import(apiServerPath).then(m => m.default || m)
    process.$api = getServerAPI({ handlers, translateRequest, translateRequestWithPayload })
    if (process.buildNuxt) {
      await process.buildNuxt()
    }
  } catch (err) {
    console.log(err)
  }
}
