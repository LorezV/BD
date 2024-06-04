import { FastifyInstance, FastifyRequest } from 'fastify'
import prisma from '../../prisma'

interface IQuerystring {
  query?: string
  authorId?: number
  categoryId?: number
}

export async function get(request: FastifyRequest<{ Querystring: IQuerystring }>) {
  return await prisma.podcast.findMany({
    where: {
      ...(request.query.query ? { OR: [{ header: { startsWith: request.query.query } }] } : {}),
      ...(request.query.authorId ? { authorId: request.query.authorId } : {}),
      ...(request.query.categoryId ? { categoryId: request.query.categoryId } : {}),
    },
    include: {
      Author: true,
    },
  })
}

export default async function init(instance: FastifyInstance) {
  instance.get(
    '/',
    {
      schema: {
        tags: ['podcast'],
        querystring: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            authorId: { type: 'number' },
            categoryId: { type: 'number' },
          },
        },
      },
    },
    get,
  )

  return Promise.resolve()
}
