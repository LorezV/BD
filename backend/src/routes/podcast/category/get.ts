import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../../prisma'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  return await prisma.podcastCategory.findMany()
}

export default async function init(instance: FastifyInstance) {
  instance.get(
    '/',
    {
      schema: {
        tags: ['podcast-category'],
      },
    },
    get,
  )

  return Promise.resolve()
}
