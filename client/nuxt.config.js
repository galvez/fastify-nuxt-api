import { resolve } from 'path'

export default {
  srcDir: resolve(__dirname),
  buildDir: resolve(__dirname, '.nuxt'),
  plugins: ['~/plugins/api'],
  modules: ['@nuxtjs/axios'],
  axios: {
    baseURL: 'http://localhost:3000',
  }
}
