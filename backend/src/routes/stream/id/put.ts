import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../../prisma'
import { authGuard } from '../../../hooks'
import { Stream } from '@prisma/client'

export interface IParams {
  streamId: number
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
): Promise<Stream> {
  const user = await authGuard(request, reply)

  const stream = await prisma.stream.findUnique({
    where: { id: request.params.streamId },
  })
  if (!stream) {
    return reply.code(404).send({ error: 'STREAM_NOT_FOUND' })
  }

  const podcast = await prisma.podcast.findUnique({
    where: { id: stream.podcastId },
  })
  if (!podcast) {
    return reply.code(404).send({ error: 'PODCAST_NOT_FOUND' })
  }

  if (podcast.authorId !== user.id) {
    return reply.code(403).send({ error: 'FORBIDDEN' })
  }

  const newStream = await prisma.stream.update({
    where: { id: stream.id },
    data: request.body,
  })

  return newStream
}

export default async function init(instance: FastifyInstance) {
  instance.put(
    '/',
    {
      schema: {
        tags: ['stream'],
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
