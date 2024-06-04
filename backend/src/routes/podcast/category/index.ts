import { FastifyInstance } from 'fastify'

import get from './get'

export default async function init(instance: FastifyInstance) {
  await instance.register(get)
}
