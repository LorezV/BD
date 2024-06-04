import { FastifyInstance, FastifyRequest } from 'fastify'
import prisma from '../../prisma'
import { Stream } from '@prisma/client'

interface IQuerystring {
  query: string
  startDate: Date
  endDate: Date
  typeId: number
  podcastId: number
}

export async function get(
  request: FastifyRequest<{ Querystring: IQuerystring }>,
): Promise<Stream[]> {
  return await prisma.stream.findMany({
    where: {
      podcastId: request.query.podcastId || undefined,
      typeId: request.query.typeId,
      endDate: request.query.endDate || undefined,
      startDate: request.query.startDate || undefined,
    },
    include: {
      Podcast: {
        include: {
          Author: true,
        },
      },
    },
  })
}

export default async function init(instance: FastifyInstance) {
  instance.get(
    '/',
    {
      schema: {
        tags: ['stream'],
        querystring: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            typeId: { type: 'number' },
            podcastId: { type: 'number' },
          },
        },
      },
    },
    get,
  )

  return Promise.resolve()
}
