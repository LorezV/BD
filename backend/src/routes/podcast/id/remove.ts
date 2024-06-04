import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../../prisma'
import { authGuard } from '../../../hooks'

export interface IParams {
  podcastId: number
}

export async function remove(request: FastifyRequest<{ Params: IParams }>, reply: FastifyReply) {
  const user = await authGuard(request, reply)

  const podcast = await prisma.podcast.findUnique({
    where: { id: request.params.podcastId },
  })
  if (!podcast) {
    return reply.code(404).send({ error: 'PODCAST_NOT_FOUND' })
  }

  if (podcast.authorId !== user.id) {
    return reply.code(403).send({ error: 'FORBIDDEN' })
  }

  await prisma.podcast.delete({
    where: { id: podcast.id },
  })

  return reply.code(200).send()
}

export default async function init(instance: FastifyInstance) {
  instance.delete(
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
    remove,
  )

  return Promise.resolve()
}
