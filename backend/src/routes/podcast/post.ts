import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../prisma'
import { Podcast, Stream } from '@prisma/client'
import { authGuard } from '../../hooks'

interface IBody {
  header: string
  description: string
  coverLink: string
  categoryId: number
}

export async function post(
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply,
): Promise<Podcast> {
  const user = await authGuard(request, reply)
  if (user.Type.name !== 'AUTHOR') {
    return reply.code(403).send('Forbidden')
  }

  const podcast = await prisma.podcast.create({
    data: {
      ...request.body,
      authorId: user.id,
    },
  })

  return podcast
}

export default async function init(instance: FastifyInstance) {
  instance.post(
    '/',
    {
      schema: {
        tags: ['podcast'],
        body: {
          type: 'object',
          properties: {
            header: { type: 'string' },
            description: { type: 'string' },
            coverLink: { type: 'string' },
            categoryId: { type: 'number' },
          },
        },
      },
    },
    post,
  )

  return Promise.resolve()
}
