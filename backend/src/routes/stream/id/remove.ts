import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../../prisma'
import { authGuard } from '../../../hooks'

export interface IParams {
  streamId: number
}

export async function remove(request: FastifyRequest<{ Params: IParams }>, reply: FastifyReply) {
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

  await prisma.stream.delete({
    where: { id: stream.id },
  })

  return reply.code(200).send()
}

export default async function init(instance: FastifyInstance) {
  instance.delete(
    '/',
    {
      schema: {
        tags: ['stream'],
        params: {
          type: 'object',
          required: ['streamId'],
          properties: {
            streamId: {
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
