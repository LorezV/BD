import { FastifyInstance } from 'fastify'

import get from './get'
import post from './post'
import id from './id'
import category from './category'

export default async function init(instance: FastifyInstance) {
  await instance.register(get)
  await instance.register(post)
  await instance.register(id, { prefix: '/:podcastId' })
  await instance.register(category, { prefix: '/category' })
}
