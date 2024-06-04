import { FastifyInstance } from 'fastify'

import auth from './auth'
import user from './user'
import podcast from './podcast'
import stream from './stream'

export default async function init(instance: FastifyInstance) {
  await instance.register(auth, { prefix: '/auth' })
  await instance.register(podcast, { prefix: '/podcast' })
  await instance.register(stream, { prefix: '/stream' })
  await instance.register(user, { prefix: '/user' })
}
