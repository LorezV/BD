import { FastifyInstance } from 'fastify'

import post from './post'

export default async function init(instance: FastifyInstance) {
  await instance.register(post)
}
