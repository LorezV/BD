import { FastifyInstance } from 'fastify'

import get from './get'
import post from './post'
import id from './id'
import _type from './type'

export default async function init(instance: FastifyInstance) {
  await instance.register(get)
  await instance.register(post)
  await instance.register(id, { prefix: '/:streamId' })
  await instance.register(_type, { prefix: '/type' })
}
