import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../prisma'
import { Stream } from '@prisma/client'
import { authGuard } from '../../hooks'
import dayjs from 'dayjs'

interface IBody {
  header: string
  description: string
  coverLink: string
  postLink: string
  startDate: Date
  endDate: Date
  podcastId: number
}

export async function post(
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply,
): Promise<Stream> {
  const user = await authGuard(request, reply)
  if (user.Type.name !== 'AUTHOR') {
    return reply.code(403).send('Forbidden')
  }

  const stream = await prisma.stream.create({
    data: {
      ...request.body,
      duration: dayjs(request.body.endDate).diff(request.body.startDate),
      typeId: 1,
    },
  })

  return stream
}

export default async function init(instance: FastifyInstance) {
  instance.post(
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
            podcastId: { type: 'number' },
          },
        },
      },
    },
    post,
  )

  return Promise.resolve()
}
