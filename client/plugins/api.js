import getClientAPI from '../api'

export default (ctx, inject) => {
  if (process.server) {
    ctx.$api = process.$api
  } else {
    ctx.$api = getClientAPI(ctx.$axios)
  }
  inject('api', ctx.$api)
}
