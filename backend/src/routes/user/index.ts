import { FastifyInstance } from 'fastify'

import me from './me'

export default async function init(instance: FastifyInstance) {
  await instance.register(me, { prefix: '/me' })
}
