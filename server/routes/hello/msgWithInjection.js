export default ({ injection }) => (req, reply) => {
  reply.send({ injection })
}
