import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../../prisma'

export interface IParams {
  streamId: number
}

export async function get(request: FastifyRequest<{ Params: IParams }>, reply: FastifyReply) {
  const stream = await prisma.stream.findUnique({
    where: { id: request.params.streamId },
    include: {
      Podcast: {
        include: {
          Author: true,
        },
      },
    },
  })
  if (!stream) {
    return reply.code(404).send({ error: 'STREAM_NOT_FOUND' })
  }

  return stream
}

export default async function init(instance: FastifyInstance) {
  instance.get(
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
    get,
  )

  return Promise.resolve()
}
