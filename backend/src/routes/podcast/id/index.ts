import { FastifyInstance } from 'fastify'

import get from './get'
import put from './put'
import remove from './remove'

export default async function init(instance: FastifyInstance) {
  await instance.register(get)
  await instance.register(put)
  await instance.register(remove)
}
