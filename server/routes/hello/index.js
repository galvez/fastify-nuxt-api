export default ({ fastify, self }) => {
  fastify.get('/hello', self.msg)
  fastify.get('/hello-with-injection', self.msgWithInjection)
}
