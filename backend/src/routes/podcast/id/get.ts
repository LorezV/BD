import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../../prisma'

export interface IParams {
  podcastId: number
}

export async function get(request: FastifyRequest<{ Params: IParams }>, reply: FastifyReply) {
  const podcast = await prisma.podcast.findUnique({
    where: { id: request.params.podcastId },
  })
  if (!podcast) {
    return reply.code(404).send({ error: 'PODCAST_NOT_FOUND' })
  }

  return podcast
}

export default async function init(instance: FastifyInstance) {
  instance.get(
    '/',
    {
      schema: {
        tags: ['podcast'],
        params: {
          type: 'object',
          required: ['podcastId'],
          properties: {
            podcastId: {
              type: 'number',
            },
          },
        },
      },
    },
    get,
  )

  return Promise.resolve()
}
