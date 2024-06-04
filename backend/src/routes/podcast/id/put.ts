import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../../prisma'
import { authGuard } from '../../../hooks'

export interface IParams {
  podcastId: number
}

interface IBody {
  header: string
  description: string
  coverLink: string
  postLink: string
  startDate: Date
  endDate: Date
}

export async function put(
  request: FastifyRequest<{ Body: IBody; Params: IParams }>,
  reply: FastifyReply,
) {
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

  const newPodcast = await prisma.podcast.update({
    where: { id: podcast.id },
    data: request.body,
  })

  return newPodcast
}

export default async function init(instance: FastifyInstance) {
  instance.put(
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
        body: {
          type: 'object',
          properties: {
            header: { type: 'string' },
            description: { type: 'string' },
            coverLink: { type: 'string' },
            postLink: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    put,
  )

  return Promise.resolve()
}
