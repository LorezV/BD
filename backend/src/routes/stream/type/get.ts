import { FastifyInstance, FastifyRequest } from 'fastify'
import prisma from '../../../prisma'
import { StreamType } from '@prisma/client'

interface IQuerystring {
  query: string
  startDate: Date
  endDate: Date
  typeId: number
  podcastId: number
}

export async function get(
  request: FastifyRequest<{ Querystring: IQuerystring }>,
): Promise<StreamType[]> {
  return await prisma.streamType.findMany()
}

export default async function init(instance: FastifyInstance) {
  instance.get('/', {}, get)

  return Promise.resolve()
}
