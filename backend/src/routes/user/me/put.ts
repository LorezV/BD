import { User } from '@prisma/client'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { authGuard } from '../../../hooks'
import prisma from '../../../prisma'

interface IBody {
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
}

export async function put(
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply,
): Promise<User> {
  const user = await authGuard(request, reply)

  const newUser = await prisma.user.update({
    where: { id: user.id },
    data: request.body,
  })

  return newUser
}

export default async function init(instance: FastifyInstance) {
  instance.put(
    '/',
    {
      schema: {
        tags: ['user'],
        body: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            phoneNumber: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
        },
      },
    },
    put,
  )

  return Promise.resolve()
}
