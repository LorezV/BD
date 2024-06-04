import { User } from '@prisma/client'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { authGuard } from '../../../hooks'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const user = await authGuard(request, reply)

  return user
}

export default async function init(instance: FastifyInstance) {
  instance.get(
    '/',
    {
      schema: {
        tags: ['user'],
      },
    },
    get,
  )

  return Promise.resolve()
}
